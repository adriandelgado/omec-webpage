import { form } from "$app/server";
import { db } from "$lib/server/db";
import { contact_submission } from "$lib/server/db/schema";
import { contact_form_schema } from "./contact-form";

export const send_contact_message = form(contact_form_schema, async (data) => {
	await db.insert(contact_submission).values(data);

	return {
		success: true as const,
		message: "Gracias por escribirnos. Recibimos tu mensaje y te responderemos pronto.",
	};
});
