import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { client } from "#lib/server/db/index.js";
import { select_one } from "#lib/server/cms/transactions.js";
import { media_bucket } from "#lib/server/media/bucket.js";

const serve: RequestHandler = async ({ params, request }) => {
	if (!/^[0-9a-f-]{36}$/.test(params.id)) error(404);
	const asset = await select_one(
		client,
		"SELECT * FROM media_asset WHERE id = ? AND original_filename = ?",
		[params.id, params.filename],
	);
	if (!asset || !media_bucket()) error(404);
	const bucket = media_bucket();
	const object = await bucket.head(String(asset.object_key));
	if (!object) error(404);
	const headers = new Headers({
		"Content-Type": String(asset.mime_type),
		"Content-Length": String(object.size),
		ETag: object.httpEtag,
		"Cache-Control": "public, max-age=31536000, immutable",
		"Accept-Ranges": "bytes",
		"X-Content-Type-Options": "nosniff",
		"Content-Security-Policy": "default-src 'none'; sandbox",
		"Content-Disposition":
			(asset.mime_type === "application/pdf" ? "attachment" : "inline") +
			'; filename="' +
			String(asset.original_filename).replace(/["\r\n]/g, "") +
			'"',
	});
	const etags = request.headers
		.get("if-none-match")
		?.split(",")
		.map((s) => s.trim().replace(/^W\//, ""));
	if (etags?.includes(object.httpEtag) || etags?.includes("*")) {
		headers.delete("Content-Length");
		return new Response(null, { status: 304, headers });
	}
	let range: { offset: number; length: number } | undefined;
	const requested = request.headers.get("range");
	if (
		request.method !== "HEAD" &&
		requested &&
		(!request.headers.get("if-range") || request.headers.get("if-range") === object.httpEtag)
	) {
		const match = /^bytes=(\d*)-(\d*)$/.exec(requested);
		const start = match?.[1] ? Number(match[1]) : Math.max(0, object.size - Number(match?.[2]));
		const end = match?.[1]
			? match[2]
				? Math.min(Number(match[2]), object.size - 1)
				: object.size - 1
			: object.size - 1;
		if (
			!match ||
			(!match[1] && !match[2]) ||
			!Number.isSafeInteger(start) ||
			!Number.isSafeInteger(end) ||
			start > end ||
			start >= object.size
		) {
			headers.set("Content-Range", "bytes */" + object.size);
			headers.set("Content-Length", "0");
			return new Response(null, { status: 416, headers });
		}
		range = { offset: start, length: end - start + 1 };
		headers.set("Content-Range", "bytes " + start + "-" + end + "/" + object.size);
		headers.set("Content-Length", String(range.length));
	}
	if (request.method === "HEAD") return new Response(null, { headers });
	const body = await bucket.get(String(asset.object_key), range ? { range } : undefined);
	if (!body) error(404);
	return new Response(body.body, { status: range ? 206 : 200, headers });
};
export const GET = serve;
export const HEAD = serve;
