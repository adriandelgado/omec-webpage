import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { eq } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row]] = await Promise.all([
		db.select().from(schema.news_content).where(eq(schema.news_content.id, 1)),
	]);
	if (!row) error(500, "Required page content is missing: news");

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
	};
});
