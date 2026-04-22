import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { building, dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import * as schema from "./schema";
import { resolve_database_config } from "./config";

const database_config = resolve_database_config({
	database_auth_token: env.DATABASE_AUTH_TOKEN,
	database_url: env.DATABASE_URL,
	allow_local_default: building || dev,
	context: building
		? "Build-time database configuration"
		: dev
			? "Development database configuration"
			: "Production database configuration",
});

const client = createClient(
	database_config.auth_token
		? { url: database_config.url, authToken: database_config.auth_token }
		: { url: database_config.url },
);

export const db = drizzle(client, { schema });
