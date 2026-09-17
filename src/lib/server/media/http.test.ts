import { describe, expect, it, vi } from "vitest";
import { GET, HEAD } from "../../../routes/media/[id]/[filename]/+server";
vi.mock("#lib/server/media/bucket.js", () => ({ media_bucket: () => BUCKET }));

vi.mock("#lib/server/db/index.js", () => ({
	client: {
		execute: async () => ({
			rows: [
				{
					id: "11111111-1111-4111-8111-111111111111",
					object_key: "object",
					original_filename: "test.png",
					mime_type: "image/png",
					archived_at: null,
				},
			],
		}),
	},
}));
const BODY = new TextEncoder().encode("0123456789");
const BUCKET = {
	head: async () => ({ size: BODY.length, httpEtag: '"etag"' }),
	get: async (_key: string, options?: { range: { offset: number; length: number } }) => ({
		body: new ReadableStream({
			start(controller) {
				controller.enqueue(
					options
						? BODY.slice(options.range.offset, options.range.offset + options.range.length)
						: BODY,
				);
				controller.close();
			},
		}),
	}),
};
function event(method: string, headers: Record<string, string> = {}) {
	return {
		params: { id: "11111111-1111-4111-8111-111111111111", filename: "test.png" },
		request: new Request("https://example.org/media/test", { method, headers }),
		platform: { env: { MEDIA_BUCKET: BUCKET } },
	} as unknown as Parameters<typeof GET>[0];
}
describe("private R2 media delivery", () => {
	it("serves exact content metadata, immutable caching and a HEAD without a body", async () => {
		const response = await GET(event("GET"));
		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toBe("image/png");
		expect(response.headers.get("Content-Length")).toBe("10");
		expect(response.headers.get("Cache-Control")).toContain("immutable");
		expect(response.headers.get("Content-Security-Policy")).toContain("sandbox");
		expect(await response.text()).toBe("0123456789");
		expect(await (await HEAD(event("HEAD"))).text()).toBe("");
	});
	it("handles conditional GET, bounded ranges, suffix ranges and unsatisfiable ranges", async () => {
		expect((await GET(event("GET", { "If-None-Match": 'W/"etag"' }))).status).toBe(304);
		const bounded = await GET(event("GET", { Range: "bytes=2-4" }));
		expect(bounded.status).toBe(206);
		expect(bounded.headers.get("Content-Range")).toBe("bytes 2-4/10");
		expect(await bounded.text()).toBe("234");
		expect(await (await GET(event("GET", { Range: "bytes=-3" }))).text()).toBe("789");
		expect((await GET(event("GET", { Range: "bytes=20-" }))).status).toBe(416);
		expect((await GET(event("GET", { Range: "bytes=2-4", "If-Range": '"other"' }))).status).toBe(
			200,
		);
	});
});
