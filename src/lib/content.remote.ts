import { format_stage_date } from "#lib/content-dates.js";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq } from "drizzle-orm";

export const get_site_content = query(async () => {
	const [[row], social_links] = await Promise.all([
		db.select().from(schema.site_content).where(eq(schema.site_content.id, 1)),
		db
			.select({
				id: schema.social_link.id,
				label: schema.social_link.label,
				href: schema.social_link.href,
				brand_key: schema.social_link.brand_key,
				path: schema.social_link.icon_path,
			})
			.from(schema.social_link)
			.orderBy(asc(schema.social_link.sort_order)),
	]);
	if (!row) error(500, "Required page content is missing: site");

	return {
		contact: {
			email: row.contact_email,
			email_href: row.contact_email_href,
		},
		copyright_year: new Date().getFullYear(),
		social_links,
	};
});

export const get_national_olympiad = query(async () => {
	const [olympiad] = await db
		.select({
			id: schema.national_olympiad.id,
			title: schema.national_olympiad.title,
			announcement: schema.national_olympiad.announcement,
		})
		.from(schema.national_olympiad)
		.where(eq(schema.national_olympiad.is_current, true))
		.limit(1);
	if (!olympiad) {
		error(500, "Required national olympiad is missing: current");
	}
	const stages = await db
		.select({
			label: schema.national_olympiad_stage.label,
			date_label: schema.national_olympiad_stage.date_label,
			starts_on: schema.national_olympiad_stage.starts_on,
			ends_on: schema.national_olympiad_stage.ends_on,
		})
		.from(schema.national_olympiad_stage)
		.where(eq(schema.national_olympiad_stage.national_olympiad_id, olympiad.id))
		.orderBy(asc(schema.national_olympiad_stage.sort_order));
	return {
		title: olympiad.title,
		announcement: olympiad.announcement,
		stages: stages.map((stage) => ({ label: stage.label, date: format_stage_date(stage) })),
	};
});
