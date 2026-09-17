import type { Handle } from "@sveltejs/kit/hooks";
import "#lib/server/validation.js";
import { client } from "#lib/server/db/index.js";
import { resolve_session, SESSION_COOKIE } from "#lib/server/auth/sessions.js";

export const handle: Handle = async ({ event, resolve }) => {
	const session = await resolve_session(client, event.cookies.get(SESSION_COOKIE));
	event.locals.admin = session?.user ?? null;
	event.locals.session_digest = session?.digest ?? null;
	const response = await resolve(event, {
		preload: ({ type }) => type === "js" || type === "css" || type === "font",
	});
	if (event.url.pathname.startsWith("/admin")) {
		response.headers.set("Cache-Control", "private, no-store");
		response.headers.set("X-Robots-Tag", "noindex, nofollow");
		response.headers.set("Referrer-Policy", "same-origin");
	}
	return response;
};
