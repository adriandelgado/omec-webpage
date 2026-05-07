import * as v from "valibot";

export const login_form_schema = v.object({
	email: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa tu correo electrónico."),
		v.email("Ingresa un correo válido."),
	),
	_password: v.pipe(
		v.string(),
		v.nonEmpty("Ingresa tu contraseña."),
		v.maxLength(255, "La contraseña es demasiado larga."),
	),
});

export type LoginFormValues = v.InferOutput<typeof login_form_schema>;
