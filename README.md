# OMEC webpage

This project is a complete rewrite of the official [Olimpiada Matemática Ecuatoriana (OMEC)](https://omec-mat.org/) website. The goal is to replace the existing WordPress site with a modern, type-safe, and highly performant web application built to serve the Ecuadorian mathematical community.

## Tech Stack

- **Framework:** [SvelteKit 2](https://svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev/docs/svelte) (using Runes)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Better-Auth](https://www.better-auth.com/)
- **Database:** [Turso](https://turso.tech/) / LibSQL
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
- [Docker](https://www.docker.com/) (for local database)
- [pnpm](https://pnpm.io/)

## Scripts

- `pnpm dev`: Starts the Vite development server.
- `pnpm build`: Generates Wrangler types and builds the Cloudflare Worker bundle.
- `pnpm preview`: Runs the built Cloudflare Worker locally on port `4173`.
- `pnpm check`: Runs Wrangler type generation, Svelte sync, and Svelte-Check for type validation.
- `pnpm lint`: Runs Prettier checks and ESLint.
- `pnpm format`: Formats code using Prettier.
- `pnpm db:push`: Synchronizes the Drizzle schema with the database.
- `pnpm db:generate`: Generates Drizzle migrations.
- `pnpm db:studio`: Opens a GUI to explore your local database.

## Deployment

The application is configured to be deployed on **Cloudflare Workers** using `@sveltejs/adapter-cloudflare`, with **Turso** as the backing database. Ensure the required environment variables for your Turso and auth configuration are available before running the production build or database commands.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
