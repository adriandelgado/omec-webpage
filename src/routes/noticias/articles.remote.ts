import { query } from "$app/server";

export const get_articles = query(
	() =>
		[
			{
				id: "logros-de-la-omec-en-2026",
				href: "/noticias/logros-de-la-omec-en-2026",
				date: "13 de agosto de 2026",
				date_published: "2026-08-13",
				author: "OMEC",
				title: "Logros de la OMEC en 2026",
				summary:
					"17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo.",
				link_label: "Leer noticia →",
			},
		] as const,
);
