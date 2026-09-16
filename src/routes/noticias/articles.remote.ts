import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { asc, desc, eq } from "drizzle-orm";
import { renderHtml } from "@tanstack/markdown";
import * as v from "valibot";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
export const get_articles = query(async () => {
	return db
		.select({
			slug: schema.news_article.slug,
			category: schema.news_article.category,
			date: schema.news_article.date,
			date_published: schema.news_article.date_published,
			author: schema.news_article.author,
			title: schema.news_article.title,
			summary: schema.news_article.summary,
			link_label: schema.news_article.link_label,
		})
		.from(schema.news_article)
		.orderBy(desc(schema.news_article.date_published), asc(schema.news_article.sort_order));
});
export const get_article = query(v.string(), async (slug) => {
	const [article] = await db
		.select({
			slug: schema.news_article.slug,
			category: schema.news_article.category,
			date: schema.news_article.date,
			date_published: schema.news_article.date_published,
			author: schema.news_article.author,
			title: schema.news_article.title,
			summary: schema.news_article.summary,
			link_label: schema.news_article.link_label,
			body_markdown: schema.news_article.body_markdown,
		})
		.from(schema.news_article)
		.where(eq(schema.news_article.slug, slug))
		.limit(1);
	if (!article) error(404, "La noticia solicitada no existe.");
	const { body_markdown, ...metadata } = article;
	return { ...metadata, body_html: renderHtml(body_markdown, { allowHtml: false }) };
});
