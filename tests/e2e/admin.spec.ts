import { test, expect, type Page } from "@playwright/test";
import { TEST_PASSWORD } from "../fixtures";
import { createClient } from "@libsql/client";
import { TOTP, Secret } from "otpauth";
import { hash_password } from "../../src/lib/server/auth/crypto";
import { TEST_KEYS } from "../fixtures";
import { COLLECTIONS } from "../../src/lib/server/cms/registry";

function test_database() {
	const url = process.env.OMEC_E2E_DATABASE_URL;
	if (!url?.includes("/omec-e2e-")) throw new Error("Base de prueba inválida.");
	return createClient({ url });
}
test.beforeEach(async () => {
	const db = test_database();
	await db.execute("DELETE FROM auth_rate_limit");
	db.close();
});

async function login(page: Page, role: string, password = TEST_PASSWORD) {
	await page.goto("/admin/iniciar-sesion");
	await page
		.getByLabel("Correo electrónico")
		.fill(role.includes("@") ? role : role + "@example.org");
	await page.getByLabel("Contraseña", { exact: true }).fill(password);
	await page.getByRole("button", { name: "Entrar", exact: true }).click();
	if (password !== "incorrect-password")
		await page.waitForURL((url) => !url.pathname.endsWith("iniciar-sesion"));
}
test("anonymous access, generic login failure and logout", async ({ page }) => {
	await page.goto("/admin");
	await expect(page).toHaveURL(/iniciar-sesion/);
	await login(page, "unknown", "incorrect-password");
	await expect(page.getByRole("alert")).toContainText("No se pudo iniciar sesión");
	await login(page, "superadmin");
	await expect(page.getByRole("heading", { name: "Resumen", exact: true })).toBeVisible();
	await page.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
	await expect(page).toHaveURL(/iniciar-sesion/);
});
test("editor only sees owned articles and cannot access content, accounts or audit", async ({
	page,
}) => {
	await login(page, "editor");
	await expect(page.getByRole("heading", { name: "Resumen", exact: true })).toBeVisible();
	await expect(page.getByRole("link", { name: "Cuentas", exact: true })).toHaveCount(0);
	await page.goto("/admin/contenido/news_article");
	await expect(page.getByText("No hay registros.", { exact: true })).toBeVisible();
	for (const route of ["/admin/cuentas", "/admin/auditoria", "/admin/contenido/site_content"]) {
		const response = await page.goto(route);
		expect(response?.status()).toBe(403);
	}
});
test("admin content save, inbox transitions and denied account management", async ({ page }) => {
	await login(page, "admin");
	await expect(page.getByRole("heading", { name: "Resumen", exact: true })).toBeVisible();
	await page.goto("/admin/contenido/site_content");
	await page.getByRole("button", { name: "1", exact: true }).click();
	await page.getByLabel("contacto · correo", { exact: false }).first().fill("nuevo@example.org");
	await page.getByRole("button", { name: "Guardar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	await page.goto("/admin/contenido/contact_submission");
	await page.getByRole("button", { name: /Ejemplo/ }).click();
	await page.getByLabel("Estado *", { exact: true }).selectOption("read");
	await page.getByRole("button", { name: "Guardar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	const response = await page.goto("/admin/cuentas");
	expect(response?.status()).toBe(403);
});
test("superadmin creates a temporary account, enforces password change and protects final superadmin", async ({
	page,
	browser,
}) => {
	await login(page, "superadmin");
	await page.goto("/admin/cuentas");
	await page.getByLabel("Nombre", { exact: true }).fill("Cuenta temporal");
	await page.getByLabel("Correo electrónico", { exact: true }).fill("temporal@example.org");
	await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
	const password = await page.locator("code").textContent();
	expect(password).toHaveLength(64);
	const context = await browser.newContext();
	const other = await context.newPage();
	await login(other, "temporal@example.org", password!);
	await expect(other).toHaveURL(/cambiar-contrasena/);
	await other.goto("/admin");
	await expect(other).toHaveURL(/cambiar-contrasena/);
	await other.getByLabel("Contraseña actual").fill(password!);
	await other.getByLabel("Nueva contraseña").fill("Nueva-contraseña-segura-2026");
	await other.getByRole("button", { name: "Cambiar contraseña", exact: true }).click();
	await expect(other).toHaveURL(/seguridad/);
	await context.close();
	page.on("dialog", (dialog) => dialog.accept());
	const superadmin = page
		.locator("li")
		.filter({ has: page.getByRole("heading", { name: "superadmin · superadmin@example.org" }) });
	await superadmin.getByRole("button", { name: "Suspender", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("último superadministrador");
});

test("editor publishes owned news, changes slugs and archives/restores", async ({
	page,
	request,
}) => {
	await login(page, "editor");
	await page.goto("/admin/contenido/news_article");
	await page.getByRole("button", { name: "Crear registro", exact: true }).click();
	await page.getByLabel("Enlace de la noticia *", { exact: true }).fill("noticia-editor");
	await page.getByLabel("Categoría *", { exact: true }).fill("Competencias");
	await page.getByLabel("Firma / autor *", { exact: true }).fill("Autora invitada");
	await page.getByLabel("Título *", { exact: true }).fill("Noticia del editor");
	await page.getByLabel("Resumen *", { exact: true }).fill("Resumen de prueba");
	await page.getByLabel("Texto del enlace *", { exact: true }).fill("Leer noticia");
	await page
		.getByLabel("Contenido Markdown *", { exact: true })
		.fill("# Contenido\n\n<script>alert(1)</script>");
	await page.getByRole("button", { name: "Guardar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	expect((await request.get("/noticias/noticia-editor")).status()).toBe(404);
	await page.getByRole("button", { name: /Noticia del editor/ }).click();
	await page.getByLabel("Estado *", { exact: true }).selectOption("published");
	await page.getByLabel("Fecha de publicación", { exact: false }).fill("2026-09-17");
	await page.getByRole("button", { name: "Guardar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	expect((await request.get("/noticias/noticia-editor")).status()).toBe(200);
	await page.getByRole("button", { name: /Noticia del editor/ }).click();
	await page.getByLabel("Enlace de la noticia *", { exact: true }).fill("noticia-renombrada");
	await page.getByRole("button", { name: "Guardar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	const redirected = await request.get("/noticias/noticia-editor", { maxRedirects: 0 });
	expect(redirected.status()).toBe(301);
	expect(redirected.headers().location).toBe("/noticias/noticia-renombrada");
	page.on("dialog", (dialog) => dialog.accept());
	await page.getByRole("button", { name: /Noticia del editor/ }).click();
	await page.getByRole("button", { name: "Archivar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	expect((await request.get("/noticias/noticia-renombrada")).status()).toBe(404);
	await page.getByLabel("Ver archivados", { exact: true }).check();
	await page.getByRole("button", { name: /Noticia del editor/ }).click();
	await page.getByRole("button", { name: "Restaurar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	expect((await request.get("/noticias/noticia-renombrada")).status()).toBe(200);
});

test("TOTP enrollment, challenge failure, recovery and replay protection", async ({ page }) => {
	const db = test_database();
	const id = crypto.randomUUID();
	await db.execute({
		sql: "INSERT INTO admin_user (id,email,name,role,password_hash,must_change_password,created_at,updated_at) VALUES (?,'twofactor@example.org','Dos factores','editor',?,0,1,1)",
		args: [id, await hash_password(TEST_PASSWORD, JSON.parse(TEST_KEYS))],
	});
	await login(page, "twofactor@example.org");
	await page.goto("/admin/seguridad");
	await page.getByLabel("Confirma tu contraseña", { exact: true }).fill(TEST_PASSWORD);
	await page
		.getByRole("button", { name: "Configurar aplicación de autenticación", exact: true })
		.click();
	const secret_text = await page.getByText(/^Clave:/).textContent();
	const secret = secret_text!.replace("Clave:", "").trim();
	const totp = new TOTP({ secret: Secret.fromBase32(secret) });
	await page.getByLabel("Contraseña", { exact: true }).fill(TEST_PASSWORD);
	await page.getByLabel("Primer código", { exact: true }).fill(totp.generate());
	const before = (await page.context().cookies()).find((c) => c.name === "omec_admin")!.value;
	await page.getByRole("button", { name: "Activar verificación", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Guarda estos códigos");
	const recovery = await page.getByRole("status").locator("li").first().textContent();
	const recovery_codes = await page.getByRole("status").locator("li").allTextContents();
	expect((await page.context().cookies()).find((c) => c.name === "omec_admin")!.value).not.toBe(
		before,
	);
	await page.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
	await login(page, "twofactor@example.org");
	await expect(page).toHaveURL(/verificar-2fa/);
	await page.getByLabel("Código", { exact: true }).fill("incorrecto");
	await page.getByRole("button", { name: "Verificar", exact: true }).click();
	await expect(page.getByRole("alert")).toContainText("No se pudo iniciar sesión");
	expect(
		(
			await db.execute({
				sql: "SELECT count(*) AS count FROM admin_session WHERE user_id = ?",
				args: [id],
			})
		).rows[0].count,
	).toBe(0);
	await page.getByLabel("Código", { exact: true }).fill(recovery!);
	await page.getByRole("button", { name: "Verificar", exact: true }).click();
	await expect(page).toHaveURL("/admin");
	expect(
		(
			await db.execute({
				sql: "SELECT count(*) AS count FROM admin_recovery_code WHERE user_id = ?",
				args: [id],
			})
		).rows[0].count,
	).toBe(9);
	await page.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
	await login(page, "twofactor@example.org");
	await page.getByLabel("Código", { exact: true }).fill(recovery!);
	await page.getByRole("button", { name: "Verificar", exact: true }).click();
	await expect(page.getByRole("alert")).toContainText("No se pudo iniciar sesión");
	await page.getByLabel("Código", { exact: true }).fill(recovery_codes[1]);
	await page.getByRole("button", { name: "Verificar", exact: true }).click();
	await expect(page).toHaveURL("/admin");
	await page.goto("/admin/seguridad");
	await page.getByLabel("Contraseña", { exact: true }).fill(TEST_PASSWORD);
	await page.getByLabel("Código de autenticación o recuperación").fill(recovery_codes[2]);
	await page.getByRole("combobox", { name: "Acción", exact: true }).selectOption("regenerate");
	await page.getByRole("button", { name: "Confirmar cambio", exact: true }).click();
	const replacement_notice = page.getByRole("status").filter({ hasText: "Guarda estos códigos" });
	await expect(replacement_notice).toBeVisible();
	const replacement = await replacement_notice.locator("li").first().textContent();
	await page.getByLabel("Contraseña", { exact: true }).fill(TEST_PASSWORD);
	await page.getByLabel("Código de autenticación o recuperación").fill(replacement!);
	await page.getByRole("combobox", { name: "Acción", exact: true }).selectOption("disable");
	await page.getByRole("button", { name: "Confirmar cambio", exact: true }).click();
	await expect(
		page.getByRole("button", { name: "Configurar aplicación de autenticación", exact: true }),
	).toBeVisible();
	expect(
		(await db.execute({ sql: "SELECT totp_secret FROM admin_user WHERE id = ?", args: [id] }))
			.rows[0].totp_secret,
	).toBeNull();
	db.close();
});

test("every CMS collection can be opened and saved through its editor", async ({ page }) => {
	test.setTimeout(180_000);
	await login(page, "admin");
	for (const [collection, label] of Object.entries(COLLECTIONS)) {
		await page.goto("/admin/contenido/" + collection);
		await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible();
		await page.locator("main ul > li > button").first().click();
		await page.getByRole("button", { name: "Guardar", exact: true }).click();
		await expect(page.getByRole("status"), collection).toContainText("Cambios guardados");
	}
});

test("editors archive only their uploads and only superadmins can purge", async ({
	page,
	browser,
	request,
}) => {
	await login(page, "editor");
	await page.goto("/admin/medios");
	await page.getByLabel("Archivo", { exact: true }).setInputFiles({
		name: "propio.svg",
		mimeType: "image/svg+xml",
		buffer: Buffer.from('<svg width="10" height="20"><rect width="10" height="20"/></svg>'),
	});
	await page.getByLabel("Texto alternativo", { exact: true }).first().fill("Carga propia");
	await page.getByRole("button", { name: "Subir archivo", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Archivo subido");
	const url = await page
		.getByRole("link", { name: "Abrir archivo", exact: true })
		.getAttribute("href");
	await page.getByRole("button", { name: "Actualizar biblioteca", exact: true }).click();
	const own = page
		.locator("article")
		.filter({ has: page.getByRole("heading", { name: "propio.svg" }) });
	await expect(own.getByRole("button", { name: "Guardar", exact: true })).toHaveCount(0);
	page.on("dialog", (dialog) => dialog.accept());
	await own.getByRole("button", { name: "Archivar", exact: true }).click();
	await expect(page.getByRole("status").filter({ hasText: "Medio actualizado" })).toBeVisible();
	await page.getByLabel("Ver archivados", { exact: true }).check();
	await expect(
		own.getByRole("button", { name: "Eliminar definitivamente", exact: true }),
	).toHaveCount(0);
	const context = await browser.newContext(),
		admin = await context.newPage();
	await login(admin, "superadmin");
	await admin.goto("/admin/medios");
	await admin.getByLabel("Ver archivados", { exact: true }).check();
	admin.on("dialog", (dialog) => dialog.accept());
	const archived = admin
		.locator("article")
		.filter({ has: admin.getByRole("heading", { name: "propio.svg" }) });
	await archived.getByRole("button", { name: "Eliminar definitivamente", exact: true }).click();
	await expect(archived).toHaveCount(0);
	expect((await request.get(url!)).status()).toBe(404);
	await context.close();
});

test("suspension and password reset revoke existing sessions", async ({ page, browser }) => {
	const db = test_database(),
		id = crypto.randomUUID();
	await db.execute({
		sql: "INSERT INTO admin_user (id,email,name,role,password_hash,must_change_password,created_at,updated_at) VALUES (?,'revocar@example.org','Revocable','editor',?,0,1,1)",
		args: [id, await hash_password(TEST_PASSWORD, JSON.parse(TEST_KEYS))],
	});
	db.close();
	const other_context = await browser.newContext(),
		other = await other_context.newPage();
	await login(other, "revocar@example.org");
	await login(page, "superadmin");
	await page.goto("/admin/cuentas");
	page.on("dialog", (dialog) => dialog.accept());
	const account = page
		.locator("li")
		.filter({ has: page.getByRole("heading", { name: "Revocable · revocar@example.org" }) });
	await account.getByRole("button", { name: "Suspender", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cuenta actualizada");
	await other.goto("/admin");
	await expect(other).toHaveURL(/iniciar-sesion/);
	await account.getByRole("button", { name: "Reactivar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cuenta actualizada");
	await login(other, "revocar@example.org");
	await account.getByRole("button", { name: "Restablecer contraseña", exact: true }).click();
	const password = await page.locator("code").textContent();
	await other.goto("/admin");
	await expect(other).toHaveURL(/iniciar-sesion/);
	await login(other, "revocar@example.org", password!);
	await expect(other).toHaveURL(/cambiar-contrasena/);
	await other_context.close();
});

test("media upload, reference selection, range delivery and reference warnings", async ({
	page,
	request,
}) => {
	await login(page, "admin");
	await page.goto("/admin/medios");
	await page.getByLabel("Archivo", { exact: true }).setInputFiles({
		name: "editorial.svg",
		mimeType: "image/svg+xml",
		buffer: Buffer.from('<svg width="10" height="20"><rect width="10" height="20"/></svg>'),
	});
	await page.getByLabel("Texto alternativo", { exact: true }).first().fill("Imagen editorial");
	await page.getByRole("button", { name: "Subir archivo", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Archivo subido");
	const url = await page
		.getByRole("link", { name: "Abrir archivo", exact: true })
		.getAttribute("href");
	expect((await request.get(url!)).status()).toBe(200);
	expect((await request.get(url!, { headers: { Range: "bytes=0-4" } })).status()).toBe(206);
	await page.goto("/admin/contenido/home_content");
	await page.getByRole("button", { name: "1", exact: true }).click();
	await page
		.getByLabel("portada · medio · identificador")
		.selectOption({ label: "editorial.svg · Imagen editorial" });
	await page.getByRole("button", { name: "Guardar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("Cambios guardados");
	const html = await (await request.get("/")).text();
	expect(html).toContain(url);
	await page.goto("/admin/medios");
	const asset = page
		.locator("article")
		.filter({ has: page.getByRole("heading", { name: "editorial.svg" }) });
	await expect(asset).toContainText("Inicio");
	page.on("dialog", (dialog) => dialog.accept());
	await asset.getByRole("button", { name: "Archivar", exact: true }).click();
	await expect(page.getByRole("status")).toContainText("se utiliza");
});
