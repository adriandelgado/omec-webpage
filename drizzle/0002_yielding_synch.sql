DROP INDEX `about_value_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `about_value_order_unique` ON `about_value` (`card_number`,`sort_order`) WHERE "about_value"."archived_at" is null;--> statement-breakpoint
DROP INDEX `about_value_card_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `about_value_card_order_unique` ON `about_value_card` (`content_id`,`sort_order`) WHERE "about_value_card"."archived_at" is null;--> statement-breakpoint
DROP INDEX `home_information_item_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `home_information_item_order_unique` ON `home_information_item` (`content_id`,`sort_order`) WHERE "home_information_item"."archived_at" is null;--> statement-breakpoint
DROP INDEX `home_national_fact_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `home_national_fact_order_unique` ON `home_national_fact` (`content_id`,`sort_order`) WHERE "home_national_fact"."archived_at" is null;--> statement-breakpoint
DROP INDEX `home_olympiad_card_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `home_olympiad_card_order_unique` ON `home_olympiad_card` (`content_id`,`sort_order`) WHERE "home_olympiad_card"."archived_at" is null;--> statement-breakpoint
DROP INDEX `international_olympiad_sort_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `international_olympiad_sort_order_unique` ON `international_olympiad` (`sort_order`) WHERE "international_olympiad"."archived_at" is null;--> statement-breakpoint
DROP INDEX `national_fact_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_fact_order_unique` ON `national_fact` (`content_id`,`sort_order`) WHERE "national_fact"."archived_at" is null;--> statement-breakpoint
DROP INDEX `national_olympiad_level_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_level_order_unique` ON `national_olympiad_level` (`national_olympiad_id`,`sort_order`) WHERE "national_olympiad_level"."archived_at" is null;--> statement-breakpoint
DROP INDEX `national_olympiad_stage_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_order_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`sort_order`) WHERE "national_olympiad_stage"."archived_at" is null;--> statement-breakpoint
DROP INDEX `national_prize_paragraph_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `national_prize_paragraph_order_unique` ON `national_prize_paragraph` (`content_id`,`sort_order`) WHERE "national_prize_paragraph"."archived_at" is null;--> statement-breakpoint
DROP INDEX `news_article_sort_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `news_article_sort_order_unique` ON `news_article` (`sort_order`) WHERE "news_article"."archived_at" is null;--> statement-breakpoint
DROP INDEX `olympiads_route_card_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_route_card_order_unique` ON `olympiads_route_card` (`content_id`,`sort_order`) WHERE "olympiads_route_card"."archived_at" is null;--> statement-breakpoint
DROP INDEX `olympiads_title_line_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_title_line_order_unique` ON `olympiads_title_line` (`content_id`,`sort_order`) WHERE "olympiads_title_line"."archived_at" is null;--> statement-breakpoint
DROP INDEX `social_link_sort_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `social_link_sort_order_unique` ON `social_link` (`sort_order`) WHERE "social_link"."archived_at" is null;--> statement-breakpoint
DROP INDEX `sponsor_placement_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `sponsor_placement_order_unique` ON `sponsor_placement` (`page_key`,`sort_order`) WHERE "sponsor_placement"."archived_at" is null;--> statement-breakpoint
DROP INDEX `team_member_placement_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_placement_order_unique` ON `team_member_placement` (`page_key`,`placement`,`sort_order`) WHERE "team_member_placement"."archived_at" is null;--> statement-breakpoint
DROP INDEX `training_material_sort_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `training_material_sort_order_unique` ON `training_material` (`sort_order`) WHERE "training_material"."archived_at" is null;