# OMEC webpage

This project is a complete rewrite of the official [Olimpiada Matemática Ecuatoriana (OMEC)](https://omec-mat.org/) website. The goal is to replace the existing WordPress site with a modern, type-safe, and highly performant web application built to serve the Ecuadorian mathematical community.

## Tech Stack

- **Framework:** [SvelteKit 2](https://svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev/docs/svelte) (using Runes)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Better-Auth](https://www.better-auth.com/)
- **Database:** local LibSQL/SQLite in development, [Turso](https://turso.tech/) / LibSQL in production
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **UI Components:** [Bits UI](https://www.bits-ui.com/) & [Lucide Svelte](https://lucide.dev/)
- **Validation:** [Valibot](https://valibot.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)

## Coding Standards

To maintain consistency across the codebase, we adhere to the following naming conventions:

- **Variables & Functions:** Always use `snake_case` (e.g., `get_user_data`, `const national_results = []`).
- **Files & Directories:** Always use `kebab-case` (e.g., `auth-handler.ts`, `components/nav-bar.svelte`).
- **Commits:** We follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add student registration form`).

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/)

## Local Development

Local development is zero-secret by default.

- If `DATABASE_URL` is unset, the app and Drizzle use `file:local.db`.
- `DATABASE_AUTH_TOKEN`, `ORIGIN`, and `BETTER_AUTH_SECRET` are not required for `pnpm dev`, `pnpm check`, or `pnpm build`.
- You can start from [`.env.example`](.env.example) as-is and run the app locally without provisioning Turso or auth secrets.

When you do want to point your local app at Turso, set `DATABASE_URL` to the remote `libsql://...` URL and provide `DATABASE_AUTH_TOKEN` as well.

## Scripts

- `pnpm dev`: Starts the Vite development server.
- `pnpm build`: Generates Wrangler types and builds the Cloudflare Worker bundle.
- `pnpm preview`: Runs the built Cloudflare Worker locally on port `4173`.
- `pnpm check`: Runs Wrangler type generation, Svelte sync, and Svelte-Check for type validation.
- `pnpm lint`: Runs Prettier checks and ESLint.
- `pnpm format`: Formats code using Prettier.
- `pnpm db:push`: Synchronizes the Drizzle schema with the local default database (`file:local.db` unless overridden).
- `pnpm db:push:prod`: Synchronizes the schema against a production Turso database and requires real Turso env vars.
- `pnpm db:generate`: Generates Drizzle migrations using the local-safe config.
- `pnpm db:studio`: Opens Drizzle Studio against the local-safe config.

## Deployment

The application is configured to be deployed on **Cloudflare Workers** using `@sveltejs/adapter-cloudflare`, with **Turso** as the production database.

- Store `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `ORIGIN`, and `BETTER_AUTH_SECRET` in Cloudflare Worker secrets/vars.
- Do not add these secrets to GitHub Actions just to make forks or pull request CI pass.
- Production runtime stays strict: remote database URLs require `DATABASE_AUTH_TOKEN`, and auth requires `ORIGIN` plus `BETTER_AUTH_SECRET`.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
