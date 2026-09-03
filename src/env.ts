import { defineEnvVars } from "@sveltejs/kit/env";
import { building } from "$app/env";
import * as v from "valibot";

export const variables = defineEnvVars({
	SITE_URL: {
		description: "The canonical public URL for the website.",
		public: true,
		static: true,
		schema: v.pipe(
			v.optional(v.string(), "https://omec-mat.org"),
			v.url(),
			v.transform((site_url) => site_url.replace(/\/$/, "")),
		),
	},
	DATABASE_URL: {
		description: "The database connection string.",
		// Cloudflare provides this Worker variable at runtime, not during the build.
		schema: building ? v.optional(v.string()) : v.string(),
	},
});
