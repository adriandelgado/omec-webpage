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

const created_at = () =>
	integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`);

const updated_at = () =>
	integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date());

export const page_content = sqliteTable(
	"page_content",
	{
		key: text("key").primaryKey(),
		document: text("document", { mode: "json" }).$type<unknown>().notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("page_content_key_not_empty", sql`length(${table.key}) > 0`)],
);

export const social_link = sqliteTable(
	"social_link",
	{
		id: text("id").primaryKey(),
		label: text("label").notNull(),
		href: text("href").notNull(),
		class_name: text("class_name").notNull(),
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
		key: text("key").notNull(),
		title: text("title").notNull(),
		announcement: text("announcement").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [uniqueIndex("national_olympiad_key_unique").on(table.key)],
);

export const national_olympiad_stage = sqliteTable(
	"national_olympiad_stage",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		national_olympiad_id: integer("national_olympiad_id")
			.notNull()
			.references(() => national_olympiad.id, { onDelete: "cascade" }),
		label: text("label").notNull(),
		date: text("date").notNull(),
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
		index("national_olympiad_stage_olympiad_idx").on(table.national_olympiad_id),
		check("national_olympiad_stage_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const national_olympiad_level = sqliteTable(
	"national_olympiad_level",
	{
		id: text("id").primaryKey(),
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
		uniqueIndex("national_olympiad_level_order_unique").on(
			table.national_olympiad_id,
			table.sort_order,
		),
		index("national_olympiad_level_olympiad_idx").on(table.national_olympiad_id),
		check("national_olympiad_level_order_nonnegative", sql`${table.sort_order} >= 0`),
	],
);

export const international_olympiad = sqliteTable(
	"international_olympiad",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description").notNull(),
		asset_key: text("asset_key").notNull(),
		image_alt: text("image_alt").notNull(),
		href: text("href"),
		sort_order: integer("sort_order").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [
		uniqueIndex("international_olympiad_sort_order_unique").on(table.sort_order),
		check("international_olympiad_order_nonnegative", sql`${table.sort_order} >= 0`),
		check("international_olympiad_asset_key_not_empty", sql`length(${table.asset_key}) > 0`),
	],
);

export const sponsor = sqliteTable(
	"sponsor",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		asset_key: text("asset_key").notNull(),
		image_alt: text("image_alt").notNull(),
		created_at: created_at(),
		updated_at: updated_at(),
	},
	(table) => [check("sponsor_asset_key_not_empty", sql`length(${table.asset_key}) > 0`)],
);

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
		index("sponsor_placement_page_idx").on(table.page_key),
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
		index("team_member_placement_page_idx").on(table.page_key, table.placement),
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
		check(
			"training_material_media_present",
			sql`${table.icon} is not null or ${table.asset_key} is not null`,
		),
	],
);

export const news_article = sqliteTable(
	"news_article",
	{
		slug: text("slug").primaryKey(),
		category: text("category").notNull(),
		date: text("date").notNull(),
		date_published: text("date_published").notNull(),
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
		index("news_article_published_idx").on(table.date_published, table.sort_order),
		check("news_article_order_nonnegative", sql`${table.sort_order} >= 0`),
		check(
			"news_article_date_published_iso",
			sql`${table.date_published} glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date(${table.date_published}) = ${table.date_published}`,
		),
	],
);
