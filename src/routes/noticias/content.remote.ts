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
		}) as const,
);
