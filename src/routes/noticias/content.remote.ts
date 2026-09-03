import { query } from "$app/server";

export const get_content = query(
	() =>
		({
			seo: {
				title: "Noticias",
				description: "Noticias y comunicados de la Olimpiada Matemática Ecuatoriana.",
			},
			intro: {
				eyebrow: "OMEC",
				title: "Noticias",
				description:
					"Conoce las últimas noticias y comunicados de la Olimpiada Matemática Ecuatoriana.",
			},
			articles: [
				{
					id: "logros-de-la-omec-en-2026",
					href: "/noticias/logros-de-la-omec-en-2026",
					date: "13 de agosto de 2026",
					author: "OMEC",
					title: "Logros de la OMEC en 2026",
					summary:
						"17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo.",
					link_label: "Leer noticia →",
				},
			],
		}) as const,
);
