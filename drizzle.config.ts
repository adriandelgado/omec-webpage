import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		authToken: process.env.DATABASE_AUTH_TOKEN || "",
		url: process.env.DATABASE_URL || "",
	},
	verbose: true,
	strict: true,
});
