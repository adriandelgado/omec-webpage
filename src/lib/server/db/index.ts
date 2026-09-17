import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "$app/env/private";
import { building } from "$app/env";

if (!building && !DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const client = createClient({
	url: DATABASE_URL || "file::memory:",
	authToken: DATABASE_AUTH_TOKEN || undefined,
});

export const db = drizzle(client, { schema });
