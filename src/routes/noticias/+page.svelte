<script lang="ts">
	import { resolve } from "$app/paths";
	import Card from "#lib/components/card.svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { get_articles } from "./articles.remote";
	import { get_content } from "./content.remote";

	const [content, articles] = await Promise.all([get_content(), get_articles()]);
</script>

<Seo title={content.seo.title} description={content.seo.description} />

<PageSectionStack class="py-12 lg:py-20">
	<ContentSection>
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">
			{content.intro.eyebrow}
		</p>
		<h1 class="mt-3 text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
			{content.intro.title}
		</h1>
		<p class="mt-5 max-w-150 text-sm leading-6 text-copy/75">
			{content.intro.description}
		</p>
	</ContentSection>

	<ContentSection>
		{#each articles as article (article.slug)}
			<Card class="max-w-3xl">
				<a
					href={resolve("/noticias/[slug]", { slug: article.slug })}
					class="block p-6 transition-colors hover:bg-foreground/45 lg:p-8"
				>
					<p class="text-sm font-semibold text-primary">{article.date} · {article.author}</p>
					<h2 class="mt-3 text-2xl font-semibold tracking-tight text-copy lg:text-3xl">
						{article.title}
					</h2>
					<p class="mt-4 max-w-2xl text-sm leading-6 text-copy/75">{article.summary}</p>
					<span class="mt-6 inline-flex text-sm font-semibold text-primary"
						>{article.link_label}</span
					>
				</a>
			</Card>
		{/each}
	</ContentSection>
</PageSectionStack>
