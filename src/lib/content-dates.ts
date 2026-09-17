const DATE_FORMAT = new Intl.DateTimeFormat("es-EC", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});

export function format_content_date(date: string): string {
	return DATE_FORMAT.format(new Date(`${date}T00:00:00Z`));
}

export function format_stage_date(stage: {
	date_label: string | null;
	starts_on: string | null;
	ends_on: string | null;
}): string {
	if (stage.date_label) return stage.date_label;
	if (!stage.starts_on) throw new Error("Stage requires a date or a display label");
	const start = format_content_date(stage.starts_on);
	return stage.ends_on && stage.ends_on !== stage.starts_on
		? `${start} – ${format_content_date(stage.ends_on)}`
		: start;
}
