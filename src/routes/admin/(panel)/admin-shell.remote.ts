// TODO: made with vibecoding. please clean up

import { form, getRequestEvent, query } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { delete_session_token_cookie, invalidate_session } from "$lib/server/auth";
import { require_admin_context } from "$lib/server/admin";

export const get_admin_context = query(async () => {
	return require_admin_context();
});

export const logout_admin = form(async () => {
	const admin_context = await require_admin_context();
	const request_event = getRequestEvent();

	await invalidate_session(request_event, admin_context.session.id);
	delete_session_token_cookie(request_event);

	redirect(303, "/admin");
});
