import { format_content_date } from "#lib/content-dates.js";
import { query } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { asc, desc, eq, and, isNull } from "drizzle-orm";
import { renderHtml } from "@tanstack/markdown";
import * as v from "valibot";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
export const get_articles = query(async () => {
	const articles = await db
		.select({
			slug: schema.news_article.slug,
			category: schema.news_article.category,
			date_label: schema.news_article.date_label,
			date_published: schema.news_article.published_on,
			author: schema.news_article.author,
			title: schema.news_article.title,
			summary: schema.news_article.summary,
			link_label: schema.news_article.link_label,
		})
		.from(schema.news_article)
		.where(
			and(isNull(schema.news_article.archived_at), eq(schema.news_article.status, "published")),
		)
		.orderBy(desc(schema.news_article.published_on), asc(schema.news_article.sort_order));
	return articles.map(({ date_label, ...article }) => ({
		...article,
		date_published: article.date_published!,
		date: date_label ?? format_content_date(article.date_published!),
	}));
});
export const get_article = query(v.string(), async (slug) => {
	const [article] = await db
		.select({
			slug: schema.news_article.slug,
			category: schema.news_article.category,
			date_label: schema.news_article.date_label,
			date_published: schema.news_article.published_on,
			author: schema.news_article.author,
			title: schema.news_article.title,
			summary: schema.news_article.summary,
			link_label: schema.news_article.link_label,
			body_markdown: schema.news_article.body_markdown,
		})
		.from(schema.news_article)
		.where(
			and(
				eq(schema.news_article.slug, slug),
				isNull(schema.news_article.archived_at),
				eq(schema.news_article.status, "published"),
			),
		)
		.limit(1);
	if (!article) {
		const [previous] = await db
			.select({ slug: schema.news_article.slug })
			.from(schema.news_slug_redirect)
			.innerJoin(
				schema.news_article,
				eq(schema.news_slug_redirect.article_slug, schema.news_article.slug),
			)
			.where(
				and(
					eq(schema.news_slug_redirect.old_slug, slug),
					eq(schema.news_article.status, "published"),
					isNull(schema.news_article.archived_at),
				),
			)
			.limit(1);
		if (previous) redirect(301, "/noticias/" + previous.slug);
		error(404, "La noticia solicitada no existe.");
	}
	const { body_markdown, date_label, ...metadata } = article;
	return {
		...metadata,
		date_published: metadata.date_published!,
		date: date_label ?? format_content_date(metadata.date_published!),
		body_html: renderHtml(body_markdown, { allowHtml: false }),
	};
});
