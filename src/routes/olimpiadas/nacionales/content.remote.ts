import { query } from "$app/server";
import awards_image from "#lib/assets/olimpiadas/nacionales/onm-2019-awards.jpg?enhanced";
import video_image from "#lib/assets/olimpiadas/nacionales/onm-2019-video-thumbnail.jpg?enhanced";

export const get_content = query(
	() =>
		({
			seo: {
				title: "Olimpiada Nacional de Matemática",
				description:
					"Información sobre la Olimpiada Nacional de Matemática de OMEC: fechas, niveles de participación, preparación y premios.",
			},
			announcement: {
				text: "Las inscripciones de la Olimpiada Nacional de Matemática 2026 se abrirán en septiembre.",
				stages: [
					"Primera fase: 17 de octubre",
					"Segunda fase: 7 de noviembre",
					"Fase final: 11 y 12 de diciembre",
				],
			},
			information: {
				eyebrow: "Información",
				title: "¿A quién está dirigido?",
				description:
					"Para participar es necesario ser estudiante regular de cualquier institución educativa del país, ya sea de Educación Básica, Bachillerato o Universitarios.",
				registration_title: "Cuándo y cómo inscribirse",
				registration_description:
					"Las inscripciones de la Olimpiada Nacional de Matemática se abren usualmente en los meses de junio o julio. La apertura de inscripciones, la convocatoria y los pasos de inscripción se publicarán en nuestras redes sociales y esta página web.",
			},
			follow: {
				eyebrow: "Síguenos",
				title: "No te pierdas las fechas importantes",
				description:
					"Síguenos en Facebook, Instagram o TikTok para estar al tanto de fechas importantes, eventos y convocatorias.",
			},
			levels: {
				eyebrow: "Niveles",
				title: "Encuentra tu nivel",
				description:
					"Las categorías de participación se determinan según la edad y el nivel de escolaridad del competidor.",
				items: [
					{
						id: "nivel-b",
						name: "Nivel B",
						description: "Estudiantes de hasta 5º de Educación Básica",
					},
					{
						id: "nivel-a",
						name: "Nivel A",
						description: "Estudiantes de hasta 7º de Educación Básica",
					},
					{
						id: "nivel-1",
						name: "Nivel 1",
						description: "Estudiantes de hasta 9º de Educación Básica",
					},
					{
						id: "nivel-2",
						name: "Nivel 2",
						description: "Estudiantes de hasta 1º de Bachillerato General Unificado",
					},
					{
						id: "nivel-3",
						name: "Nivel 3",
						description: "Estudiantes de hasta 3º de Bachillerato General Unificado",
					},
					{ id: "nivel-u", name: "Nivel U", description: "Estudiantes universitarios" },
				],
			},
			preparation: {
				eyebrow: "Preparación",
				title: "Practica con pruebas anteriores",
				description:
					"Te sugerimos prepararte con problemas de concursos pasados. Puedes acceder a pruebas anteriores de nuestra competencia haciendo clic en el botón de abajo.",
				href: "https://drive.google.com/drive/folders/1uHvRIcHWBflcFO0LajeEoJJoS2e8fNVi?usp=sharing",
				link_label: "Ver Libros ONM",
			},
			prizes: {
				eyebrow: "Premios",
				title: "¿Qué gano?",
				paragraphs: [
					"Además de su medalla y reconocimiento, los ganadores de cada nivel recibirán medallas de oro, plata y bronce, según su ubicación por puntuaciones obtenidas en la última etapa.",
					"Además de las medallas y los premios respectivos, los ganadores de la Olimpiada Nacional de Matemática tendrán la posibilidad de ser invitados a las pruebas selectivas para determinar los integrantes de los diferentes equipos que representarán al Ecuador en las competencias internacionales.",
				],
			},
			awards: {
				eyebrow: "Premiación ONM 2019",
				image: awards_image,
				image_alt: "Estudiantes durante la premiación de la Olimpiada Nacional de Matemática 2019",
			},
			video: {
				href: "https://www.facebook.com/OlimpiadaMatematicaEcuatoriana/videos/1084803171855869",
				image: video_image,
				image_alt: "Vista previa del video de la premiación ONM 2019",
				label: "Ver video",
			},
			facts: [
				{ id: "levels", text: "6 niveles" },
				{ id: "open", text: "Abierto a todos los estudiantes ecuatorianos" },
				{ id: "problems", text: "Problemas de razonamiento y creatividad" },
				{ id: "fee", text: "Costo de inscripción de $10" },
				{ id: "phases", text: "3 fases: online y presencial" },
			],
		}) as const,
);
