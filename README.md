# OMEC webpage

This project is a complete rewrite of the official [Olimpiada Matemática Ecuatoriana (OMEC)](https://omec-mat.org/) website. The goal is to replace the existing WordPress site with a modern, type-safe, and highly performant web application built to serve the Ecuadorian mathematical community.

## Tech Stack

- **Framework:** [SvelteKit 5](https://svelte.dev/) (using Runes)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Better-Auth](https://www.better-auth.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **UI Components:** [Bits UI](https://www.bits-ui.com/) & [Lucide Svelte](https://lucide.dev/)
- **Validation:** [Valibot](https://valibot.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)

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
- `pnpm build`: Builds the application for production using `@sveltejs/adapter-node`.
- `pnpm check`: Runs Svelte-Check for type validation.
- `pnpm format`: Formats code using Prettier.
- `pnpm db:push`: Synchronizes the Drizzle schema with the database.
- `pnpm db:studio`: Opens a GUI to explore your local database.

## Deployment

The application is configured to be hosted on a **VPS** using the Node.js adapter. Ensure your server environment has the variables defined in `.env.example` set up before running the production build.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
