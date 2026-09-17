import { error } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import { client } from "../db";
import { resolve_session, SESSION_COOKIE } from "./sessions";

export async function require_user(
	options: { superadmin?: boolean; content?: boolean; allow_temporary?: boolean } = {},
) {
	const event = getRequestEvent();
	// Remote functions are independently authorized, including calls after suspension.
	const session = await resolve_session(client, event.cookies.get(SESSION_COOKIE));
	if (!session) error(401, "Inicia sesión para continuar.");
	if (session.user.must_change_password && !options.allow_temporary)
		error(403, "Debes cambiar tu contraseña.");
	if (options.superadmin && session.user.role !== "superadmin") error(403, "No tienes permiso.");
	if (options.content && session.user.role === "editor") error(403, "No tienes permiso.");
	return { ...session, event };
}
