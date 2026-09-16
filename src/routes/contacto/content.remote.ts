import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { eq } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row]] = await Promise.all([
		db.select().from(schema.contact_content).where(eq(schema.contact_content.id, 1)),
	]);
	if (!row) error(500, "Required page content is missing: contact");

	return {
		seo: {
			title: row.seo_title,
			description: row.seo_description,
		},
		intro: {
			title: row.intro_title,
			description: row.intro_description,
		},
		contact: {
			heading: row.contact_heading,
			card_title: row.contact_card_title,
		},
		follow: {
			heading: row.follow_heading,
			description: row.follow_description,
		},
		form: {
			title: row.form_title,
			required_notice_before: row.form_required_notice_before,
			required_notice_after: row.form_required_notice_after,
			invalid_notice: row.form_invalid_notice,
			fields: {
				full_name: {
					label: row.form_fields_full_name_label,
					placeholder: row.form_fields_full_name_placeholder,
				},
				email: {
					label: row.form_fields_email_label,
					placeholder: row.form_fields_email_placeholder,
				},
				institution: {
					label: row.form_fields_institution_label,
					placeholder: row.form_fields_institution_placeholder,
				},
				subject: {
					label: row.form_fields_subject_label,
					placeholder: row.form_fields_subject_placeholder,
				},
				message: {
					label: row.form_fields_message_label,
					placeholder: row.form_fields_message_placeholder,
					help: row.form_fields_message_help,
				},
			},
			submit_label: row.form_submit_label,
			pending_label: row.form_pending_label,
		},
	};
});
