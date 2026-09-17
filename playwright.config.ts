import { defineConfig } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
process.env.OMEC_E2E_DATABASE_URL ??=
	"file:" + join(mkdtempSync(join(tmpdir(), "omec-e2e-")), "test.db");
export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: false,
	workers: 1,
	timeout: 45_000,
	use: { baseURL: "http://127.0.0.1:4174", trace: "retain-on-failure" },
	webServer: {
		command: "pnpm exec tsx scripts/e2e-server.ts",
		url: "http://127.0.0.1:4174/admin/iniciar-sesion",
		reuseExistingServer: false,
		timeout: 120_000,
	},
});
