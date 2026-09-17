import { form } from "$app/server";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "#lib/server/db/index.js";
import { contact_content, contact_submission } from "#lib/server/db/schema.js";
import { verify_turnstile_token } from "#lib/server/turnstile.js";
import { contact_form_schema } from "./contact-form";

export const send_contact_message = form(contact_form_schema, async (data) => {
	const captcha_is_valid = await verify_turnstile_token(data.turnstile_token);

	if (!captcha_is_valid) {
		return {
			success: false as const,
			message: "No se pudo verificar la seguridad del formulario. Inténtalo de nuevo.",
		};
	}

	const [content] = await db
		.select({ success_message: contact_content.form_success_message })
		.from(contact_content)
		.where(eq(contact_content.id, 1));
	if (!content) error(500, "Required page content is missing: contact");
	await db.insert(contact_submission).values({
		full_name: data.full_name,
		email: data.email,
		institution: data.institution,
		subject: data.subject,
		message: data.message,
	});

	return { success: true as const, message: content.success_message };
});
