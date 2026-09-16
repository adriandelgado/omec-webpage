import { form } from "$app/server";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "#lib/server/db/index.js";
import { contact_content } from "#lib/server/db/schema.js";
import { contact_form_schema } from "./contact-form";
export const send_contact_message = form(contact_form_schema, async (data) => {
	console.log(data);
	const [content] = await db
		.select({ success_message: contact_content.form_success_message })
		.from(contact_content)
		.where(eq(contact_content.id, 1));
	if (!content) error(500, "Required page content is missing: contact");
	return { success: true as const, message: content.success_message };
});
