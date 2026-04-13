<script lang="ts">
	import { page } from "$app/state";

	type SeoProps = {
		title: string;
		description?: string;
		type?: string;
		image?: string;
		image_alt?: string;
		canonical_url?: string;
		og_locale?: string;
		twitter_card?: string;
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
	}: SeoProps = $props();

	let resolved_canonical_url = $derived(canonical_url ?? `${page.url.origin}${page.url.pathname}`);
	let resolved_title = $derived(title ? `${title} - OMEC` : "OMEC");
	let name_tags = $derived([
		["description", description],
		["twitter:title", resolved_title],
		["twitter:description", description],
		["twitter:card", twitter_card],
		["twitter:image", image],
		["twitter:image:alt", image_alt],
	] as const);

	let property_tags = $derived([
		["og:title", resolved_title],
		["og:description", description],
		["og:type", type],
		["og:image", image],
		["og:image:alt", image_alt],
		["og:url", resolved_canonical_url],
		["og:locale", og_locale],
	] as const);
</script>

<svelte:head>
	<title>{resolved_title}</title>
	<link rel="canonical" href={resolved_canonical_url} />
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
