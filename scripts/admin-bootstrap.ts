import { createClient } from "@libsql/client";
import { loadEnv } from "vite";
import { hash_password, parse_keyring } from "../src/lib/server/auth/crypto";
import { audit, transaction } from "../src/lib/server/cms/transactions";

const environment = { ...loadEnv("development", process.cwd(), ""), ...process.env };
const client = createClient({
	url: environment.DATABASE_URL!,
	authToken: environment.DATABASE_AUTH_TOKEN || undefined,
});
try {
	await transaction(client, async (tx) => {
		const existing = await tx.execute(
			"SELECT id FROM admin_user WHERE role = 'superadmin' LIMIT 1",
		);
		if (existing.rows.length) {
			console.log("Ya existe un superadministrador. No se creó otra cuenta.");
			return;
		}
		const email = environment.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
		const name = environment.ADMIN_BOOTSTRAP_NAME?.trim();
		const password = environment.ADMIN_BOOTSTRAP_PASSWORD;
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name || !password)
			throw new Error(
				"Configura ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_NAME y ADMIN_BOOTSTRAP_PASSWORD.",
			);
		const hash = await hash_password(password, parse_keyring(environment.AUTH_PASSWORD_PEPPERS));
		const id = crypto.randomUUID(),
			now = Date.now();
		await tx.execute({
			sql: "INSERT INTO admin_user (id, email, name, role, password_hash, must_change_password, created_at, updated_at) VALUES (?, ?, ?, 'superadmin', ?, 1, ?, ?)",
			args: [id, email, name, hash, now, now],
		});
		await audit(tx, null, "bootstrap", "admin_user", id, null, { email, name, role: "superadmin" });
		console.log("Superadministrador creado. Debe cambiar la contraseña al iniciar sesión.");
	});
} finally {
	client.close();
}
