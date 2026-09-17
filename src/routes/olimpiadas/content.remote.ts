import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq, and, isNull } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], olympiads_title_line_rows, olympiads_route_card_rows] = await Promise.all([
		db.select().from(schema.olympiads_content).where(eq(schema.olympiads_content.id, 1)),
		db
			.select()
			.from(schema.olympiads_title_line)
			.where(
				and(
					eq(schema.olympiads_title_line.content_id, 1),
					isNull(schema.olympiads_title_line.archived_at),
				),
			)
			.orderBy(asc(schema.olympiads_title_line.sort_order)),
		db
			.select({ label: schema.olympiads_route_card.label, href: schema.olympiads_route_card.href })
			.from(schema.olympiads_route_card)
			.where(
				and(
					eq(schema.olympiads_route_card.content_id, 1),
					isNull(schema.olympiads_route_card.archived_at),
				),
			)
			.orderBy(asc(schema.olympiads_route_card.sort_order)),
	]);
	if (!row) error(500, "Required page content is missing: olympiads");

	return {
		intro: {
			title_lines: olympiads_title_line_rows.map((line) => ({
				text: line.text,
				class: line.emphasis ? "text-primary" : undefined,
			})),
			description: row.intro_description,
		},
		section_title: row.section_title,
		routes: olympiads_route_card_rows,
	};
});
