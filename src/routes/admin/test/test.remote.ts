import { getRequestEvent, query } from "$app/server";
import { redirect } from "@sveltejs/kit";

function get_user() {
	const event = getRequestEvent();

	if (!event.locals.user) {
		redirect(307, "/admin");
	}

	return event.locals.user;
}

export const get_protected_text = query(() => {
	void get_user();

	return "super secret";
});
