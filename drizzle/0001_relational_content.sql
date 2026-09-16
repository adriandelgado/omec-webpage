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
	`about_description_html` text NOT NULL,
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
	`class` text,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `olympiads_content`(`id`) ON UPDATE no action ON DELETE cascade,
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
-- Transfer the deployed documents, including their original timestamps.
INSERT INTO site_content (id, contact_email, contact_email_href, created_at, updated_at)
SELECT 1, json_extract(document, '$.contact.email'), json_extract(document, '$.contact.email_href'), created_at, updated_at FROM page_content WHERE key = 'site';
--> statement-breakpoint
INSERT INTO home_content (id, seo_title, seo_description, hero_title, hero_highlight, hero_image_alt, national_olympiad_link_label, national_olympiad_link_href, about_eyebrow, about_title, about_description_html, about_link_label, about_link_href, about_image_alt, sponsor_title, national_facts_title, national_facts_image_alt, follow_eyebrow, follow_title, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.hero.title'), json_extract(document, '$.hero.highlight'), json_extract(document, '$.hero.image.image_alt'), json_extract(document, '$.national_olympiad.link_label'), json_extract(document, '$.national_olympiad.link_href'), json_extract(document, '$.about.eyebrow'), json_extract(document, '$.about.title'), json_extract(document, '$.about.description_html'), json_extract(document, '$.about.link_label'), json_extract(document, '$.about.link_href'), json_extract(document, '$.about.image.image_alt'), json_extract(document, '$.sponsor.title'), json_extract(document, '$.national_facts.title'), json_extract(document, '$.national_facts.image.image_alt'), json_extract(document, '$.follow.eyebrow'), json_extract(document, '$.follow.title'), created_at, updated_at FROM page_content WHERE key = 'home';
--> statement-breakpoint
INSERT INTO contact_content (id, seo_title, seo_description, intro_title, intro_description, contact_heading, contact_card_title, follow_heading, follow_description, form_title, form_required_notice_before, form_required_notice_after, form_invalid_notice, form_fields_full_name_label, form_fields_full_name_placeholder, form_fields_email_label, form_fields_email_placeholder, form_fields_institution_label, form_fields_institution_placeholder, form_fields_subject_label, form_fields_subject_placeholder, form_fields_message_label, form_fields_message_placeholder, form_fields_message_help, form_submit_label, form_pending_label, form_success_message, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.intro.title'), json_extract(document, '$.intro.description'), json_extract(document, '$.contact.heading'), json_extract(document, '$.contact.card_title'), json_extract(document, '$.follow.heading'), json_extract(document, '$.follow.description'), json_extract(document, '$.form.title'), json_extract(document, '$.form.required_notice_before'), json_extract(document, '$.form.required_notice_after'), json_extract(document, '$.form.invalid_notice'), json_extract(document, '$.form.fields.full_name.label'), json_extract(document, '$.form.fields.full_name.placeholder'), json_extract(document, '$.form.fields.email.label'), json_extract(document, '$.form.fields.email.placeholder'), json_extract(document, '$.form.fields.institution.label'), json_extract(document, '$.form.fields.institution.placeholder'), json_extract(document, '$.form.fields.subject.label'), json_extract(document, '$.form.fields.subject.placeholder'), json_extract(document, '$.form.fields.message.label'), json_extract(document, '$.form.fields.message.placeholder'), json_extract(document, '$.form.fields.message.help'), json_extract(document, '$.form.submit_label'), json_extract(document, '$.form.pending_label'), json_extract(document, '$.form.success_message'), created_at, updated_at FROM page_content WHERE key = 'contact';
--> statement-breakpoint
INSERT INTO training_content (id, seo_title, seo_description, intro_title, intro_description, section_title, section_description, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.intro.title'), json_extract(document, '$.intro.description'), json_extract(document, '$.section.title'), json_extract(document, '$.section.description'), created_at, updated_at FROM page_content WHERE key = 'training';
--> statement-breakpoint
INSERT INTO about_content (id, seo_title, seo_description, seo_image_alt, alert, labor_eyebrow, labor_title, labor_description, labor_image_alt, members_heading, team_eyebrow, team_title, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.seo.image.image_alt'), json_extract(document, '$.alert'), json_extract(document, '$.labor.eyebrow'), json_extract(document, '$.labor.title'), json_extract(document, '$.labor.description'), json_extract(document, '$.labor.image.image_alt'), json_extract(document, '$.members_heading'), json_extract(document, '$.team.eyebrow'), json_extract(document, '$.team.title'), created_at, updated_at FROM page_content WHERE key = 'about';
--> statement-breakpoint
INSERT INTO news_content (id, seo_title, seo_description, intro_eyebrow, intro_title, intro_description, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.intro.eyebrow'), json_extract(document, '$.intro.title'), json_extract(document, '$.intro.description'), created_at, updated_at FROM page_content WHERE key = 'news';
--> statement-breakpoint
INSERT INTO olympiads_content (id, intro_description, section_title, created_at, updated_at)
SELECT 1, json_extract(document, '$.intro.description'), json_extract(document, '$.section_title'), created_at, updated_at FROM page_content WHERE key = 'olympiads';
--> statement-breakpoint
INSERT INTO national_content (id, seo_title, seo_description, information_eyebrow, information_title, information_description, information_registration_title, information_registration_description, follow_eyebrow, follow_title, follow_description, levels_eyebrow, levels_title, levels_description, preparation_eyebrow, preparation_title, preparation_description, preparation_href, preparation_link_label, prizes_eyebrow, prizes_title, awards_eyebrow, awards_image_alt, video_href, video_image_alt, video_label, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.information.eyebrow'), json_extract(document, '$.information.title'), json_extract(document, '$.information.description'), json_extract(document, '$.information.registration_title'), json_extract(document, '$.information.registration_description'), json_extract(document, '$.follow.eyebrow'), json_extract(document, '$.follow.title'), json_extract(document, '$.follow.description'), json_extract(document, '$.levels.eyebrow'), json_extract(document, '$.levels.title'), json_extract(document, '$.levels.description'), json_extract(document, '$.preparation.eyebrow'), json_extract(document, '$.preparation.title'), json_extract(document, '$.preparation.description'), json_extract(document, '$.preparation.href'), json_extract(document, '$.preparation.link_label'), json_extract(document, '$.prizes.eyebrow'), json_extract(document, '$.prizes.title'), json_extract(document, '$.awards.eyebrow'), json_extract(document, '$.awards.image.image_alt'), json_extract(document, '$.video.href'), json_extract(document, '$.video.image.image_alt'), json_extract(document, '$.video.label'), created_at, updated_at FROM page_content WHERE key = 'national';
--> statement-breakpoint
INSERT INTO international_content (id, seo_title, seo_description, intro_eyebrow, intro_title, intro_description, sponsors_eyebrow, created_at, updated_at)
SELECT 1, json_extract(document, '$.seo.title'), json_extract(document, '$.seo.description'), json_extract(document, '$.intro.eyebrow'), json_extract(document, '$.intro.title'), json_extract(document, '$.intro.description'), json_extract(document, '$.sponsors.eyebrow'), created_at, updated_at FROM page_content WHERE key = 'international';
--> statement-breakpoint
INSERT INTO home_information_item (content_id, "id", "title", "icon", "href", sort_order)
SELECT 1, json_extract(item.value, '$.id'), json_extract(item.value, '$.title'), json_extract(item.value, '$.icon'), json_extract(item.value, '$.href'), CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.national_olympiad.information_items') AS item WHERE page_content.key = 'home';
--> statement-breakpoint
INSERT INTO home_olympiad_card (content_id, "id", "title", "description", "href", "link_label", sort_order)
SELECT 1, json_extract(item.value, '$.id'), json_extract(item.value, '$.title'), json_extract(item.value, '$.description'), json_extract(item.value, '$.href'), json_extract(item.value, '$.link_label'), CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.olympiad_cards') AS item WHERE page_content.key = 'home';
--> statement-breakpoint
INSERT INTO home_national_fact (id, content_id, "text", sort_order)
SELECT CAST(item.key AS INTEGER) + 1, 1, item.value, CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.national_facts.facts') AS item WHERE page_content.key = 'home';
--> statement-breakpoint
INSERT INTO about_value_card (content_id, "number", "title", "description", sort_order)
SELECT 1, json_extract(item.value, '$.number'), json_extract(item.value, '$.title'), json_extract(item.value, '$.description'), CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.values_cards') AS item WHERE page_content.key = 'about';
--> statement-breakpoint
INSERT INTO olympiads_title_line (id, content_id, "text", "class", sort_order)
SELECT CAST(item.key AS INTEGER) + 1, 1, json_extract(item.value, '$.text'), json_extract(item.value, '$.class'), CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.intro.title_lines') AS item WHERE page_content.key = 'olympiads';
--> statement-breakpoint
INSERT INTO olympiads_route_card (id, content_id, "label", "href", sort_order)
SELECT CAST(item.key AS INTEGER) + 1, 1, json_extract(item.value, '$.label'), json_extract(item.value, '$.href'), CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.routes') AS item WHERE page_content.key = 'olympiads';
--> statement-breakpoint
INSERT INTO national_prize_paragraph (id, content_id, "text", sort_order)
SELECT CAST(item.key AS INTEGER) + 1, 1, item.value, CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.prizes.paragraphs') AS item WHERE page_content.key = 'national';
--> statement-breakpoint
INSERT INTO national_fact (content_id, "id", "text", sort_order)
SELECT 1, json_extract(item.value, '$.id'), json_extract(item.value, '$.text'), CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.facts') AS item WHERE page_content.key = 'national';
--> statement-breakpoint
INSERT INTO about_value (card_number, text, sort_order)
SELECT json_extract(card.value, '$.number'), item.value, CAST(item.key AS INTEGER)
FROM page_content, json_each(document, '$.values_cards') AS card, json_each(card.value, '$.values') AS item
WHERE page_content.key = 'about';
--> statement-breakpoint

CREATE TABLE `__new_international_olympiad` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image_alt` text NOT NULL,
	`href` text,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "international_olympiad_order_nonnegative" CHECK("__new_international_olympiad"."sort_order" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_international_olympiad`("id", "name", "description", "image_alt", "href", "sort_order", "created_at", "updated_at") SELECT "id", "name", "description", "image_alt", "href", "sort_order", "created_at", "updated_at" FROM `international_olympiad`;--> statement-breakpoint
DROP TABLE `international_olympiad`;--> statement-breakpoint
ALTER TABLE `__new_international_olympiad` RENAME TO `international_olympiad`;--> statement-breakpoint
CREATE UNIQUE INDEX `international_olympiad_sort_order_unique` ON `international_olympiad` (`sort_order`);--> statement-breakpoint
-- Preserve dependent placements before rebuilding sponsor, even with foreign keys enabled.
CREATE TABLE __saved_sponsor_placement AS SELECT * FROM sponsor_placement;
--> statement-breakpoint
DROP TABLE sponsor_placement;
--> statement-breakpoint
CREATE TABLE `__new_sponsor` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image_alt` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sponsor`("id", "name", "image_alt", "created_at", "updated_at") SELECT "id", "name", "image_alt", "created_at", "updated_at" FROM `sponsor`;--> statement-breakpoint
DROP TABLE `sponsor`;--> statement-breakpoint
ALTER TABLE `__new_sponsor` RENAME TO `sponsor`;
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
CREATE UNIQUE INDEX `sponsor_placement_order_unique` ON `sponsor_placement` (`page_key`,`sort_order`);
--> statement-breakpoint
CREATE INDEX `sponsor_placement_page_idx` ON `sponsor_placement` (`page_key`);
--> statement-breakpoint
INSERT INTO sponsor_placement SELECT * FROM __saved_sponsor_placement;
--> statement-breakpoint
DROP TABLE __saved_sponsor_placement;--> statement-breakpoint
CREATE TABLE `__new_training_material` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text,
	`image_alt` text DEFAULT '' NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "training_material_order_nonnegative" CHECK("__new_training_material"."sort_order" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_training_material`("id", "title", "description", "icon", "image_alt", "href", "sort_order", "created_at", "updated_at") SELECT "id", "title", "description", "icon", "image_alt", "href", "sort_order", "created_at", "updated_at" FROM `training_material`;--> statement-breakpoint
DROP TABLE `training_material`;--> statement-breakpoint
ALTER TABLE `__new_training_material` RENAME TO `training_material`;--> statement-breakpoint
CREATE UNIQUE INDEX `training_material_sort_order_unique` ON `training_material` (`sort_order`);--> statement-breakpoint
-- Preserve dependent placements before rebuilding team_member, even with foreign keys enabled.
CREATE TABLE __saved_team_member_placement AS SELECT * FROM team_member_placement;
--> statement-breakpoint
DROP TABLE team_member_placement;
--> statement-breakpoint
CREATE TABLE `__new_team_member` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`contact` text,
	`image_alt` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO __new_team_member ("id", "name", "role", "contact", "image_alt", "created_at", "updated_at") SELECT "id", "name", "role", "contact", "image_alt", "created_at", "updated_at" FROM team_member;
--> statement-breakpoint
DROP TABLE team_member;
--> statement-breakpoint
ALTER TABLE `__new_team_member` RENAME TO `team_member`;
--> statement-breakpoint
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
CREATE UNIQUE INDEX `team_member_placement_order_unique` ON `team_member_placement` (`page_key`,`placement`,`sort_order`);
--> statement-breakpoint
CREATE INDEX `team_member_placement_page_idx` ON `team_member_placement` (`page_key`,`placement`);
--> statement-breakpoint
INSERT INTO team_member_placement SELECT * FROM __saved_team_member_placement;
--> statement-breakpoint
DROP TABLE __saved_team_member_placement;
--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_name_unique` ON `team_member` (`name`);
--> statement-breakpoint
-- All document fields and ordered collections have now been transferred.
DROP TABLE page_content;
