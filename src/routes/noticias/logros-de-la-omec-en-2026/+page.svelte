<script lang="ts">
	import { resolve } from "$app/paths";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { get_articles } from "../articles.remote";
	import { get_content } from "./content.remote";

	const [content, articles] = await Promise.all([get_content(), get_articles()]);
	const article = articles[0];
</script>

<Seo
	title={article.title}
	description={article.summary}
	news_article={{ headline: article.title, date_published: article.date_published }}
/>

<PageSectionStack class="py-12 lg:py-20">
	<ContentSection>
		<a
			href={resolve(content.back_link.href)}
			class="text-sm font-semibold text-primary hover:underline">{content.back_link.label}</a
		>
		<p class="mt-8 text-sm font-semibold tracking-widest text-primary uppercase">
			{content.category}
		</p>
		<h1 class="mt-3 max-w-4xl text-4xl leading-none font-semibold tracking-tighter lg:text-6xl">
			{article.title}
		</h1>
		<p class="mt-5 text-sm font-semibold text-copy/65">{article.date} · {article.author}</p>
	</ContentSection>

	<ContentSection>
		<!-- This source-controlled HTML is trusted. Future CMS content must be sanitized before it is returned. -->
		<article class="max-w-[70ch] text-base leading-8 text-copy/80">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html content.body_html}
		</article>
	</ContentSection>
</PageSectionStack>
