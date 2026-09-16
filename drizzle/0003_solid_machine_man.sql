CREATE TABLE IF NOT EXISTS `contact_submission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`institution` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`read_at` integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `contact_submission_email_idx` ON `contact_submission` (`email`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `contact_submission_created_at_idx` ON `contact_submission` (`created_at`);
