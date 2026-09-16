import { error } from "@sveltejs/kit";
import { query } from "$app/server";
import { content_repository } from "#lib/server/content-repository-instance.js";
import * as v from "valibot";

export const get_articles = query(() => content_repository.get_articles());

export const get_article = query(v.string(), async (slug) => {
	const article = await content_repository.get_article(slug);
	if (!article) error(404, "La noticia solicitada no existe.");
	return article;
});
