import { query } from "$app/server";
import fernando_gomez from "#lib/assets/nosotros/fernando-gomez.jpg?enhanced";
import imo_2018 from "#lib/assets/nosotros/imo-2018.jpg";
import imo_2018_image from "#lib/assets/nosotros/imo-2018.jpg?enhanced";
import lucero_llanos from "#lib/assets/nosotros/lucero-llanos.jpg?enhanced";
import pablo_serrano from "#lib/assets/nosotros/pablo-serrano.jpg?enhanced";
import pedro_suarez from "#lib/assets/nosotros/pedro-suarez.png?enhanced";
import valeria_santana from "#lib/assets/nosotros/valeria-santana.jpeg?enhanced";

export const get_content = query(
	() =>
		({
			seo: {
				title: "Acerca de nosotros",
				description:
					"Conoce la labor, misión, visión, valores y miembros de la Olimpiada Matemática Ecuatoriana.",
				image: imo_2018,
				image_alt: "Delegación ecuatoriana en la Olimpiada Internacional de Matemáticas 2018",
			},
			alert: "Aviso a la comunidad: Vicente Torres y Jorge Chamaidán ya no forman parte de la OMEC",
			labor: {
				eyebrow: "Acerca de",
				title: "Nuestra labor",
				description:
					"Descubrir, formar e impulsar el talento matemático para contribuir al desarrollo científico, educativo y humano del Ecuador. OMEC existe para abrir oportunidades a estudiantes apasionados por las matemáticas, brindándoles espacios donde el conocimiento, la curiosidad y el esfuerzo se conviertan en herramientas para alcanzar su máximo potencial.",
				image: imo_2018_image,
				image_alt: "Delegación ecuatoriana en la Olimpiada Internacional de Matemáticas 2018",
			},
			values_cards: [
				{
					number: "01",
					title: "Nuestra misión",
					description:
						"Desarrollar el talento matemático mediante competencias académicas y experiencias de aprendizaje. Nuestro compromiso es proporcionar las herramientas necesarias para competir al más alto nivel, mientras cultivamos valores que trascienden el ámbito académico.",
				},
				{
					number: "02",
					title: "Nuestra visión",
					description:
						"Consolidarnos como un referente del desarrollo científico y cultural en Ecuador y América Latina, promoviendo una comunidad matemática reconocida por su excelencia académica, liderazgo, calidad humana y compromiso con la sociedad.",
				},
				{
					number: "03",
					title: "Nuestros valores",
					values: [
						"Altruismo académico",
						"Auto aprendizaje",
						"Equidad",
						"Honestidad",
						"Transparencia",
						"Trabajo en equipo",
					],
				},
			],
			members: [
				"Adrián Delgado",
				"Adrián Cerda",
				"Anthony Flores",
				"Ana Indacochea",
				"Arody Carlosama",
				"Cristhyan Cayetano",
				"Daniel Suárez",
				"Eduardo Arteaga",
				"Emilio Zamora",
				"Fernando Gómez",
				"Giacomo Yu",
				"Gratzia Indacochea",
				"Jahir Cajas",
				"Jordie Astudillo",
				"Keny Carlosama",
				"Lucero Llanos",
				"Marcelo Rodríguez",
				"Mauricio Cevallos",
				"Melvin Poveda",
				"Mia Dunn",
				"Miguel Guzmán",
				"Pablo Serrano",
				"Pedro Suárez",
				"Romnie Acosta",
				"Samantha Carrillo",
				"Santiago Velázquez",
				"Sebastián Regalado",
				"Valentina Ulloa",
				"Valeria Santana",
				"Víctor Marriott",
			],
			directors: [
				{
					id: "fernando-gomez",
					name: "Fernando Gómez",
					role: "Director académico",
					image: fernando_gomez,
					image_alt: "Retrato de Fernando Gómez, director académico de OMEC",
				},
				{
					id: "pablo-serrano",
					name: "Pablo Serrano",
					role: "Director general",
					image: pablo_serrano,
					image_alt: "Retrato de Pablo Serrano, director general de OMEC",
				},
				{
					id: "lucero-llanos",
					name: "Lucero Llanos",
					role: "Directora de comunicación",
					image: lucero_llanos,
					image_alt: "Retrato de Lucero Llanos, directora de comunicación de OMEC",
				},
				{
					id: "valeria-santana",
					name: "Valeria Santana",
					role: "Tesorera",
					image: valeria_santana,
					image_alt: "Retrato de Valeria Santana, tesorera de OMEC",
				},
				{
					id: "pedro-suarez",
					name: "Pedro Suárez",
					role: "Relaciones Interinstitucionales",
					contact: "pedro.suarez@omec-mat.org",
					image: pedro_suarez,
					image_alt:
						"Retrato de Pedro Suárez, responsable de Relaciones Interinstitucionales de OMEC",
				},
			],
			members_heading: "Miembros de la OMEC",
			team: { eyebrow: "Nuestro Equipo", title: "Conoce a los directores de actividades" },
		}) as const,
);
