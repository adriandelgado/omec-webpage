# OMEC webpage

This project is a complete rewrite of the official [Olimpiada Matemática Ecuatoriana (OMEC)](https://omec-mat.org/) website. It is a type-safe SvelteKit application for sharing OMEC's competitions, training materials, news, and contact information with the Ecuadorian mathematical community.

## Tech Stack

- **Framework:** [SvelteKit 3](https://next.svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev/docs/svelte) using Runes
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** SQLite/libSQL through [LibSQL Client](https://github.com/tursodatabase/libsql-client-ts), configured with `DATABASE_URL`
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **UI Components:** [Bits UI](https://www.bits-ui.com/) & [Lucide Svelte](https://lucide.dev/)
- **Validation:** [Valibot](https://valibot.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/) with enhanced image processing
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/) via `@sveltejs/adapter-cloudflare`

## Coding Standards

To maintain consistency across the codebase, we adhere to the following naming conventions:

- **Variables & Functions:** Always use `snake_case` (e.g., `get_user_data`, `const national_results = []`).
- **Files & Directories:** Always use `kebab-case` (e.g., `auth-handler.ts`, `components/nav-bar.svelte`).

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [pnpm](https://pnpm.io/) 11 or higher

## Local Development

Install dependencies and create a local environment file:

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`DATABASE_URL` is required by both the application and Drizzle. Use `file:local.db` for a local SQLite database, or set it to the URL of a remote libSQL/Turso database. The current application and Drizzle configuration read `DATABASE_URL`; they do not configure a separate database authentication token.

## Scripts

- `pnpm dev`: Starts the Vite development server.
- `pnpm build`: Builds the Cloudflare Worker bundle.
- `pnpm preview`: Runs the built Cloudflare Worker locally on port `4173`.
- `pnpm check`: Synchronizes SvelteKit and runs Svelte-Check for type validation.
- `pnpm lint`: Runs Prettier checks and ESLint.
- `pnpm format`: Formats code using Prettier.
- `pnpm test`: Runs the unit test suite once.
- `pnpm test:unit`: Starts Vitest in watch mode.
- `pnpm gen`: Generates Cloudflare Worker types with Wrangler.
- `pnpm db:push`: Pushes the Drizzle schema to the database in `DATABASE_URL`.
- `pnpm db:generate`: Generates Drizzle migrations from the schema.
- `pnpm db:migrate`: Applies pending Drizzle migrations.
- `pnpm db:studio`: Opens Drizzle Studio for the database in `DATABASE_URL`.

## Deployment

The application is configured to be deployed on **Cloudflare Workers** using `@sveltejs/adapter-cloudflare`. Configure `DATABASE_URL` as a Worker runtime variable or secret to point to the deployment's SQLite/libSQL database, including a remote [Turso](https://turso.tech/) database when applicable. It does not need to be present in Cloudflare's build environment; the app validates it when the Worker starts handling requests.

- Set `DATABASE_URL` in the Cloudflare Worker environment before deploying or starting the application.
- Run `pnpm gen` when the Cloudflare Worker type definitions need to be refreshed.
- Run `pnpm build` to produce the Worker bundle consumed by `pnpm preview` and Wrangler.
- Keep environment files and database credentials out of version control.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
