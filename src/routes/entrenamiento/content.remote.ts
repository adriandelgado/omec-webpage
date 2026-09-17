import { resolve_media } from "#lib/server/media/resolve.js";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq, and, isNull } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], materials] = await Promise.all([
		db.select().from(schema.training_content).where(eq(schema.training_content.id, 1)),
		db
			.select({
				id: schema.training_material.id,
				asset_key: schema.training_material.asset_key,
				media_id: schema.training_material.media_id,
				title: schema.training_material.title,
				description: schema.training_material.description,
				icon: schema.training_material.icon,
				image_alt: schema.training_material.image_alt,
				href: schema.training_material.href,
			})
			.from(schema.training_material)
			.where(and(isNull(schema.training_material.archived_at)))
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
		materials: await Promise.all(
			materials.map(async (material) => ({
				...material,
				image_url: await resolve_media(material.media_id),
			})),
		),
	};
});
