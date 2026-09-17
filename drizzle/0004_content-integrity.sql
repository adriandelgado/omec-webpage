-- Keep child rows before rebuilding the parent: foreign_keys may be ON inside
-- the migration transaction, where changing that PRAGMA would have no effect.
CREATE TABLE __saved_national_stage AS SELECT * FROM national_olympiad_stage;
--> statement-breakpoint
CREATE TABLE __saved_national_level AS SELECT * FROM national_olympiad_level;
--> statement-breakpoint
-- Preserve AUTOINCREMENT high-water marks, including IDs of deleted submissions.
CREATE TABLE __saved_content_sequence AS SELECT name, seq FROM sqlite_sequence
WHERE name IN ('national_olympiad', 'national_olympiad_stage', 'contact_submission');
--> statement-breakpoint
DROP TABLE national_olympiad_stage;
--> statement-breakpoint
DROP TABLE national_olympiad_level;
--> statement-breakpoint
ALTER TABLE `social_link` RENAME COLUMN "class_name" TO "brand_key";--> statement-breakpoint
CREATE TABLE `__new_national_olympiad` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`edition_year` integer NOT NULL,
	`is_current` integer DEFAULT false NOT NULL,
	`title` text NOT NULL,
	`announcement` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "national_olympiad_current_valid" CHECK("__new_national_olympiad"."is_current" in (0, 1)),
	CONSTRAINT "national_olympiad_year_valid" CHECK(typeof("__new_national_olympiad"."edition_year") = 'integer' and "__new_national_olympiad"."edition_year" between 1900 and 9999),
	CONSTRAINT "national_olympiad_slug_not_empty" CHECK(length(trim("__new_national_olympiad"."slug")) > 0)
);
--> statement-breakpoint
INSERT INTO `__new_national_olympiad`("id", "slug", "edition_year", "is_current", "title", "announcement", "created_at", "updated_at") SELECT id,
 CASE WHEN key = 'current' THEN 'onm-' || substr(trim(title), -4) ELSE key END,
 CASE WHEN trim(title) GLOB '* [0-9][0-9][0-9][0-9]' THEN cast(substr(trim(title), -4) AS integer) END,
 key = 'current', title, announcement, created_at, updated_at
