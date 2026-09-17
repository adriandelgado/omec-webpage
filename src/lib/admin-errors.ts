export function admin_error_message(
	cause: unknown,
	fallback = "No se pudo completar la operación.",
): string {
	if (cause && typeof cause === "object" && "body" in cause) {
		const body = cause.body;
		if (body && typeof body === "object" && "message" in body && typeof body.message === "string")
			return body.message;
	}
	return cause instanceof Error ? cause.message : fallback;
}
