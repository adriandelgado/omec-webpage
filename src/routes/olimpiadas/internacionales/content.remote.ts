import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], sponsors, olympiads] = await Promise.all([
		db.select().from(schema.international_content).where(eq(schema.international_content.id, 1)),
		db
			.select({
				id: schema.sponsor.id,
				name: schema.sponsor.name,
				image_alt: schema.sponsor.image_alt,
			})
			.from(schema.sponsor_placement)
			.innerJoin(schema.sponsor, eq(schema.sponsor.id, schema.sponsor_placement.sponsor_id))
			.where(eq(schema.sponsor_placement.page_key, "international"))
			.orderBy(asc(schema.sponsor_placement.sort_order)),
		db
			.select({
				id: schema.international_olympiad.id,
				name: schema.international_olympiad.name,
				description: schema.international_olympiad.description,
				image_alt: schema.international_olympiad.image_alt,
				href: schema.international_olympiad.href,
			})
			.from(schema.international_olympiad)
			.orderBy(asc(schema.international_olympiad.sort_order)),
	]);
	if (!row) error(500, "Required page content is missing: international");
	if (!sponsors.length) error(500, "Required sponsor placement is missing: international");

	return {
		seo: {
			title: row.seo_title,
			description: row.seo_description,
		},
		intro: {
			eyebrow: row.intro_eyebrow,
			title: row.intro_title,
			description: row.intro_description,
		},
		sponsors: { eyebrow: row.sponsors_eyebrow, items: sponsors },
		olympiads: olympiads.map((olympiad) => ({ ...olympiad, href: olympiad.href ?? undefined })),
	};
});
