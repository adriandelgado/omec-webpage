import { createClient } from "@libsql/client";
import { spawn } from "node:child_process";
import { apply_migrations, seed_content, seed_accounts, TEST_KEYS } from "../tests/fixtures";

const url = process.env.OMEC_E2E_DATABASE_URL;
if (!url || !url.includes("/omec-e2e-"))
	throw new Error("Se requiere una base de datos de prueba aislada.");
const client = createClient({ url });
await apply_migrations(client);
await seed_content(client);
await seed_accounts(client);
client.close();
const child = spawn("pnpm", ["dev", "--host", "127.0.0.1", "--port", "4174", "--strictPort"], {
	stdio: "inherit",
	env: {
		...process.env,
		DATABASE_URL: url,
		DATABASE_AUTH_TOKEN: "",
		AUTH_PASSWORD_PEPPERS: TEST_KEYS,
		AUTH_TOTP_ENCRYPTION_KEYS: TEST_KEYS,
	},
});
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
child.on("exit", (code) => process.exit(code ?? 1));
