import { defineEnvVars } from "@sveltejs/kit/env";
import { building } from "$app/env";
import * as v from "valibot";

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: "The database connection string.",
		// Cloudflare provides this Worker variable at runtime, not during the build.
		schema: building ? v.optional(v.string()) : v.string(),
	},
});
