import { query } from "$app/server";
import logo_apmo from "#lib/assets/logos/apmo.svg";
import logo_igo from "#lib/assets/logos/igo.svg";
import logo_mayo from "#lib/assets/logos/mayo.svg";
import logo_ucsg from "#lib/assets/logos/ucsg.svg";
import logo_sedem from "#lib/assets/logos/sedem.svg";
import logo_usfq from "#lib/assets/logos/usfq.svg";
import olympiad_ciim from "#lib/assets/olimpiadas/internacionales/olympiad-ciim.jpg?enhanced";
import olympiad_cono_sur from "#lib/assets/olimpiadas/internacionales/olympiad-cono-sur.jpeg?enhanced";
import olympiad_egmo from "#lib/assets/olimpiadas/internacionales/olympiad-egmo.jpeg?enhanced";
import olympiad_imo from "#lib/assets/olimpiadas/internacionales/olympiad-imo.jpeg?enhanced";
import olympiad_pagmo from "#lib/assets/olimpiadas/internacionales/olympiad-pagmo.jpeg?enhanced";
import olympiad_tjm from "#lib/assets/olimpiadas/internacionales/olympiad-tjm.jpeg?enhanced";

export const get_content = query(
	() =>
		({
			seo: {
				title: "Olimpiadas Internacionales",
				description:
					"Conoce las competencias matemáticas internacionales en las que participan las delegaciones ecuatorianas de OMEC.",
			},
			intro: {
				eyebrow: "Conoce algunas de las",
				title: "Olimpiadas Internacionales",
				description:
					"Estas son algunas de las olimpiadas en las que Ecuador participa a nivel internacional. Los ganadores de la ONM del año previo serán convocados a los selectivos de estas competencias y tendrán una oportunidad de formar parte de la delegación de Ecuador en estas olimpiadas, dependiendo de su edad y género.",
			},
			olympiads: [
				{
					id: "imo",
					name: "IMO",
					description:
						"La Olimpiada Internacional de Matemáticas es el certamen mundial en el que participan alrededor de 100 países de todos los continentes del mundo.",
					image: olympiad_imo,
					image_alt: "Participantes en la Olimpiada Internacional de Matemáticas",
					href: "http://imo-official.org/",
				},
				{
					id: "egmo",
					name: "EGMO",
					description:
						"Ecuador es un país invitado a la Olimpiada Europea Femenina que tiene como finalidad promover el estudio de las matemáticas en las mujeres.",
					image: olympiad_egmo,
					image_alt: "Participantes en la Olimpiada Europea Femenina de Matemáticas",
					href: "https://www.egmo.org/",
				},
				{
					id: "cono-sur",
					name: "Cono Sur",
					description:
						"La Olimpiada Matemática de Países del Cono Sur está dirigida a estudiantes de hasta 16 años de 8 países de Sudamérica.",
					image: olympiad_cono_sur,
					image_alt: "Participantes en la Olimpiada Matemática de Países del Cono Sur",
					href: undefined,
				},
				{
					id: "pagmo",
					name: "PAGMO",
					description:
						"La Olimpiada Panamericana Femenina de Matemáticas tiene como finalidad promover el estudio de las matemáticas en las mujeres. Tiene un límite de edad de 16 años.",
					image: olympiad_pagmo,
					image_alt: "Participantes en la Olimpiada Panamericana Femenina de Matemáticas",
					href: "https://www.pagmo.info/",
				},
				{
					id: "tjm",
					name: "Torneo de Jóvenes Matemáticos",
					description:
						"El TJM es una competencia entre países de Latinoamérica, para chicos de 13 a 16 años. Tiene un formato único donde los participantes obtienen retroalimentación sobre sus soluciones en tiempo real.",
					image: olympiad_tjm,
					image_alt: "Participantes en el Torneo de Jóvenes Matemáticos",
					href: undefined,
				},
				{
					id: "apmo",
					name: "APMO",
					description:
						"La Olimpiada Matemática de Asia Pacífico se realiza por correspondencia, tiene un formato y dificultad similar a la IMO.",
					image: logo_apmo,
					image_alt: "Logotipo de la Olimpiada Matemática de Asia Pacífico",
					href: "https://www.apmo-official.org/",
				},
				{
					id: "mayo",
					name: "Olimpiada de Mayo",
					description:
						'Conocida como la "Iberoamericana Junior", esta competencia por correspondencia es organizada por Argentina a nivel iberoamericano y está destinada a estudiantes menores de 15 años.',
					image: logo_mayo,
					image_alt: "Logotipo de la Olimpiada de Mayo",
					href: undefined,
				},
				{
					id: "igo",
					name: "IGO",
					description:
						"La Olimpiada Iraní de Geometría se enfoca únicamente en el área que le da el nombre. Esta olimpiada por correspondencia es única por tener un nivel abierto a todo el público, sin restricciones.",
					image: logo_igo,
					image_alt: "Logotipo de la Olimpiada Iraní de Geometría",
					href: undefined,
				},
				{
					id: "ciim",
					name: "CIIM",
					description:
						"La Competencia Iberoamericana Interuniversitaria de Matemáticas tiene el ánimo de incentivar el estudio de las matemáticas en la comunidad universitaria iberoamericana.",
					image: olympiad_ciim,
					image_alt:
						"Participantes en la Competencia Iberoamericana Interuniversitaria de Matemáticas",
					href: "http://ciim.uan.edu.co/",
				},
			],
			sponsors: {
				eyebrow: "Con el apoyo de",
				items: [
					{ id: "usfq", name: "Universidad San Francisco de Quito", image: logo_usfq },
					{
						id: "egcs-ucsg",
						name: "Escuela de Graduados en Ciencias de la Salud de la UCSG",
						image: logo_ucsg,
					},
					{ id: "sponsor", name: "Entidad auspiciadora de OMEC", image: logo_sedem },
				],
			},
		}) as const,
);
