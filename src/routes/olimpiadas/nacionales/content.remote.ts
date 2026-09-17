import { resolve_media } from "#lib/server/media/resolve.js";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq, and, isNull } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], national_prize_paragraph_rows, national_fact_rows, [current]] = await Promise.all([
		db.select().from(schema.national_content).where(eq(schema.national_content.id, 1)),
		db
			.select()
			.from(schema.national_prize_paragraph)
			.where(
				and(
					eq(schema.national_prize_paragraph.content_id, 1),
					isNull(schema.national_prize_paragraph.archived_at),
				),
			)
			.orderBy(asc(schema.national_prize_paragraph.sort_order)),
		db
			.select({ id: schema.national_fact.id, text: schema.national_fact.text })
			.from(schema.national_fact)
			.where(and(eq(schema.national_fact.content_id, 1), isNull(schema.national_fact.archived_at)))
			.orderBy(asc(schema.national_fact.sort_order)),
		db
			.select()
			.from(schema.national_olympiad)
			.where(
				and(
					eq(schema.national_olympiad.is_current, true),
					isNull(schema.national_olympiad.archived_at),
				),
			)
			.limit(1),
	]);
	if (!row) error(500, "Required page content is missing: national");
	if (!current) error(500, "Required national olympiad is missing: current");
	const levels = await db
		.select({
			id: schema.national_olympiad_level.id,
			name: schema.national_olympiad_level.name,
			description: schema.national_olympiad_level.description,
		})
		.from(schema.national_olympiad_level)
		.where(
			and(
				eq(schema.national_olympiad_level.national_olympiad_id, current.id),
				isNull(schema.national_olympiad_level.archived_at),
			),
		)
		.orderBy(asc(schema.national_olympiad_level.sort_order));

	return {
		seo: {
			title: row.seo_title,
			description: row.seo_description,
		},
		information: {
			eyebrow: row.information_eyebrow,
			title: row.information_title,
			description: row.information_description,
			registration_title: row.information_registration_title,
			registration_description: row.information_registration_description,
		},
		follow: {
			eyebrow: row.follow_eyebrow,
			title: row.follow_title,
			description: row.follow_description,
		},
		levels: {
			eyebrow: row.levels_eyebrow,
			title: row.levels_title,
			description: row.levels_description,
			items: levels,
		},
		preparation: {
			eyebrow: row.preparation_eyebrow,
			title: row.preparation_title,
			description: row.preparation_description,
			href: row.preparation_href,
			link_label: row.preparation_link_label,
		},
		prizes: {
			eyebrow: row.prizes_eyebrow,
			title: row.prizes_title,
			paragraphs: national_prize_paragraph_rows.map((item) => item.text),
		},
		awards: {
			eyebrow: row.awards_eyebrow,
			image_alt: row.awards_image_alt,
			image_url: await resolve_media(row.awards_media_id),
		},
		video: {
			href: row.video_href,
			image_alt: row.video_image_alt,
			image_url: await resolve_media(row.video_media_id),
			label: row.video_label,
		},
		facts: national_fact_rows,
	};
});
