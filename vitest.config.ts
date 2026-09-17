import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
	resolve: { alias: { "$app/env": fileURLToPath(new URL("./tests/env.ts", import.meta.url)) } },
	test: {
		environment: "node",
		include: ["src/**/*.{test,spec}.ts"],
		expect: { requireAssertions: true },
	},
});