FROM national_olympiad;--> statement-breakpoint
DROP TABLE `national_olympiad`;--> statement-breakpoint
ALTER TABLE `__new_national_olympiad` RENAME TO `national_olympiad`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_slug_unique` ON `national_olympiad` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_year_unique` ON `national_olympiad` (`edition_year`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_current_unique` ON `national_olympiad` (`is_current`) WHERE "national_olympiad"."is_current" = 1;--> statement-breakpoint
CREATE TABLE `__new_national_olympiad_stage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`national_olympiad_id` integer NOT NULL,
	`label` text NOT NULL,
	`date_label` text,
	`starts_on` text,
	`ends_on` text,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`national_olympiad_id`) REFERENCES `national_olympiad`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_olympiad_stage_order_nonnegative" CHECK("__new_national_olympiad_stage"."sort_order" >= 0),
	CONSTRAINT "national_olympiad_stage_start_iso" CHECK("__new_national_olympiad_stage"."starts_on" is null or ("__new_national_olympiad_stage"."starts_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("__new_national_olympiad_stage"."starts_on", '+0 days') is "__new_national_olympiad_stage"."starts_on")),
	CONSTRAINT "national_olympiad_stage_end_iso" CHECK("__new_national_olympiad_stage"."ends_on" is null or ("__new_national_olympiad_stage"."ends_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("__new_national_olympiad_stage"."ends_on", '+0 days') is "__new_national_olympiad_stage"."ends_on")),
	CONSTRAINT "national_olympiad_stage_range_valid" CHECK("__new_national_olympiad_stage"."ends_on" is null or ("__new_national_olympiad_stage"."starts_on" is not null and "__new_national_olympiad_stage"."ends_on" >= "__new_national_olympiad_stage"."starts_on")),
	CONSTRAINT "national_olympiad_stage_date_required" CHECK("__new_national_olympiad_stage"."starts_on" is not null or length(trim(coalesce("__new_national_olympiad_stage"."date_label", ''))) > 0)
);
--> statement-breakpoint
INSERT INTO `__new_national_olympiad_stage`("id", "national_olympiad_id", "label", "date_label", "starts_on", "ends_on", "sort_order", "created_at", "updated_at") SELECT s.id, s.national_olympiad_id, s.label, s.date,
 CASE s.date
  WHEN '17 de octubre' THEN printf('%04d-10-17', n.edition_year)
  WHEN '7 de noviembre' THEN printf('%04d-11-07', n.edition_year)
  WHEN '11 y 12 de diciembre' THEN printf('%04d-12-11', n.edition_year)
 END,
 CASE s.date WHEN '11 y 12 de diciembre' THEN printf('%04d-12-12', n.edition_year) END,
 s.sort_order, s.created_at, s.updated_at
FROM __saved_national_stage s JOIN national_olympiad n ON n.id = s.national_olympiad_id;--> statement-breakpoint
DROP TABLE __saved_national_stage;--> statement-breakpoint
ALTER TABLE `__new_national_olympiad_stage` RENAME TO `national_olympiad_stage`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_order_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_label_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`label`);--> statement-breakpoint
CREATE TABLE `__new_news_article` (
	`slug` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`date_label` text,
	`published_on` text NOT NULL,
	`author` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`link_label` text NOT NULL,
	`body_markdown` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "news_article_order_nonnegative" CHECK("__new_news_article"."sort_order" >= 0),
	CONSTRAINT "news_article_date_published_iso" CHECK("__new_news_article"."published_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("__new_news_article"."published_on", '+0 days') is "__new_news_article"."published_on")
);
--> statement-breakpoint
INSERT INTO `__new_news_article`("slug", "category", "date_label", "published_on", "author", "title", "summary", "link_label", "body_markdown", "sort_order", "created_at", "updated_at") SELECT "slug", "category", "date", "date_published", "author", "title", "summary", "link_label", "body_markdown", "sort_order", "created_at", "updated_at" FROM `news_article`;--> statement-breakpoint
DROP TABLE `news_article`;--> statement-breakpoint
ALTER TABLE `__new_news_article` RENAME TO `news_article`;--> statement-breakpoint
CREATE UNIQUE INDEX `news_article_sort_order_unique` ON `news_article` (`sort_order`);--> statement-breakpoint
CREATE INDEX `news_article_published_idx` ON `news_article` (`published_on`,`sort_order`);--> statement-breakpoint
CREATE TABLE `__new_olympiads_title_line` (
	`id` integer PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`text` text NOT NULL,
	`emphasis` integer DEFAULT false NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `olympiads_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "olympiads_title_line_emphasis_valid" CHECK("__new_olympiads_title_line"."emphasis" in (0, 1)),
	CONSTRAINT "olympiads_title_line_order_nonnegative" CHECK("__new_olympiads_title_line"."sort_order" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_olympiads_title_line`("id", "content_id", "text", "emphasis", "sort_order") SELECT "id", "content_id", "text", CASE WHEN instr(' ' || coalesce("class", '') || ' ', ' text-primary ') > 0 THEN 1 ELSE 0 END, "sort_order" FROM `olympiads_title_line`;--> statement-breakpoint
DROP TABLE `olympiads_title_line`;--> statement-breakpoint
ALTER TABLE `__new_olympiads_title_line` RENAME TO `olympiads_title_line`;--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_title_line_order_unique` ON `olympiads_title_line` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `__new_national_olympiad_level` (
	`id` text NOT NULL,
	`national_olympiad_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`national_olympiad_id`, `id`),
	FOREIGN KEY (`national_olympiad_id`) REFERENCES `national_olympiad`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_olympiad_level_order_nonnegative" CHECK("__new_national_olympiad_level"."sort_order" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_national_olympiad_level`("id", "national_olympiad_id", "name", "description", "sort_order", "created_at", "updated_at") SELECT "id", "national_olympiad_id", "name", "description", "sort_order", "created_at", "updated_at" FROM __saved_national_level;--> statement-breakpoint
DROP TABLE __saved_national_level;--> statement-breakpoint
ALTER TABLE `__new_national_olympiad_level` RENAME TO `national_olympiad_level`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_level_order_unique` ON `national_olympiad_level` (`national_olympiad_id`,`sort_order`);--> statement-breakpoint
DROP INDEX `sponsor_placement_page_idx`;--> statement-breakpoint
DROP INDEX `team_member_placement_page_idx`;--> statement-breakpoint
CREATE TABLE `__new_contact_submission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`institution` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`read_at` integer,
	`status` text DEFAULT 'unread' NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "contact_submission_status_valid" CHECK("__new_contact_submission"."status" in ('unread', 'read', 'archived', 'spam')),
	CONSTRAINT "contact_submission_read_state_valid" CHECK(("__new_contact_submission"."status" != 'unread' or "__new_contact_submission"."read_at" is null) and ("__new_contact_submission"."status" != 'read' or "__new_contact_submission"."read_at" is not null))
);
--> statement-breakpoint
INSERT INTO `__new_contact_submission`("id", "full_name", "email", "institution", "subject", "message", "created_at", "read_at", "status", "updated_at") SELECT id, full_name, email, institution, subject, message, created_at, read_at,
 CASE WHEN read_at IS NULL THEN 'unread' ELSE 'read' END,
 max(created_at, coalesce(read_at, created_at)) FROM `contact_submission`;--> statement-breakpoint
DROP TABLE `contact_submission`;--> statement-breakpoint
ALTER TABLE `__new_contact_submission` RENAME TO `contact_submission`;--> statement-breakpoint
CREATE INDEX `contact_submission_email_idx` ON `contact_submission` (`email`);--> statement-breakpoint
CREATE INDEX `contact_submission_created_at_idx` ON `contact_submission` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_submission_status_created_at_idx` ON `contact_submission` (`status`,`created_at`);--> statement-breakpoint
ALTER TABLE `international_olympiad` ADD `asset_key` text;--> statement-breakpoint
ALTER TABLE `sponsor` ADD `asset_key` text;--> statement-breakpoint
ALTER TABLE `team_member` ADD `asset_key` text;--> statement-breakpoint
ALTER TABLE `training_material` ADD `asset_key` text;
--> statement-breakpoint
UPDATE social_link SET brand_key = CASE
 WHEN id IN ('facebook', 'instagram', 'tiktok') THEN id
 WHEN brand_key = 'bg-pink-500 text-white' THEN 'instagram'
 WHEN brand_key = 'bg-copy text-white' THEN 'tiktok'
 ELSE 'generic' END;
--> statement-breakpoint
UPDATE sponsor SET asset_key = CASE id
 WHEN 'egcs-ucsg' THEN 'ucsg' WHEN 'sponsor' THEN 'sedem' WHEN 'usfq' THEN 'usfq' END;
--> statement-breakpoint
UPDATE international_olympiad SET asset_key = id
WHERE id IN ('ciim', 'cono-sur', 'egmo', 'imo', 'pagmo', 'tjm', 'apmo', 'mayo', 'igo');
--> statement-breakpoint
UPDATE team_member SET asset_key = id
WHERE id IN ('fernando-gomez', 'lucero-llanos', 'pablo-serrano', 'pedro-suarez', 'valeria-santana');
--> statement-breakpoint
UPDATE training_material SET asset_key = CASE id
 WHEN 'estudio-a-profundidad' THEN 'omec'
 WHEN 'olimpiada-nacional' THEN 'omec'
 WHEN 'olimpiadas-internacionales' THEN 'egmo' END;
--> statement-breakpoint
UPDATE sqlite_sequence SET seq = max(seq, coalesce(
 (SELECT saved.seq FROM __saved_content_sequence saved WHERE saved.name = sqlite_sequence.name), 0))
WHERE name IN ('national_olympiad', 'national_olympiad_stage', 'contact_submission');
--> statement-breakpoint
DROP TABLE __saved_content_sequence;
