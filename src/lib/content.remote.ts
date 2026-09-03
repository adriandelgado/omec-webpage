import { query } from "$app/server";

export const get_site_content = query(
	() =>
		({
			contact: {
				email: "info@omec-mat.org",
				email_href: "mailto:info@omec-mat.org",
			},
			social_links: [
				{
					id: "facebook",
					label: "Facebook",
					href: "https://www.facebook.com/OlimpiadaMatematicaEcuatoriana",
					class_name: "bg-primary text-white",
					path: "M14 8h-2c-.7 0-1 .3-1 1v2H9v3h2v6h3v-6h2.3l.7-3H14V9c0-.2.1-.3.3-.3H17V6h-2.6C11.9 6 11 7.1 11 8.7V8z",
				},
				{
					id: "instagram",
					label: "Instagram",
					href: "https://www.instagram.com/omec.mat",
					class_name: "bg-pink-500 text-white",
					path: "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm0 2.2A1.8 1.8 0 0 0 6.2 8v8A1.8 1.8 0 0 0 8 17.8h8a1.8 1.8 0 0 0 1.8-1.8V8A1.8 1.8 0 0 0 16 6.2H8zm8.5 1.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.2A1.8 1.8 0 1 0 12 13.8a1.8 1.8 0 0 0 0-3.6z",
				},
				{
					id: "tiktok",
					label: "TikTok",
					href: "https://www.tiktok.com/@omec.mat",
					class_name: "bg-copy text-white",
					path: "M14.2 3c.2 1.8 1.2 3.5 2.8 4.5 1 .6 2.1.9 3.3.9v3.1c-2.2 0-4.3-.7-6.1-2v6.3a5.8 5.8 0 1 1-5-5.8v3.2a2.7 2.7 0 1 0 1.9 2.6V3h3.1z",
				},
			],
		}) as const,
);

export const get_national_olympiad = query(
	() =>
		({
			title: "Olimpiada Nacional de Matemática 2026",
			announcement:
				"Las inscripciones de la Olimpiada Nacional de Matemática 2026 se abrirán en septiembre.",
			stages: [
				{ label: "Primera fase", date: "17 de octubre" },
				{ label: "Segunda fase", date: "7 de noviembre" },
				{ label: "Fase final", date: "11 y 12 de diciembre" },
			],
		}) as const,
);
