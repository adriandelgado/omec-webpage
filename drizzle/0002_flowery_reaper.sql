ALTER TABLE `home_content` RENAME COLUMN "about_description_html" TO "about_description_markdown";
--> statement-breakpoint
UPDATE `home_content`
SET `about_description_markdown` = replace(
	replace(
		replace(replace(`about_description_markdown`, '<em>', '*'), '</em>', '*'),
		'<strong>',
		'**'
	),
	'</strong>',
	'**'
)
WHERE `about_description_markdown` LIKE '%<em>%'
	OR `about_description_markdown` LIKE '%<strong>%';
