import { query } from "$app/server";
import logo_egmo from "#lib/assets/logos/egmo.svg";
import logo_omec from "#lib/assets/logos/omec.svg";

export const get_content = query(
	() =>
		({
			seo: {
				title: "Entrenamiento",
				description:
					"Material de entrenamiento de OMEC para prepararse para competencias matemáticas nacionales e internacionales.",
			},
			intro: { title: "Entrenamiento", description: "Nuestro material de entrenamiento" },
			section: {
				title: "Prepárate para las competencias",
				description:
					"La mejor manera de perpararse para concursos de matemáticas es resolviendo pruebas pasadas. En nuestro banco de problemas podrás encontrar problemas de competencias nacionales e internacionales. Asegúrate de practicar con problemas de tu nivel académico y de la competencia para la cual te estás preparando. Al hacer clic serás redirigido a una carpeta de Google Drive.",
			},
			materials: [
				{
					id: "estudio-a-profundidad",
					title: "Estudio a profundidad",
					description: "Temario a fondo de teoría de números y álgebra. Incluye temas avanzados.",
					icon: null,
					image: logo_omec,
					image_alt: "Logotipo de la Olimpiada Matemática Ecuatoriana",
					href: "https://drive.google.com/drive/folders/1PkZNnvenS0Bt9siJlsH8XTa7iEZOVcHj",
				},
				{
					id: "olimpiada-nacional",
					title: "Olimpiada Nacional de Matemáticas",
					description:
						"Esta carpeta incluye los problemas y soluciones de todos los niveles de las ONM 2016 – 2019",
					icon: null,
					image: logo_omec,
					image_alt: "Logotipo de la Olimpiada Matemática Ecuatoriana",
					href: "https://drive.google.com/drive/folders/1uHvRIcHWBflcFO0LajeEoJJoS2e8fNVi",
				},
				{
					id: "olimpiadas-internacionales",
					title: "Olimpiadas Internacionales",
					description:
						"Esta carpeta incluye pruebas pasadas de: IMO, EGMO, Cono Sur, Olimpiada de Mayo, CIIM y APMO",
					icon: null,
					image: logo_egmo,
					image_alt: "Logotipo de la Olimpiada Europea Femenina de Matemáticas",
					href: "https://drive.google.com/drive/folders/1z2aMiN57ITnnd7oZOtvENsOjDWdRaSkY?usp=sharing",
				},
				{
					id: "pruebas-selectivas",
					title: "Pruebas selectivas",
					description:
						"Esta carpeta incluye las pruebas selectivas que se llevan a cabo cada año con el fin de seleccionar al equipo Ecuatoriano que participará a nivel internacional.",
					icon: "presentation",
					image: null,
					image_alt: "",
					href: "https://drive.google.com/drive/folders/1o_tWnaBMD_0B54bZqVKEHmkFZzP9bHAi?usp=sharing",
				},
				{
					id: "listas-semanales",
					title: "Listas semanales",
					description:
						"Esta carpeta incluye las listas semanales OMEC. Estas listas fueron dadas cada semana entre 2013-2015. Hay de distintos niveles.",
					icon: "calendar_days",
					image: null,
					image_alt: "Ícono de calendario",
					href: "https://drive.google.com/drive/folders/1yhcXrcbxDZ2fMJtt--jiCUvn4Obog4Yk?usp=sharing",
				},
			],
		}) as const,
);
