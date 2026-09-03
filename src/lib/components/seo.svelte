<script lang="ts">
	import { page } from "$app/state";
	import { SITE_URL } from "$app/env/public";
	import logo_omec from "#lib/assets/logos/omec.svg?url&no-inline";
	import { SOCIAL_LINKS } from "#lib/constants.js";

	type NewsArticle = {
		headline: string;
		date_published: string;
		date_modified?: string;
	};

	type SeoProps = {
		title: string;
		description?: string;
		type?: string;
		image?: string;
		image_alt?: string;
		canonical_url?: string;
		og_locale?: string;
		twitter_card?: string;
		emit_structured_data?: boolean;
		include_organization?: boolean;
		include_website?: boolean;
		page_type?: "WebPage" | "AboutPage";
		news_article?: NewsArticle;
	};

	const default_seo = {
		// TODO: move to constants.ts
		description:
			"Olimpiada Matemática Ecuatoriana. Impulsamos el talento matemático de estudiantes ecuatorianos con competencias, entrenamiento y participación internacional.",
		type: "website",
		image: "",
		image_alt: "",
		og_locale: "es_EC",
		twitter_card: "summary_large_image",
	} as const;

	let {
		title,
		description = default_seo.description,
		type = default_seo.type,
		image = default_seo.image,
		image_alt = default_seo.image_alt,
		canonical_url,
		og_locale = default_seo.og_locale,
		twitter_card = default_seo.twitter_card,
		emit_structured_data = true,
		include_organization = false,
		include_website = false,
		page_type = "WebPage",
		news_article,
	}: SeoProps = $props();

	let resolved_canonical_url = $derived(
		canonical_url ?? new URL(page.url.pathname, `${SITE_URL}/`).href,
	);
	let resolved_title = $derived(title ? `${title} - OMEC` : "OMEC");
	let resolved_image = $derived(image ? new URL(image, `${SITE_URL}/`).href : "");
	let structured_data = $derived.by(() => {
		const graph: Record<string, unknown>[] = [
			{
				"@type": page_type,
				"@id": `${resolved_canonical_url}#webpage`,
				url: resolved_canonical_url,
				name: resolved_title,
				description,
				inLanguage: "es-EC",
				isPartOf: { "@id": `${SITE_URL}/#website` },
				...(resolved_image ? { primaryImageOfPage: { url: resolved_image } } : {}),
			},
		];

		if (include_organization) {
			graph.unshift({
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: "Olimpiada Matemática Ecuatoriana",
				alternateName: "OMEC",
				url: SITE_URL,
				logo: new URL(logo_omec, `${SITE_URL}/`).href,
				sameAs: SOCIAL_LINKS.map((social_link) => social_link.href),
			});
		}

		if (include_website) {
			graph.unshift({
				"@type": "WebSite",
				"@id": `${SITE_URL}/#website`,
				url: SITE_URL,
				name: "Olimpiada Matemática Ecuatoriana",
				alternateName: "OMEC",
				inLanguage: "es-EC",
				publisher: { "@id": `${SITE_URL}/#organization` },
			});
		}

		if (news_article) {
			graph.push({
				"@type": "NewsArticle",
				"@id": `${resolved_canonical_url}#newsarticle`,
				mainEntityOfPage: { "@id": `${resolved_canonical_url}#webpage` },
				headline: news_article.headline,
				description,
				datePublished: news_article.date_published,
				...(news_article.date_modified ? { dateModified: news_article.date_modified } : {}),
				author: { "@id": `${SITE_URL}/#organization` },
				publisher: { "@id": `${SITE_URL}/#organization` },
			});
		}

		return { "@context": "https://schema.org", "@graph": graph };
	});
	let structured_data_json = $derived(
		emit_structured_data ? JSON.stringify(structured_data).replace(/</g, "\\u003c") : "",
	);
	let name_tags = $derived([
		["description", description],
		["twitter:title", resolved_title],
		["twitter:description", description],
		["twitter:card", twitter_card],
		["twitter:image", resolved_image],
		["twitter:image:alt", image_alt],
	] as const);

	let property_tags = $derived([
		["og:title", resolved_title],
		["og:description", description],
		["og:type", type],
		["og:image", resolved_image],
		["og:image:alt", image_alt],
		["og:url", resolved_canonical_url],
		["og:locale", og_locale],
	] as const);
</script>

<svelte:head>
	<title>{resolved_title}</title>
	<link rel="canonical" href={resolved_canonical_url} />
	{#if structured_data_json}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html '<script type="application/ld+json">' + structured_data_json + "</scr" + "ipt>"}
	{/if}
	{#each name_tags as [name, content] (name)}
		{#if content}
			<meta {name} {content} />
		{/if}
	{/each}
	{#each property_tags as [property, content] (property)}
		{#if content}
			<meta {property} {content} />
		{/if}
	{/each}
</svelte:head>
