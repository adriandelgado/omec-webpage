import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { building, dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { db } from "$lib/server/db";

const base_url = (() => {
	const configured_origin = env.ORIGIN?.trim();

	if (configured_origin) {
		return configured_origin;
	}

	if (building || dev) {
		return "http://localhost:5173";
	}

	throw new Error("Production auth configuration: ORIGIN is required outside of build/dev.");
})();

const auth_secret = (() => {
	const configured_secret = env.BETTER_AUTH_SECRET?.trim();

	if (configured_secret) {
		return configured_secret;
	}

	if (building || dev) {
		return "development-only-better-auth-secret";
	}

	throw new Error(
		"Production auth configuration: BETTER_AUTH_SECRET is required outside of build/dev.",
	);
})();

export const auth = betterAuth({
	baseURL: base_url,
	secret: auth_secret,
	database: drizzleAdapter(db, { provider: "sqlite" }),
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
	],
});
