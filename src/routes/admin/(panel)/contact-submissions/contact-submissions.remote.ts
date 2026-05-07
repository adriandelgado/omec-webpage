// TODO: made with vibecoding. please clean up

import * as v from "valibot";
import { form, query, requested } from "$app/server";
import { invalid } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import { require_admin_context } from "$lib/server/admin";
import { db } from "$lib/server/db";
import { contact_submission } from "$lib/server/db/schema";

const update_contact_submission_schema = v.object({
	submission_id: v.pipe(v.string(), v.nonEmpty("Mensaje inválido.")),
	read_at: v.optional(v.string(), ""),
});

export const get_contact_submissions = query(async () => {
	await require_admin_context();

	return db
		.select({
			id: contact_submission.id,
			full_name: contact_submission.full_name,
			email: contact_submission.email,
			institution: contact_submission.institution,
			subject: contact_submission.subject,
			message: contact_submission.message,
			read_at: contact_submission.read_at,
			created_at: contact_submission.created_at,
		})
		.from(contact_submission)
		.orderBy(desc(contact_submission.created_at));
});

export const update_contact_submission_read_at = form(
	update_contact_submission_schema,
	async (data) => {
		await require_admin_context();

		const parsed_submission_id = Number.parseInt(data.submission_id, 10);
		if (!Number.isInteger(parsed_submission_id) || parsed_submission_id < 1) {
			invalid("Mensaje inválido.");
		}

		const [submission_row] = await db
			.select({ id: contact_submission.id })
			.from(contact_submission)
			.where(eq(contact_submission.id, parsed_submission_id))
			.limit(1);

		if (!submission_row) {
			invalid("Mensaje no encontrado.");
		}

		const read_at = data.read_at ? new Date(data.read_at) : null;
		if (read_at && Number.isNaN(read_at.getTime())) {
			invalid("Ingresa una fecha válida.");
		}

		await db
			.update(contact_submission)
			.set({
				read_at,
			})
			.where(eq(contact_submission.id, parsed_submission_id));

		await requested(get_contact_submissions, 1).refreshAll();

		return {
			success: true as const,
			message: "Estado de lectura actualizado correctamente.",
		};
	},
);
