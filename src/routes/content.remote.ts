import { query } from "$app/server";
import logo_egcs_ucsg from "#lib/assets/logos/ucsg.svg";
import hero_image from "#lib/assets/home/imo-team-2026.jpeg?enhanced";
import about_image from "#lib/assets/home/olympiad-student.jpeg?enhanced";
import national_olympiad_image from "#lib/assets/home/national-olympiad-participants.jpg?enhanced";

export const get_content = query(
	() =>
		({
			seo: {
				title: "",
				description:
					"Olimpiada Matemática Ecuatoriana. Organizamos competencias, entrenamiento y procesos de selección para desarrollar el talento matemático de estudiantes ecuatorianos.",
			},
			hero: {
				title: "Olimpiada Matemática",
				highlight: "Ecuatoriana",
				image: hero_image,
				image_alt: "Delegación ecuatoriana junto al letrero de la IMO 2026 en Shanghái",
			},
			national_olympiad: {
				link_label: "Conoce la olimpiada nacional",
				link_href: "/olimpiadas/nacionales",
				information_items: [
					{ id: "information", title: "Información", icon: "info", href: "/olimpiadas/nacionales" },
					{ id: "preparation", title: "Preparación", icon: "lightbulb", href: "/entrenamiento" },
					{ id: "news", title: "Noticias", icon: "newspaper", href: "/noticias" },
				],
			},
			about: {
				eyebrow: "Acerca de nosotros",
				title: "Encontrando talentos matemáticos desde 1997",
				description_html:
					"Desde 1997, la <em>Olimpiada Matemática Ecuatoriana (OMEC)</em> detecta, forma y prepara a los talentos matemáticos que integran los equipos que representan al país en varias competencias olímpicas. Entre ellas están la <strong>Olimpiada Internacional de Matemáticas (IMO)</strong>, la <strong>Olimpiada Europea Femenina de Matemáticas (EGMO)</strong>, la <strong>Olimpiada Matemática de Asia-Pacífico (APMO)</strong> y la <strong>Olimpiada Matemática de Países del Cono Sur</strong>.",
				link_label: "Ver más sobre OMEC",
				link_href: "/nosotros",
				image: about_image,
				image_alt:
					"Dos estudiantes sostienen sus diplomas y medallas de la Olimpiada Matemática Ecuatoriana",
			},
			sponsor: {
				title: "Conoce a Nuestros Auspiciantes",
				image: logo_egcs_ucsg,
				image_alt:
					"Logo de la Escuela de Graduados en Ciencias de la Salud de la Universidad Católica de Santiago de Guayaquil",
			},
			olympiad_cards: [
				{
					id: "national",
					title: "Olimpiada Nacional de Matemáticas",
					description:
						"Tiene como objetivo preseleccionar a los estudiantes que formarán parte de los equipos que representan al país en los torneos internacionales en los que competimos. Está abierta a cualquier estudiante del sistema educativo ecuatoriano.",
					href: "/olimpiadas/nacionales",
					link_label: "Ver más",
				},
				{
					id: "international",
					title: "Olimpiadas Internacionales",
					description:
						"Incluyen varias competencias presenciales y por correspondencia. A estos eventos solo se asiste con una invitación dirigida a los ganadores de la Olimpiada Nacional del año anterior.",
					href: "/olimpiadas/internacionales",
					link_label: "Ver más",
				},
			],
			national_facts: {
				title: "Nuestra Olimpiada Nacional de Matemáticas",
				image: national_olympiad_image,
				image_alt: "Estudiantes participan en una prueba de la Olimpiada Nacional de Matemáticas",
				facts: [
					"Participan colegios de todo el Ecuador. También se puede participar de manera independiente.",
					"Concursantes de primaria, secundaria y universidad",
					"Abierto a todas las provincias del Ecuador",
				],
			},
			follow: {
				eyebrow: "Síguenos",
				title: "No te pierdas de inscripciones y fechas importantes",
			},
		}) as const,
);
