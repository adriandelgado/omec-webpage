import { defineEnvVars } from "@sveltejs/kit/env";
import { building } from "$app/env";
import * as v from "valibot";

export const variables = defineEnvVars({
	AUTH_PASSWORD_PEPPERS: {
		description: "Versioned password peppers: {current, keys}, with 32-byte hex keys.",
		schema: v.optional(v.string()),
	},
	AUTH_TOTP_ENCRYPTION_KEYS: {
		description: "Versioned AES-GCM keys: {current, keys}, with 32-byte hex keys.",
		schema: v.optional(v.string()),
	},
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
	DATABASE_AUTH_TOKEN: {
		description: "The authentication token for a remote Turso/libSQL database.",
		// Local file databases and build-time analysis do not require a token.
		schema: v.optional(v.string()),
	},
	TURNSTILE_SITE_KEY: {
		description: "The public Cloudflare Turnstile site key for contact-form verification.",
		public: true,
		schema: v.optional(v.string(), ""),
	},
	TURNSTILE_SECRET_KEY: {
		description: "The secret Cloudflare Turnstile key used for server-side verification.",
		// Cloudflare provides this Worker secret at runtime, not during the build.
		schema: building ? v.optional(v.string()) : v.pipe(v.string(), v.nonEmpty()),
	},
});
