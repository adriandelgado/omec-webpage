import * as v from "valibot";

export const contact_form_schema = v.object({
	full_name: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu nombre completo."),
		v.maxLength(120, "El nombre es demasiado largo."),
	),
	email: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu correo electrónico."),
		v.email("Ingresa un correo válido."),
		v.maxLength(160, "El correo es demasiado largo."),
	),
	institution: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu institución."),
		v.maxLength(160, "La institución es demasiado larga."),
	),
	subject: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa un asunto."),
		v.maxLength(160, "El asunto es demasiado largo."),
	),
	message: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Escribe tu mensaje."),
		v.minLength(20, "El mensaje debe tener al menos 20 caracteres."),
		v.maxLength(2000, "El mensaje es demasiado largo."),
	),
});

export type contact_form_values = v.InferOutput<typeof contact_form_schema>;
