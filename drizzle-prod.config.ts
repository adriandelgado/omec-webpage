import { defineConfig } from "drizzle-kit";
import { resolve_database_config } from "./src/lib/server/db/config";

const database_config = resolve_database_config({
	database_auth_token: process.env.DATABASE_AUTH_TOKEN,
	database_url: process.env.DATABASE_URL,
	allow_local_default: false,
	context: "Drizzle production configuration",
	require_remote: true,
});

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		authToken: database_config.auth_token,
		url: database_config.url,
	},
	verbose: true,
	strict: true,
});
