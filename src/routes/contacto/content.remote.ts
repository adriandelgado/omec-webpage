import { query } from "$app/server";

export const get_content = query(
	() =>
		({
			seo: {
				title: "Contáctanos",
				description:
					"Contáctate con OMEC para resolver dudas sobre olimpiadas matemáticas, inscripciones, entrenamiento y participación estudiantil en Ecuador.",
			},
			intro: {
				title: "Contáctanos",
				description:
					"¿Tienes preguntas sobre las olimpiadas, el proceso de inscripción, o nuestros programas de entrenamiento? Estamos aquí para ayudarte.",
			},
			contact: { heading: "Información de Contacto", card_title: "Correo Electrónico" },
			follow: {
				heading: "Síguenos",
				description:
					"Mantente al día con nuestras últimas noticias, eventos y logros en nuestras redes sociales.",
			},
			form: {
				title: "Envíanos un Mensaje",
				required_notice_before: "Todos los campos marcados con ",
				required_notice_after: " son obligatorios.",
				invalid_notice: "Revisa los campos marcados antes de enviar.",
				fields: {
					full_name: { label: "Nombre Completo", placeholder: "Tu nombre" },
					email: { label: "Correo Electrónico", placeholder: "tu@email.com" },
					institution: { label: "Institución", placeholder: "tu colegio" },
					subject: { label: "Asunto", placeholder: "¿Sobre qué quieres escribirnos?" },
					message: {
						label: "Mensaje",
						placeholder: "Escribe tu mensaje aquí...",
						help: "Cuéntanos tu consulta con el mayor detalle posible.",
					},
				},
				submit_label: "Enviar Mensaje",
				pending_label: "Enviando...",
			},
		}) as const,
);
