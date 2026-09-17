CREATE TABLE `about_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`seo_image_alt` text NOT NULL,
	`alert` text NOT NULL,
	`labor_eyebrow` text NOT NULL,
	`labor_title` text NOT NULL,
	`labor_description` text NOT NULL,
	`labor_image_alt` text NOT NULL,
	`members_heading` text NOT NULL,
	`team_eyebrow` text NOT NULL,
	`team_title` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "about_content_singleton" CHECK("about_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `about_value` (
	`id` integer PRIMARY KEY NOT NULL,
	`card_number` text NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`card_number`) REFERENCES `about_value_card`(`number`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "about_value_order_nonnegative" CHECK("about_value"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `about_value_order_unique` ON `about_value` (`card_number`,`sort_order`);--> statement-breakpoint
CREATE TABLE `about_value_card` (
	`number` text PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `about_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "about_value_card_order_nonnegative" CHECK("about_value_card"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `about_value_card_order_unique` ON `about_value_card` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `contact_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`intro_title` text NOT NULL,
	`intro_description` text NOT NULL,
	`contact_heading` text NOT NULL,
	`contact_card_title` text NOT NULL,
	`follow_heading` text NOT NULL,
	`follow_description` text NOT NULL,
	`form_title` text NOT NULL,
	`form_required_notice_before` text NOT NULL,
	`form_required_notice_after` text NOT NULL,
	`form_invalid_notice` text NOT NULL,
	`form_fields_full_name_label` text NOT NULL,
	`form_fields_full_name_placeholder` text NOT NULL,
	`form_fields_email_label` text NOT NULL,
	`form_fields_email_placeholder` text NOT NULL,
	`form_fields_institution_label` text NOT NULL,
	`form_fields_institution_placeholder` text NOT NULL,
	`form_fields_subject_label` text NOT NULL,
	`form_fields_subject_placeholder` text NOT NULL,
	`form_fields_message_label` text NOT NULL,
	`form_fields_message_placeholder` text NOT NULL,
	`form_fields_message_help` text NOT NULL,
	`form_submit_label` text NOT NULL,
	`form_pending_label` text NOT NULL,
	`form_success_message` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "contact_content_singleton" CHECK("contact_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `contact_submission` (
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
	CONSTRAINT "contact_submission_status_valid" CHECK("contact_submission"."status" in ('unread', 'read', 'archived', 'spam')),
	CONSTRAINT "contact_submission_read_state_valid" CHECK(("contact_submission"."status" != 'unread' or "contact_submission"."read_at" is null) and ("contact_submission"."status" != 'read' or "contact_submission"."read_at" is not null))
);
--> statement-breakpoint
CREATE INDEX `contact_submission_email_idx` ON `contact_submission` (`email`);--> statement-breakpoint
CREATE INDEX `contact_submission_created_at_idx` ON `contact_submission` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_submission_status_created_at_idx` ON `contact_submission` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `home_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`hero_title` text NOT NULL,
	`hero_highlight` text NOT NULL,
	`hero_image_alt` text NOT NULL,
	`national_olympiad_link_label` text NOT NULL,
	`national_olympiad_link_href` text NOT NULL,
	`about_eyebrow` text NOT NULL,
	`about_title` text NOT NULL,
	`about_description_markdown` text NOT NULL,
	`about_link_label` text NOT NULL,
	`about_link_href` text NOT NULL,
	`about_image_alt` text NOT NULL,
	`sponsor_title` text NOT NULL,
	`national_facts_title` text NOT NULL,
	`national_facts_image_alt` text NOT NULL,
	`follow_eyebrow` text NOT NULL,
	`follow_title` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "home_content_singleton" CHECK("home_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `home_information_item` (
	`id` text PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`title` text NOT NULL,
	`icon` text NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `home_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "home_information_item_order_nonnegative" CHECK("home_information_item"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `home_information_item_order_unique` ON `home_information_item` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `home_national_fact` (
	`id` integer PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `home_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "home_national_fact_order_nonnegative" CHECK("home_national_fact"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `home_national_fact_order_unique` ON `home_national_fact` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `home_olympiad_card` (
	`id` text PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`href` text NOT NULL,
	`link_label` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `home_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "home_olympiad_card_order_nonnegative" CHECK("home_olympiad_card"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `home_olympiad_card_order_unique` ON `home_olympiad_card` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `international_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`intro_eyebrow` text NOT NULL,
	`intro_title` text NOT NULL,
	`intro_description` text NOT NULL,
	`sponsors_eyebrow` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "international_content_singleton" CHECK("international_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `international_olympiad` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`asset_key` text,
	`image_alt` text NOT NULL,
	`href` text,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "international_olympiad_order_nonnegative" CHECK("international_olympiad"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `international_olympiad_sort_order_unique` ON `international_olympiad` (`sort_order`);--> statement-breakpoint
CREATE TABLE `national_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`information_eyebrow` text NOT NULL,
	`information_title` text NOT NULL,
	`information_description` text NOT NULL,
	`information_registration_title` text NOT NULL,
	`information_registration_description` text NOT NULL,
	`follow_eyebrow` text NOT NULL,
	`follow_title` text NOT NULL,
	`follow_description` text NOT NULL,
	`levels_eyebrow` text NOT NULL,
	`levels_title` text NOT NULL,
	`levels_description` text NOT NULL,
	`preparation_eyebrow` text NOT NULL,
	`preparation_title` text NOT NULL,
	`preparation_description` text NOT NULL,
	`preparation_href` text NOT NULL,
	`preparation_link_label` text NOT NULL,
	`prizes_eyebrow` text NOT NULL,
	`prizes_title` text NOT NULL,
	`awards_eyebrow` text NOT NULL,
	`awards_image_alt` text NOT NULL,
	`video_href` text NOT NULL,
	`video_image_alt` text NOT NULL,
	`video_label` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "national_content_singleton" CHECK("national_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `national_fact` (
	`id` text PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `national_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_fact_order_nonnegative" CHECK("national_fact"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_fact_order_unique` ON `national_fact` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `national_olympiad` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`edition_year` integer NOT NULL,
	`is_current` integer DEFAULT false NOT NULL,
	`title` text NOT NULL,
	`announcement` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "national_olympiad_current_valid" CHECK("national_olympiad"."is_current" in (0, 1)),
	CONSTRAINT "national_olympiad_year_valid" CHECK(typeof("national_olympiad"."edition_year") = 'integer' and "national_olympiad"."edition_year" between 1900 and 9999),
	CONSTRAINT "national_olympiad_slug_not_empty" CHECK(length(trim("national_olympiad"."slug")) > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_slug_unique` ON `national_olympiad` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_year_unique` ON `national_olympiad` (`edition_year`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_current_unique` ON `national_olympiad` (`is_current`) WHERE "national_olympiad"."is_current" = 1;--> statement-breakpoint
CREATE TABLE `national_olympiad_level` (
	`id` text NOT NULL,
	`national_olympiad_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`national_olympiad_id`, `id`),
	FOREIGN KEY (`national_olympiad_id`) REFERENCES `national_olympiad`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_olympiad_level_order_nonnegative" CHECK("national_olympiad_level"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_level_order_unique` ON `national_olympiad_level` (`national_olympiad_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `national_olympiad_stage` (
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
	CONSTRAINT "national_olympiad_stage_order_nonnegative" CHECK("national_olympiad_stage"."sort_order" >= 0),
	CONSTRAINT "national_olympiad_stage_start_iso" CHECK("national_olympiad_stage"."starts_on" is null or ("national_olympiad_stage"."starts_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("national_olympiad_stage"."starts_on", '+0 days') is "national_olympiad_stage"."starts_on")),
	CONSTRAINT "national_olympiad_stage_end_iso" CHECK("national_olympiad_stage"."ends_on" is null or ("national_olympiad_stage"."ends_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("national_olympiad_stage"."ends_on", '+0 days') is "national_olympiad_stage"."ends_on")),
	CONSTRAINT "national_olympiad_stage_range_valid" CHECK("national_olympiad_stage"."ends_on" is null or ("national_olympiad_stage"."starts_on" is not null and "national_olympiad_stage"."ends_on" >= "national_olympiad_stage"."starts_on")),
	CONSTRAINT "national_olympiad_stage_date_required" CHECK("national_olympiad_stage"."starts_on" is not null or length(trim(coalesce("national_olympiad_stage"."date_label", ''))) > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_order_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_label_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`label`);--> statement-breakpoint
CREATE TABLE `national_prize_paragraph` (
	`id` integer PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `national_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_prize_paragraph_order_nonnegative" CHECK("national_prize_paragraph"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_prize_paragraph_order_unique` ON `national_prize_paragraph` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `news_article` (
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
	CONSTRAINT "news_article_order_nonnegative" CHECK("news_article"."sort_order" >= 0),
	CONSTRAINT "news_article_date_published_iso" CHECK("news_article"."published_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("news_article"."published_on", '+0 days') is "news_article"."published_on")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_article_sort_order_unique` ON `news_article` (`sort_order`);--> statement-breakpoint
CREATE INDEX `news_article_published_idx` ON `news_article` (`published_on`,`sort_order`);--> statement-breakpoint
CREATE TABLE `news_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`intro_eyebrow` text NOT NULL,
	`intro_title` text NOT NULL,
	`intro_description` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "news_content_singleton" CHECK("news_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `olympiads_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`intro_description` text NOT NULL,
	`section_title` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "olympiads_content_singleton" CHECK("olympiads_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `olympiads_route_card` (
	`id` integer PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `olympiads_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "olympiads_route_card_order_nonnegative" CHECK("olympiads_route_card"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_route_card_order_unique` ON `olympiads_route_card` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `olympiads_title_line` (
	`id` integer PRIMARY KEY NOT NULL,
	`content_id` integer DEFAULT 1 NOT NULL,
	`text` text NOT NULL,
	`emphasis` integer DEFAULT false NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `olympiads_content`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "olympiads_title_line_emphasis_valid" CHECK("olympiads_title_line"."emphasis" in (0, 1)),
	CONSTRAINT "olympiads_title_line_order_nonnegative" CHECK("olympiads_title_line"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_title_line_order_unique` ON `olympiads_title_line` (`content_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`contact_email` text NOT NULL,
	`contact_email_href` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "site_content_singleton" CHECK("site_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `social_link` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`brand_key` text NOT NULL,
	`icon_path` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "social_link_sort_order_nonnegative" CHECK("social_link"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_link_sort_order_unique` ON `social_link` (`sort_order`);--> statement-breakpoint
CREATE TABLE `sponsor` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`asset_key` text,
	`image_alt` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sponsor_placement` (
	`sponsor_id` text NOT NULL,
	`page_key` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`sponsor_id`, `page_key`),
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "sponsor_placement_order_nonnegative" CHECK("sponsor_placement"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sponsor_placement_order_unique` ON `sponsor_placement` (`page_key`,`sort_order`);--> statement-breakpoint
CREATE TABLE `team_member` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`contact` text,
	`asset_key` text,
	`image_alt` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_name_unique` ON `team_member` (`name`);--> statement-breakpoint
CREATE TABLE `team_member_placement` (
	`team_member_id` text NOT NULL,
	`page_key` text NOT NULL,
	`placement` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`team_member_id`, `page_key`, `placement`),
	FOREIGN KEY (`team_member_id`) REFERENCES `team_member`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "team_member_placement_value_valid" CHECK("team_member_placement"."placement" in ('member', 'director')),
	CONSTRAINT "team_member_placement_order_nonnegative" CHECK("team_member_placement"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_placement_order_unique` ON `team_member_placement` (`page_key`,`placement`,`sort_order`);--> statement-breakpoint
CREATE TABLE `training_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`intro_title` text NOT NULL,
	`intro_description` text NOT NULL,
	`section_title` text NOT NULL,
	`section_description` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "training_content_singleton" CHECK("training_content"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `training_material` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text,
	`asset_key` text,
	`image_alt` text DEFAULT '' NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "training_material_order_nonnegative" CHECK("training_material"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `training_material_sort_order_unique` ON `training_material` (`sort_order`);