<script lang="ts">
	import { resolve } from "$app/paths";
	import { Info, Lightbulb, Newspaper } from "@lucide/svelte";
	import blocks from "#lib/assets/shared/blocks.svg";
	import sine from "#lib/assets/shared/sine.svg";
	import triangle_center_gravity from "#lib/assets/home/triangle-center-gravity.svg";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";
	import { SOCIAL_LINKS } from "#lib/constants.js";
	import { get_content } from "./content.remote";

	const INFORMATION_ICONS = { info: Info, lightbulb: Lightbulb, newspaper: Newspaper } as const;
	const content = await get_content();
</script>

<Seo
	title={content.seo.title}
	description={content.seo.description}
	include_organization
	include_website
/>

<PageSectionStack class="py-12 lg:py-20">
	<ContentSection container_class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
		<div class="max-w-100">
			<h1 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
				{content.hero.title}
				<span class="text-primary">{content.hero.highlight}</span>
			</h1>
		</div>

		<figure
			class="overflow-hidden rounded-md border border-primary bg-white p-2 shadow-[4px_4px_0_0_var(--color-primary)] lg:p-3"
		>
			<enhanced:img
				src={content.hero.image}
				alt={content.hero.image_alt}
				fetchpriority="high"
				sizes="(min-width: 1024px) 60vw, 100vw"
				class="aspect-[2.7/1] w-full object-cover"
			/>
		</figure>
	</ContentSection>

	<ContentSection>
		<SectionHeading title={content.national_olympiad.title} />

		<div class="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
			<div
				class="relative overflow-hidden rounded-md bg-primary px-5 py-5 text-white shadow-[4px_4px_0_0_var(--color-primary-dark)] lg:px-7 lg:py-6"
			>
				<img
					src={sine}
					alt=""
					class="pointer-events-none absolute top-1/2 right-5 w-36 -translate-y-1/2 opacity-25 lg:w-52"
				/>
				<div class="relative">
					<p class="max-w-130 text-lg leading-tight font-semibold lg:text-xl">
						{content.national_olympiad.announcement}
					</p>
					<a
						href={resolve(content.national_olympiad.link_href)}
						class="mt-5 inline-flex h-9 items-center justify-center rounded-sm bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						{content.national_olympiad.link_label}
					</a>
				</div>
			</div>

			<dl
				class="divide-y divide-primary/20 rounded-md border border-primary bg-white px-5 py-1 text-sm shadow-[4px_4px_0_0_var(--color-primary)]"
			>
				{#each content.national_olympiad.stages as stage (stage.label)}
					<div class="flex items-center justify-between gap-4 py-3">
						<dt class="font-medium text-primary">{stage.label}</dt>
						<dd class="text-right text-copy/75">{stage.date}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			{#each content.national_olympiad.information_items as item (item.id)}
				{@const Icon = INFORMATION_ICONS[item.icon]}
				<a
					href={resolve(item.href)}
					class="flex items-center gap-3 rounded-md border border-primary/30 bg-white px-4 py-3 transition-colors hover:bg-primary/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					<Icon aria-hidden="true" class="size-10 text-primary" strokeWidth={1.8} />
					<p class="text-sm font-medium text-primary">{item.title}</p>
				</a>
			{/each}
		</div>
	</ContentSection>

	<ContentSection container_class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
		<div>
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.about.eyebrow}
			</p>
			<h2 class="mt-3 max-w-150 text-3xl leading-none font-semibold tracking-tighter lg:text-5xl">
				{content.about.title}
			</h2>

			<p class="mt-6 max-w-150 text-sm leading-6 text-copy/75">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html content.about.description_html}
			</p>

			<a
				href={resolve(content.about.link_href)}
				class="mt-6 inline-flex h-9 items-center justify-center rounded-sm border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				{content.about.link_label}
			</a>
		</div>

		<figure
			class="overflow-hidden rounded-md border border-primary bg-white p-2 shadow-[4px_4px_0_0_var(--color-primary)] lg:p-3"
		>
			<enhanced:img
				src={content.about.image}
				alt={content.about.image_alt}
				loading="lazy"
				decoding="async"
				sizes="(min-width: 1024px) 36vw, 100vw"
				class="aspect-4/5 w-full object-cover object-center"
			/>
		</figure>
	</ContentSection>

	<ContentSection>
		<SectionHeading title={content.sponsor.title} />

		<div
			class="mt-8 flex justify-center rounded-md border border-primary/30 bg-white px-6 py-8 shadow-[4px_4px_0_0_var(--color-primary)]"
		>
			<img
				src={content.sponsor.image}
				alt={content.sponsor.image_alt}
				loading="lazy"
				decoding="async"
				class="h-auto w-full max-w-70 object-contain"
			/>
		</div>
	</ContentSection>

	<ContentSection>
		<div class="grid overflow-hidden rounded-md border border-primary lg:grid-cols-2">
			{#each content.olympiad_cards as card (card.id)}
				<article class="bg-primary px-6 py-8 text-white even:bg-primary-dark lg:px-10 lg:py-12">
					<h2 class="max-w-105 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
						{card.title}
					</h2>
					<p class="mt-5 max-w-130 text-sm leading-6 text-white/80">{card.description}</p>
					<a
						href={resolve(card.href)}
						class="mt-6 inline-flex h-9 items-center justify-center rounded-sm bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						{card.link_label}
					</a>
				</article>
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<div class="relative overflow-hidden rounded-md border border-primary bg-primary">
			<enhanced:img
				src={content.national_facts.image}
				alt={content.national_facts.image_alt}
				loading="lazy"
				decoding="async"
				sizes="100vw"
				class="absolute inset-0 size-full object-cover opacity-25"
			/>
			<div class="relative px-6 py-10 text-white lg:px-10 lg:py-14">
				<h2 class="max-w-180 text-3xl leading-none font-semibold tracking-tighter lg:text-5xl">
					{content.national_facts.title}
				</h2>
				<div class="mt-8 grid gap-4 md:grid-cols-3">
					{#each content.national_facts.facts as fact (fact)}
						<p class="border-l border-white/50 pl-4 text-sm leading-6 font-medium">{fact}</p>
					{/each}
				</div>
			</div>
		</div>
	</ContentSection>

	<ContentSection
		container_class="relative overflow-hidden rounded-md border border-primary bg-white px-6 py-8 shadow-[4px_4px_0_0_var(--color-primary)] lg:px-10 lg:py-12"
	>
		<img
			src={blocks}
			alt=""
			class="pointer-events-none absolute right-6 bottom-0 hidden w-36 translate-y-1/4 opacity-35 lg:block"
		/>
		<img
			src={triangle_center_gravity}
			alt=""
			class="pointer-events-none absolute top-5 right-8 w-16 opacity-40 lg:right-14 lg:w-22"
		/>
		<div class="relative max-w-155">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.follow.eyebrow}
			</p>
			<h2 class="mt-3 text-3xl leading-none font-semibold tracking-tighter lg:text-5xl">
				{content.follow.title}
			</h2>
			<nav class="mt-6 flex flex-wrap gap-3" aria-label="Redes sociales de OMEC">
				{#each SOCIAL_LINKS as social_link (social_link.id)}
					<a
						href={social_link.href}
						target="_blank"
						rel="noreferrer"
						class="inline-flex h-9 items-center justify-center rounded-sm border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						{social_link.label}
					</a>
				{/each}
			</nav>
		</div>
	</ContentSection>
</PageSectionStack>
