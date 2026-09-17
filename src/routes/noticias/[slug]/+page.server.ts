import { error, redirect } from "@sveltejs/kit";
import { client } from "#lib/server/db/index.js";
import { select_one } from "#lib/server/cms/transactions.js";
import type { PageServerLoad } from "./$types";

// Resolve HTTP status before Svelte begins streaming the article component.
export const load: PageServerLoad = async ({ params }) => {
	const article = await select_one(
		client,
		"SELECT slug FROM news_article WHERE slug = ? AND status = 'published' AND archived_at IS NULL",
		[params.slug],
	);
	if (article) return {};
	const previous = await select_one(
		client,
		"SELECT a.slug FROM news_slug_redirect r JOIN news_article a ON a.slug = r.article_slug WHERE r.old_slug = ? AND a.status = 'published' AND a.archived_at IS NULL",
		[params.slug],
	);
	if (previous) redirect(301, "/noticias/" + previous.slug);
	error(404, "La noticia solicitada no existe.");
};
