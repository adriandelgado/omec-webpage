import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		typescript: {
			config: (config) => ({
				...config,
				include: [...config.include, "../drizzle.config.ts", "../drizzle-prod.config.ts"],
			}),
		},
		experimental: {
			remoteFunctions: true,
			forkPreloads: true,
			handleRenderingErrors: true,
		},
	},

	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
		experimental: {
			async: true,
		},
	},
};

export default config;
