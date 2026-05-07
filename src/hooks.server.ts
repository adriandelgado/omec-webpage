import type { Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";

const handle_auth: Handle = async ({ event, resolve }) => {
	const session_token = event.cookies.get(auth.SESSION_COOKIE_NAME);

	event.locals.user = null;
	event.locals.session = null;

	if (!session_token) {
		return resolve(event);
	}

	const parsed_token = auth.parse_token(session_token);

	if (!parsed_token) {
		auth.delete_session_token_cookie(event);
		return resolve(event);
	}

	const { session, user } = await auth.validate_session_token(event, parsed_token);

	if (!session) {
		auth.delete_session_token_cookie(event);
		return resolve(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handle_auth;
