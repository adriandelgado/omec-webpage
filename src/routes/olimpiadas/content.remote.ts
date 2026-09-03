import { query } from "$app/server";

export const get_content = query(
	() =>
		({
			intro: {
				title_lines: [{ text: "Olimpiadas" }, { text: "matemáticas", class: "text-primary" }],
				description:
					"Conoce la Olimpiada Nacional de Matemática y las competencias internacionales en las que participan las delegaciones ecuatorianas.",
			},
			section_title: "Competencias",
			routes: [
				{ label: "Olimpiadas internacionales", href: "/olimpiadas/internacionales" },
				{ label: "Olimpiadas nacionales", href: "/olimpiadas/nacionales" },
			],
		}) as const,
);
