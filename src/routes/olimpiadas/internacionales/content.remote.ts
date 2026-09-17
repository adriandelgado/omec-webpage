import { resolve_media } from "#lib/server/media/resolve.js";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq, and, isNull } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], sponsors, olympiads] = await Promise.all([
		db.select().from(schema.international_content).where(eq(schema.international_content.id, 1)),
		db
			.select({
				id: schema.sponsor.id,
				asset_key: schema.sponsor.asset_key,
				media_id: schema.sponsor.media_id,
				name: schema.sponsor.name,
				image_alt: schema.sponsor.image_alt,
			})
			.from(schema.sponsor_placement)
			.innerJoin(schema.sponsor, eq(schema.sponsor.id, schema.sponsor_placement.sponsor_id))
			.where(
				and(
					eq(schema.sponsor_placement.page_key, "international"),
					isNull(schema.sponsor.archived_at),
					isNull(schema.sponsor_placement.archived_at),
				),
			)
			.orderBy(asc(schema.sponsor_placement.sort_order)),
		db
			.select({
				id: schema.international_olympiad.id,
				asset_key: schema.international_olympiad.asset_key,
				media_id: schema.international_olympiad.media_id,
				name: schema.international_olympiad.name,
				description: schema.international_olympiad.description,
				image_alt: schema.international_olympiad.image_alt,
				href: schema.international_olympiad.href,
			})
			.from(schema.international_olympiad)
			.where(and(isNull(schema.international_olympiad.archived_at)))
			.orderBy(asc(schema.international_olympiad.sort_order)),
	]);
	if (!row) error(500, "Required page content is missing: international");

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
		sponsors: {
			eyebrow: row.sponsors_eyebrow,
			items: await Promise.all(
				sponsors.map(async (sponsor) => ({
					...sponsor,
					image_url: await resolve_media(sponsor.media_id),
				})),
			),
		},
		olympiads: await Promise.all(
			olympiads.map(async (olympiad) => ({
				...olympiad,
				image_url: await resolve_media(olympiad.media_id),
				href: olympiad.href ?? undefined,
			})),
		),
	};
});
