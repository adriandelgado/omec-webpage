import { form } from "$app/server";
import { contact_form_schema } from "./contact-form";

export const send_contact_message = form(contact_form_schema, async (data) => {
	console.log(data);
	return {
		success: true as const,
		message: "Gracias por escribirnos. Recibimos tu mensaje y te responderemos pronto.",
	};
});
