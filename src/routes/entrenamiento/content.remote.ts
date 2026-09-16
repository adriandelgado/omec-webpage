import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], materials] = await Promise.all([
		db.select().from(schema.training_content).where(eq(schema.training_content.id, 1)),
		db
			.select({
				id: schema.training_material.id,
				title: schema.training_material.title,
				description: schema.training_material.description,
				icon: schema.training_material.icon,
				image_alt: schema.training_material.image_alt,
				href: schema.training_material.href,
			})
			.from(schema.training_material)
			.orderBy(asc(schema.training_material.sort_order)),
	]);
	if (!row) error(500, "Required page content is missing: training");

	return {
		seo: {
			title: row.seo_title,
			description: row.seo_description,
		},
		intro: {
			title: row.intro_title,
			description: row.intro_description,
		},
		section: {
			title: row.section_title,
			description: row.section_description,
		},
		materials,
	};
});
