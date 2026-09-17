CREATE TABLE `admin_login_challenge` (
	`digest` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `admin_recovery_code` (
	`digest` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `admin_session` (
	`digest` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `admin_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`password_hash` text NOT NULL,
	`must_change_password` integer DEFAULT 1 NOT NULL,
	`suspended_at` integer,
	`totp_secret` text,
	`totp_last_step` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "admin_role_valid" CHECK("admin_user"."role" in ('superadmin', 'admin', 'editor'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_user_email_unique` ON `admin_user` (`email`);--> statement-breakpoint
CREATE TABLE `audit_event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_rate_limit` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`resets_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media_asset` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`alt_text` text DEFAULT '' NOT NULL,
	`uploader_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`archived_at` integer,
	`archived_by` text,
	FOREIGN KEY (`uploader_id`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`archived_by`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_asset_object_key_unique` ON `media_asset` (`object_key`);--> statement-breakpoint
CREATE TABLE `news_slug_redirect` (
	`old_slug` text PRIMARY KEY NOT NULL,
	`article_slug` text NOT NULL,
	FOREIGN KEY (`article_slug`) REFERENCES `news_article`(`slug`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_news_article` (
	`archived_at` integer,
	`archived_by` text,
	`owner_id` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`slug` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`date_label` text,
	`published_on` text,
	`author` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`link_label` text NOT NULL,
	`body_markdown` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`archived_by`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `admin_user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "news_article_order_nonnegative" CHECK("__new_news_article"."sort_order" >= 0),
	CONSTRAINT "news_article_date_published_iso" CHECK("__new_news_article"."published_on" is null or ("__new_news_article"."published_on" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("__new_news_article"."published_on", '+0 days') is "__new_news_article"."published_on")),
	CONSTRAINT "news_article_status_valid" CHECK("__new_news_article"."status" in ('draft', 'published') and ("__new_news_article"."status" != 'published' or "__new_news_article"."published_on" is not null))
);
--> statement-breakpoint
INSERT INTO `__new_news_article`("archived_at", "archived_by", "owner_id", "status", "slug", "category", "date_label", "published_on", "author", "title", "summary", "link_label", "body_markdown", "sort_order", "created_at", "updated_at") SELECT NULL, NULL, NULL, 'published', "slug", "category", "date_label", "published_on", "author", "title", "summary", "link_label", "body_markdown", "sort_order", "created_at", "updated_at" FROM `news_article`;--> statement-breakpoint
DROP TABLE `news_article`;--> statement-breakpoint
ALTER TABLE `__new_news_article` RENAME TO `news_article`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `news_article_sort_order_unique` ON `news_article` (`sort_order`);--> statement-breakpoint
CREATE INDEX `news_article_published_idx` ON `news_article` (`published_on`,`sort_order`);--> statement-breakpoint
ALTER TABLE `about_content` ADD `seo_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `about_content` ADD `labor_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `about_value` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `about_value` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `about_value` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `about_value` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `about_value_card` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `about_value_card` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `about_value_card` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `about_value_card` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `home_content` ADD `hero_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `home_content` ADD `about_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `home_content` ADD `national_facts_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `home_information_item` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `home_information_item` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `home_information_item` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `home_information_item` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `home_national_fact` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `home_national_fact` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `home_national_fact` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `home_national_fact` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `home_olympiad_card` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `home_olympiad_card` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `home_olympiad_card` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `home_olympiad_card` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `international_olympiad` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `international_olympiad` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `international_olympiad` ADD `media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `national_content` ADD `awards_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `national_content` ADD `video_media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `national_fact` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `national_fact` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `national_fact` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `national_fact` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `national_olympiad` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `national_olympiad` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `national_olympiad_level` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `national_olympiad_level` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `national_olympiad_stage` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `national_olympiad_stage` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `national_prize_paragraph` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `national_prize_paragraph` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `national_prize_paragraph` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `national_prize_paragraph` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `olympiads_route_card` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `olympiads_route_card` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `olympiads_route_card` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `olympiads_route_card` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `olympiads_title_line` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `olympiads_title_line` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `olympiads_title_line` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `olympiads_title_line` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `social_link` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `social_link` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `sponsor` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `sponsor` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `sponsor` ADD `media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `sponsor_placement` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `sponsor_placement` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `team_member` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `team_member` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `team_member` ADD `media_id` text REFERENCES media_asset(id);--> statement-breakpoint
ALTER TABLE `team_member_placement` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `team_member_placement` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `training_material` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `training_material` ADD `archived_by` text REFERENCES admin_user(id);--> statement-breakpoint
ALTER TABLE `training_material` ADD `media_id` text REFERENCES media_asset(id);
--> statement-breakpoint
CREATE TRIGGER audit_event_no_update BEFORE UPDATE ON audit_event BEGIN SELECT RAISE(ABORT, 'audit events are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER audit_event_no_delete BEFORE DELETE ON audit_event BEGIN SELECT RAISE(ABORT, 'audit events are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER admin_last_superadmin_update BEFORE UPDATE OF role, suspended_at ON admin_user
WHEN OLD.role = 'superadmin' AND OLD.suspended_at IS NULL AND (NEW.role != 'superadmin' OR NEW.suspended_at IS NOT NULL)
AND (SELECT count(*) FROM admin_user WHERE role = 'superadmin' AND suspended_at IS NULL) <= 1
BEGIN SELECT RAISE(ABORT, 'No se puede desactivar al último superadministrador.'); END;
--> statement-breakpoint
CREATE TRIGGER admin_last_superadmin_delete BEFORE DELETE ON admin_user
WHEN OLD.role = 'superadmin' AND OLD.suspended_at IS NULL
AND (SELECT count(*) FROM admin_user WHERE role = 'superadmin' AND suspended_at IS NULL) <= 1
BEGIN SELECT RAISE(ABORT, 'No se puede eliminar al último superadministrador.'); END;
