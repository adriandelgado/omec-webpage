import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

// SQLite CHECK accepts NULL, so use IS to reject unparseable dates as well.
const iso_date = (column: import("drizzle-orm/sqlite-core").AnySQLiteColumn) =>
	sql`${column} glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date(${column}, '+0 days') is ${column}`;

const created_at = () =>
	integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`);

const updated_at = () =>
	integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date());

export const site_content = sqliteTable(
	"site_content",
	{
		id: integer("id").primaryKey().default(1),
		contact_email: text("contact_email").notNull(),
		contact_email_href: text("contact_email_href").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("site_content_singleton", sql`${table.id} = 1`)],
);

export const home_content = sqliteTable(
	"home_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		hero_title: text("hero_title").notNull(),
		hero_highlight: text("hero_highlight").notNull(),
		hero_image_alt: text("hero_image_alt").notNull(),
		national_olympiad_link_label: text("national_olympiad_link_label").notNull(),
		national_olympiad_link_href: text("national_olympiad_link_href", {
			enum: ["/olimpiadas/nacionales"],
		}).notNull(),
		about_eyebrow: text("about_eyebrow").notNull(),
		about_title: text("about_title").notNull(),
		about_description_markdown: text("about_description_markdown").notNull(),
		about_link_label: text("about_link_label").notNull(),
		about_link_href: text("about_link_href", { enum: ["/nosotros"] }).notNull(),
		about_image_alt: text("about_image_alt").notNull(),
		sponsor_title: text("sponsor_title").notNull(),
		national_facts_title: text("national_facts_title").notNull(),
		national_facts_image_alt: text("national_facts_image_alt").notNull(),
		follow_eyebrow: text("follow_eyebrow").notNull(),
		follow_title: text("follow_title").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("home_content_singleton", sql`${table.id} = 1`)],
);

export const contact_content = sqliteTable(
	"contact_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		intro_title: text("intro_title").notNull(),
		intro_description: text("intro_description").notNull(),
		contact_heading: text("contact_heading").notNull(),
		contact_card_title: text("contact_card_title").notNull(),
		follow_heading: text("follow_heading").notNull(),
		follow_description: text("follow_description").notNull(),
		form_title: text("form_title").notNull(),
		form_required_notice_before: text("form_required_notice_before").notNull(),
		form_required_notice_after: text("form_required_notice_after").notNull(),
		form_invalid_notice: text("form_invalid_notice").notNull(),
		form_fields_full_name_label: text("form_fields_full_name_label").notNull(),
		form_fields_full_name_placeholder: text("form_fields_full_name_placeholder").notNull(),
		form_fields_email_label: text("form_fields_email_label").notNull(),
		form_fields_email_placeholder: text("form_fields_email_placeholder").notNull(),
		form_fields_institution_label: text("form_fields_institution_label").notNull(),
		form_fields_institution_placeholder: text("form_fields_institution_placeholder").notNull(),
		form_fields_subject_label: text("form_fields_subject_label").notNull(),
		form_fields_subject_placeholder: text("form_fields_subject_placeholder").notNull(),
		form_fields_message_label: text("form_fields_message_label").notNull(),
		form_fields_message_placeholder: text("form_fields_message_placeholder").notNull(),
		form_fields_message_help: text("form_fields_message_help").notNull(),
		form_submit_label: text("form_submit_label").notNull(),
		form_pending_label: text("form_pending_label").notNull(),
		form_success_message: text("form_success_message").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("contact_content_singleton", sql`${table.id} = 1`)],
);

export const contact_submission = sqliteTable(
	"contact_submission",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		full_name: text("full_name").notNull(),
		email: text("email").notNull(),
		institution: text("institution").notNull(),
		subject: text("subject").notNull(),
		message: text("message").notNull(),
		created_at: created_at(),
		read_at: integer("read_at", { mode: "timestamp_ms" }),
		status: text("status", { enum: ["unread", "read", "archived", "spam"] })
			.notNull()
			.default("unread"),
		updated_at: updated_at(),
	},
	(table) => [
		index("contact_submission_email_idx").on(table.email),
		index("contact_submission_created_at_idx").on(table.created_at),
		index("contact_submission_status_created_at_idx").on(table.status, table.created_at),
		check(
			"contact_submission_status_valid",
			sql`${table.status} in ('unread', 'read', 'archived', 'spam')`,
		),
		check(
			"contact_submission_read_state_valid",
			sql`(${table.status} != 'unread' or ${table.read_at} is null) and (${table.status} != 'read' or ${table.read_at} is not null)`,
		),
	],
);

export const training_content = sqliteTable(
	"training_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		intro_title: text("intro_title").notNull(),
		intro_description: text("intro_description").notNull(),
		section_title: text("section_title").notNull(),
		section_description: text("section_description").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("training_content_singleton", sql`${table.id} = 1`)],
);

export const about_content = sqliteTable(
	"about_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		seo_image_alt: text("seo_image_alt").notNull(),
		alert: text("alert").notNull(),
		labor_eyebrow: text("labor_eyebrow").notNull(),
		labor_title: text("labor_title").notNull(),
		labor_description: text("labor_description").notNull(),
		labor_image_alt: text("labor_image_alt").notNull(),
		members_heading: text("members_heading").notNull(),
		team_eyebrow: text("team_eyebrow").notNull(),
		team_title: text("team_title").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("about_content_singleton", sql`${table.id} = 1`)],
);

export const news_content = sqliteTable(
	"news_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		intro_eyebrow: text("intro_eyebrow").notNull(),
		intro_title: text("intro_title").notNull(),
		intro_description: text("intro_description").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("news_content_singleton", sql`${table.id} = 1`)],
);

export const olympiads_content = sqliteTable(
	"olympiads_content",
	{
		id: integer("id").primaryKey().default(1),
		intro_description: text("intro_description").notNull(),
		section_title: text("section_title").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("olympiads_content_singleton", sql`${table.id} = 1`)],
);

export const national_content = sqliteTable(
	"national_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		information_eyebrow: text("information_eyebrow").notNull(),
		information_title: text("information_title").notNull(),
		information_description: text("information_description").notNull(),
		information_registration_title: text("information_registration_title").notNull(),
		information_registration_description: text("information_registration_description").notNull(),
		follow_eyebrow: text("follow_eyebrow").notNull(),
		follow_title: text("follow_title").notNull(),
		follow_description: text("follow_description").notNull(),
		levels_eyebrow: text("levels_eyebrow").notNull(),
		levels_title: text("levels_title").notNull(),
		levels_description: text("levels_description").notNull(),
		preparation_eyebrow: text("preparation_eyebrow").notNull(),
		preparation_title: text("preparation_title").notNull(),
		preparation_description: text("preparation_description").notNull(),
		preparation_href: text("preparation_href").notNull(),
		preparation_link_label: text("preparation_link_label").notNull(),
		prizes_eyebrow: text("prizes_eyebrow").notNull(),
		prizes_title: text("prizes_title").notNull(),
		awards_eyebrow: text("awards_eyebrow").notNull(),
		awards_image_alt: text("awards_image_alt").notNull(),
		video_href: text("video_href").notNull(),
		video_image_alt: text("video_image_alt").notNull(),
		video_label: text("video_label").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("national_content_singleton", sql`${table.id} = 1`)],
);

export const international_content = sqliteTable(
	"international_content",
	{
		id: integer("id").primaryKey().default(1),
		seo_title: text("seo_title").notNull(),
		seo_description: text("seo_description").notNull(),
		intro_eyebrow: text("intro_eyebrow").notNull(),
		intro_title: text("intro_title").notNull(),
		intro_description: text("intro_description").notNull(),
		sponsors_eyebrow: text("sponsors_eyebrow").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("international_content_singleton", sql`${table.id} = 1`)],
);

export const home_information_item = sqliteTable(
	"home_information_item",
	{
		id: text("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => home_content.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		icon: text("icon", { enum: ["info", "lightbulb", "newspaper"] }).notNull(),
		href: text("href", {
			enum: ["/olimpiadas/nacionales", "/entrenamiento", "/noticias"],
		}).notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("home_information_item_order_unique").on(table.content_id, table.sort_order),
		check("home_information_item_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const home_olympiad_card = sqliteTable(
	"home_olympiad_card",
	{
		id: text("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => home_content.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description").notNull(),
		href: text("href", {
			enum: ["/olimpiadas/nacionales", "/olimpiadas/internacionales"],
		}).notNull(),
		link_label: text("link_label").notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("home_olympiad_card_order_unique").on(table.content_id, table.sort_order),
		check("home_olympiad_card_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const home_national_fact = sqliteTable(
	"home_national_fact",
	{
		id: integer("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => home_content.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("home_national_fact_order_unique").on(table.content_id, table.sort_order),
		check("home_national_fact_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const about_value_card = sqliteTable(
	"about_value_card",
	{
		number: text("number").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => about_content.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description"),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("about_value_card_order_unique").on(table.content_id, table.sort_order),
		check("about_value_card_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const olympiads_title_line = sqliteTable(
	"olympiads_title_line",
	{
		id: integer("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => olympiads_content.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		emphasis: integer("emphasis", { mode: "boolean" }).notNull().default(false),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("olympiads_title_line_order_unique").on(table.content_id, table.sort_order),
		check("olympiads_title_line_emphasis_valid", sql`${table.emphasis} in (0, 1)`),
		check("olympiads_title_line_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const olympiads_route_card = sqliteTable(
	"olympiads_route_card",
	{
		id: integer("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => olympiads_content.id, { onDelete: "cascade" }),
		label: text("label").notNull(),
		href: text("href", {
			enum: ["/olimpiadas/internacionales", "/olimpiadas/nacionales"],
		}).notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("olympiads_route_card_order_unique").on(table.content_id, table.sort_order),
		check("olympiads_route_card_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const national_prize_paragraph = sqliteTable(
	"national_prize_paragraph",
	{
		id: integer("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => national_content.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("national_prize_paragraph_order_unique").on(table.content_id, table.sort_order),
		check("national_prize_paragraph_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const national_fact = sqliteTable(
	"national_fact",
	{
		id: text("id").primaryKey(),
		content_id: integer("content_id")
			.notNull()
			.default(1)
			.references(() => national_content.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("national_fact_order_unique").on(table.content_id, table.sort_order),
		check("national_fact_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const about_value = sqliteTable(
	"about_value",
	{
		id: integer("id").primaryKey(),
		card_number: text("card_number")
			.notNull()
			.references(() => about_value_card.number, { onDelete: "cascade" }),
		text: text("text").notNull(),
		sort_order: integer("sort_order").notNull(),
	},
	(table) => [
		uniqueIndex("about_value_order_unique").on(table.card_number, table.sort_order),
		check("about_value_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const social_link = sqliteTable(
	"social_link",
	{
		id: text("id").primaryKey(),
		label: text("label").notNull(),
		href: text("href").notNull(),
		brand_key: text("brand_key").notNull(),
		icon_path: text("icon_path").notNull(),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("social_link_sort_order_unique").on(table.sort_order),
		check("social_link_sort_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const national_olympiad = sqliteTable(
	"national_olympiad",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		slug: text("slug").notNull(),
		edition_year: integer("edition_year").notNull(),
		is_current: integer("is_current", { mode: "boolean" }).notNull().default(false),
		title: text("title").notNull(),
		announcement: text("announcement").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("national_olympiad_slug_unique").on(table.slug),
		uniqueIndex("national_olympiad_year_unique").on(table.edition_year),
		uniqueIndex("national_olympiad_current_unique")
			.on(table.is_current)
			.where(sql`${table.is_current} = 1`),
		check("national_olympiad_current_valid", sql`${table.is_current} in (0, 1)`),
		check(
			"national_olympiad_year_valid",
			sql`typeof(${table.edition_year}) = 'integer' and ${table.edition_year} between 1900 and 9999`,
		),
		check("national_olympiad_slug_not_empty", sql`length(trim(${table.slug})) > 0`),
	],
);

export const national_olympiad_stage = sqliteTable(
	"national_olympiad_stage",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		national_olympiad_id: integer("national_olympiad_id")
			.notNull()
			.references(() => national_olympiad.id, { onDelete: "cascade" }),
		label: text("label").notNull(),
		date_label: text("date_label"),
		starts_on: text("starts_on"),
		ends_on: text("ends_on"),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("national_olympiad_stage_order_unique").on(
			table.national_olympiad_id,
			table.sort_order,
		),
		uniqueIndex("national_olympiad_stage_label_unique").on(table.national_olympiad_id, table.label),
		check("national_olympiad_stage_order_nonnegative", sql`${table.sort_order} >= 0`),
		check(
			"national_olympiad_stage_start_iso",
			sql`${table.starts_on} is null or (${iso_date(table.starts_on)})`,
		),
		check(
			"national_olympiad_stage_end_iso",
			sql`${table.ends_on} is null or (${iso_date(table.ends_on)})`,
		),
		check(
			"national_olympiad_stage_range_valid",
			sql`${table.ends_on} is null or (${table.starts_on} is not null and ${table.ends_on} >= ${table.starts_on})`,
		),
		check(
			"national_olympiad_stage_date_required",
			sql`${table.starts_on} is not null or length(trim(coalesce(${table.date_label}, ''))) > 0`,
		),
	],
);

export const national_olympiad_level = sqliteTable(
	"national_olympiad_level",
	{
		id: text("id").notNull(),
		national_olympiad_id: integer("national_olympiad_id")
			.notNull()
			.references(() => national_olympiad.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description").notNull(),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		primaryKey({ columns: [table.national_olympiad_id, table.id] }),
		uniqueIndex("national_olympiad_level_order_unique").on(
			table.national_olympiad_id,
			table.sort_order,
		),
		check("national_olympiad_level_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const international_olympiad = sqliteTable(
	"international_olympiad",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description").notNull(),
		asset_key: text("asset_key"),
		image_alt: text("image_alt").notNull(),
		href: text("href"),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("international_olympiad_sort_order_unique").on(table.sort_order),
		check("international_olympiad_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const sponsor = sqliteTable("sponsor", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	asset_key: text("asset_key"),
	image_alt: text("image_alt").notNull(),
	created_at: created_at(),
	updated_at: updated_at(),
});

export const sponsor_placement = sqliteTable(
	"sponsor_placement",
	{
		sponsor_id: text("sponsor_id")
			.notNull()
			.references(() => sponsor.id, { onDelete: "cascade" }),
		page_key: text("page_key").notNull(),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		primaryKey({ columns: [table.sponsor_id, table.page_key] }),
		uniqueIndex("sponsor_placement_order_unique").on(table.page_key, table.sort_order),
		check("sponsor_placement_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const team_member = sqliteTable(
	"team_member",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		role: text("role"),
		contact: text("contact"),
		asset_key: text("asset_key"),
		image_alt: text("image_alt"),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [uniqueIndex("team_member_name_unique").on(table.name)],
);

export const team_member_placement = sqliteTable(
	"team_member_placement",
	{
		team_member_id: text("team_member_id")
			.notNull()
			.references(() => team_member.id, { onDelete: "cascade" }),
		page_key: text("page_key").notNull(),
		placement: text("placement", { enum: ["member", "director"] }).notNull(),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		primaryKey({ columns: [table.team_member_id, table.page_key, table.placement] }),
		uniqueIndex("team_member_placement_order_unique").on(
			table.page_key,
			table.placement,
			table.sort_order,
		),
		check("team_member_placement_value_valid", sql`${table.placement} in ('member', 'director')`),
		check("team_member_placement_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const training_material = sqliteTable(
	"training_material",
	{
		id: text("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description").notNull(),
		icon: text("icon", { enum: ["presentation", "calendar_days"] }),
		asset_key: text("asset_key"),
		image_alt: text("image_alt").notNull().default(""),
		href: text("href").notNull(),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("training_material_sort_order_unique").on(table.sort_order),
		check("training_material_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const news_article = sqliteTable(
	"news_article",
	{
		slug: text("slug").primaryKey(),
		category: text("category").notNull(),
		date_label: text("date_label"),
		published_on: text("published_on").notNull(),
		author: text("author").notNull(),
		title: text("title").notNull(),
		summary: text("summary").notNull(),
		link_label: text("link_label").notNull(),
		body_markdown: text("body_markdown").notNull(),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("news_article_sort_order_unique").on(table.sort_order),
		index("news_article_published_idx").on(table.published_on, table.sort_order),
		check("news_article_order_nonnegative", sql`${table.sort_order} >= 0`),
		check("news_article_date_published_iso", iso_date(table.published_on)),
	],
);
