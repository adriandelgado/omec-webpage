import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { asc, eq } from "drizzle-orm";
import { renderHtml } from "@tanstack/markdown";

export const get_content = query(async () => {
	const [
		[row],
		home_information_item_rows,
		home_olympiad_card_rows,
		home_national_fact_rows,
		sponsors,
	] = await Promise.all([
		db.select().from(schema.home_content).where(eq(schema.home_content.id, 1)),
		db
			.select({
				id: schema.home_information_item.id,
				title: schema.home_information_item.title,
				icon: schema.home_information_item.icon,
				href: schema.home_information_item.href,
			})
			.from(schema.home_information_item)
			.where(eq(schema.home_information_item.content_id, 1))
			.orderBy(asc(schema.home_information_item.sort_order)),
		db
			.select({
				id: schema.home_olympiad_card.id,
				title: schema.home_olympiad_card.title,
				description: schema.home_olympiad_card.description,
				href: schema.home_olympiad_card.href,
				link_label: schema.home_olympiad_card.link_label,
			})
			.from(schema.home_olympiad_card)
			.where(eq(schema.home_olympiad_card.content_id, 1))
			.orderBy(asc(schema.home_olympiad_card.sort_order)),
		db
			.select()
			.from(schema.home_national_fact)
			.where(eq(schema.home_national_fact.content_id, 1))
			.orderBy(asc(schema.home_national_fact.sort_order)),
		db
			.select({
				id: schema.sponsor.id,
				asset_key: schema.sponsor.asset_key,
				name: schema.sponsor.name,
				image_alt: schema.sponsor.image_alt,
			})
			.from(schema.sponsor_placement)
			.innerJoin(schema.sponsor, eq(schema.sponsor.id, schema.sponsor_placement.sponsor_id))
			.where(eq(schema.sponsor_placement.page_key, "home"))
			.orderBy(asc(schema.sponsor_placement.sort_order)),
	]);
	if (!row) error(500, "Required page content is missing: home");
	if (!sponsors.length) error(500, "Required sponsor placement is missing: home");

	return {
		seo: {
			title: row.seo_title,
			description: row.seo_description,
		},
		hero: {
			title: row.hero_title,
			highlight: row.hero_highlight,
			image_alt: row.hero_image_alt,
		},
		national_olympiad: {
			link_label: row.national_olympiad_link_label,
			link_href: row.national_olympiad_link_href,
			information_items: home_information_item_rows,
		},
		about: {
			eyebrow: row.about_eyebrow,
			title: row.about_title,
			description_html: renderHtml(row.about_description_markdown, { allowHtml: false }),
			link_label: row.about_link_label,
			link_href: row.about_link_href,
			image_alt: row.about_image_alt,
		},
		sponsor: {
			title: row.sponsor_title,
			id: sponsors[0].id,
			asset_key: sponsors[0].asset_key,
			image_alt: sponsors[0].image_alt,
		},
		olympiad_cards: home_olympiad_card_rows,
		national_facts: {
			title: row.national_facts_title,
			image_alt: row.national_facts_image_alt,
			facts: home_national_fact_rows.map((item) => item.text),
		},
		follow: {
			eyebrow: row.follow_eyebrow,
			title: row.follow_title,
		},
	};
});
