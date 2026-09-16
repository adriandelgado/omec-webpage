import { defineConfig } from "drizzle-kit";
import { loadEnv } from "vite";

const environment = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
const database_url = environment.DATABASE_URL;
const database_auth_token = environment.DATABASE_AUTH_TOKEN;

if (!database_url) throw new Error("DATABASE_URL is not set");

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	out: "./drizzle",
	dialect: "turso",
	dbCredentials: {
		url: database_url,
		authToken: database_auth_token || undefined,
	},
	verbose: true,
	strict: true,
});
