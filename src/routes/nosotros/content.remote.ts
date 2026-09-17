import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq } from "drizzle-orm";

export const get_content = query(async () => {
	const [[row], about_value_card_rows, values, team] = await Promise.all([
		db.select().from(schema.about_content).where(eq(schema.about_content.id, 1)),
		db
			.select()
			.from(schema.about_value_card)
			.where(eq(schema.about_value_card.content_id, 1))
			.orderBy(asc(schema.about_value_card.sort_order)),
		db
			.select({ card_number: schema.about_value.card_number, text: schema.about_value.text })
			.from(schema.about_value)
			.innerJoin(
				schema.about_value_card,
				eq(schema.about_value.card_number, schema.about_value_card.number),
			)
			.where(eq(schema.about_value_card.content_id, 1))
			.orderBy(asc(schema.about_value.card_number), asc(schema.about_value.sort_order)),
		db
			.select({
				id: schema.team_member.id,
				asset_key: schema.team_member.asset_key,
				name: schema.team_member.name,
				role: schema.team_member.role,
				contact: schema.team_member.contact,
				image_alt: schema.team_member.image_alt,
				placement: schema.team_member_placement.placement,
			})
			.from(schema.team_member_placement)
			.innerJoin(
				schema.team_member,
				eq(schema.team_member.id, schema.team_member_placement.team_member_id),
			)
			.where(eq(schema.team_member_placement.page_key, "about"))
			.orderBy(
				asc(schema.team_member_placement.placement),
				asc(schema.team_member_placement.sort_order),
			),
	]);
	if (!row) error(500, "Required page content is missing: about");

	return {
		seo: {
			title: row.seo_title,
			description: row.seo_description,
			image_alt: row.seo_image_alt,
		},
		alert: row.alert,
		labor: {
			eyebrow: row.labor_eyebrow,
			title: row.labor_title,
			description: row.labor_description,
			image_alt: row.labor_image_alt,
		},
		values_cards: about_value_card_rows.map((card) => ({
			number: card.number,
			title: card.title,
			description: card.description,
			values: values
				.filter((value) => value.card_number === card.number)
				.map((value) => value.text),
		})),
		members_heading: row.members_heading,
		team: {
			eyebrow: row.team_eyebrow,
			title: row.team_title,
		},
		members: team.filter((member) => member.placement === "member").map((member) => member.name),
		directors: team
			.filter((member) => member.placement === "director")
			.map((member) => {
				if (!member.role || !member.image_alt)
					error(500, `Director content is incomplete: ${member.id}`);
				return {
					id: member.id,
					asset_key: member.asset_key,
					name: member.name,
					role: member.role,
					contact: member.contact ?? undefined,
					image_alt: member.image_alt,
				};
			}),
	};
});
