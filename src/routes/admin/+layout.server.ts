import { redirect, error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals, url }) => {
	const public_paths = ["/admin/iniciar-sesion", "/admin/verificar-2fa"];
	if (!public_paths.includes(url.pathname)) {
		if (!locals.admin) redirect(303, "/admin/iniciar-sesion");
		if (locals.admin.must_change_password && url.pathname !== "/admin/cambiar-contrasena")
			redirect(303, "/admin/cambiar-contrasena");
		if (
			["/admin/cuentas", "/admin/auditoria"].includes(url.pathname) &&
			locals.admin.role !== "superadmin"
		)
			error(403, "No tienes permiso.");
		if (
			url.pathname.startsWith("/admin/contenido/") &&
			url.pathname !== "/admin/contenido/news_article" &&
			locals.admin.role === "editor"
		)
			error(403, "No tienes permiso.");
	}
	return { admin: locals.admin };
};
