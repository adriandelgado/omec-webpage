import { form } from "$app/server";
import { content_repository } from "#lib/server/content-repository-instance.js";
import { contact_form_schema } from "./contact-form";

export const send_contact_message = form(contact_form_schema, async (data) => {
	console.log(data);
	const success_message = await content_repository.get_contact_success_message();
	return {
		success: true as const,
		message: success_message,
	};
});
