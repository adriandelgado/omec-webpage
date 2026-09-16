import * as v from "valibot";

export const TURNSTILE_ACTION = "contact";

export const CONTACT_FORM_MAX_LENGTHS = {
	full_name: 120,
	email: 160,
	institution: 160,
	subject: 160,
	message: 2000,
	turnstile_token: 2048,
} as const;

export const contact_form_schema = v.object({
	full_name: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu nombre completo."),
		v.maxLength(CONTACT_FORM_MAX_LENGTHS.full_name, "El nombre es demasiado largo."),
	),
	email: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu correo electrónico."),
		v.email("Ingresa un correo válido."),
		v.maxLength(CONTACT_FORM_MAX_LENGTHS.email, "El correo es demasiado largo."),
	),
	institution: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu institución."),
		v.maxLength(CONTACT_FORM_MAX_LENGTHS.institution, "La institución es demasiado larga."),
	),
	subject: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa un asunto."),
		v.maxLength(CONTACT_FORM_MAX_LENGTHS.subject, "El asunto es demasiado largo."),
	),
	message: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Escribe tu mensaje."),
		v.minLength(20, "El mensaje debe tener al menos 20 caracteres."),
		v.maxLength(CONTACT_FORM_MAX_LENGTHS.message, "El mensaje es demasiado largo."),
	),
	turnstile_token: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Completa la verificación de seguridad."),
		v.maxLength(
			CONTACT_FORM_MAX_LENGTHS.turnstile_token,
			"La verificación de seguridad no es válida.",
		),
	),
});

export type contact_form_values = v.InferOutput<typeof contact_form_schema>;
