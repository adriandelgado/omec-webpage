<script lang="ts">
	import { BookOpen, CirclePlay, ExternalLink } from "@lucide/svelte";
	import Card from "#lib/components/card.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { get_national_olympiad, get_site_content } from "#lib/content.remote.js";
	import { get_content } from "./content.remote";

	const [content, national_olympiad, site_content] = await Promise.all([
		get_content(),
		get_national_olympiad(),
		get_site_content(),
	]);
</script>

<Seo title={content.seo.title} description={content.seo.description} />

<PageSectionStack>
	<section
		class="rounded-2xl border border-primary bg-primary px-5 py-6 text-center text-white shadow-[4px_4px_0_0_var(--color-primary-dark)] lg:px-10 lg:py-8"
	>
		<p class="text-lg leading-7 font-semibold lg:text-xl">
			{national_olympiad.announcement}
		</p>
		<ul class="mt-5 grid gap-3 text-sm font-medium sm:grid-cols-3 sm:gap-4">
			{#each national_olympiad.stages as stage (stage.label)}
				<li class="rounded-md bg-white/12 px-3 py-3">{stage.label}: {stage.date}</li>
			{/each}
		</ul>
	</section>

	<section class="grid gap-5 lg:grid-cols-2">
		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.information.eyebrow}
			</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				{content.information.title}
			</h2>
			<p class="mt-4 text-sm leading-6 text-copy/75">
				{content.information.description}
			</p>

			<h3 class="mt-7 text-lg leading-tight font-semibold text-primary">
				{content.information.registration_title}
			</h3>
			<p class="mt-3 text-sm leading-6 text-copy/75">
				{content.information.registration_description}
			</p>
		</Card>

		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.follow.eyebrow}
			</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				{content.follow.title}
			</h2>
			<p class="mt-4 text-sm leading-6 text-copy/75">
				{content.follow.description}
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				{#each site_content.social_links as destination (destination.id)}
					<a
						href={destination.href}
						target="_blank"
						rel="noopener noreferrer"
						class="rounded-sm border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						{destination.label}
					</a>
				{/each}
			</div>
		</Card>
	</section>

	<section>
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">
			{content.levels.eyebrow}
		</p>
		<h2 class="mt-3 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
			{content.levels.title}
		</h2>
		<p class="mt-4 max-w-150 text-sm leading-6 text-copy/75">
			{content.levels.description}
		</p>

		<div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each content.levels.items as level (level.id)}
				<article class="rounded-md border border-primary/30 bg-white px-5 py-4">
					<h3 class="text-lg leading-none font-semibold tracking-tighter text-primary">
						{level.name}
					</h3>
					<p class="mt-3 text-sm leading-5 text-copy/75">{level.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.preparation.eyebrow}
			</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				{content.preparation.title}
			</h2>
			<p class="mt-4 max-w-125 text-sm leading-6 text-copy/75">
				{content.preparation.description}
			</p>
			<a
				href={content.preparation.href}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-6 inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<BookOpen aria-hidden="true" class="size-4" strokeWidth={2} />
				{content.preparation.link_label}
				<ExternalLink aria-hidden="true" class="size-4" strokeWidth={2} />
			</a>
		</Card>

		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.prizes.eyebrow}
			</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				{content.prizes.title}
			</h2>
			{#each content.prizes.paragraphs as paragraph (paragraph)}
				<p class="mt-4 text-sm leading-6 text-copy/75">{paragraph}</p>
			{/each}
		</Card>
	</section>

	<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
		<div>
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.awards.eyebrow}
			</p>
			<enhanced:img
				src={content.awards.image}
				alt={content.awards.image_alt}
				loading="lazy"
				decoding="async"
				sizes="(min-width: 1024px) 60vw, 100vw"
				class="mt-5 aspect-4/3 w-full rounded-2xl object-cover"
			/>
		</div>

		<a
			href={content.video.href}
			target="_blank"
			rel="noopener noreferrer"
			class="group relative block overflow-hidden rounded-2xl border border-primary bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			<enhanced:img
				src={content.video.image}
				alt={content.video.image_alt}
				loading="lazy"
				decoding="async"
				sizes="(min-width: 1024px) 40vw, 100vw"
				class="aspect-4/3 w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
			/>
			<span class="absolute inset-0 flex items-center justify-center bg-primary/25">
				<span
					class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm"
				>
					<CirclePlay aria-hidden="true" class="size-5" strokeWidth={2} />
					{content.video.label}
				</span>
			</span>
		</a>
	</section>

	<section>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
			{#each content.facts as fact (fact.id)}
				<div
					class="rounded-md border border-primary/25 bg-primary/5 px-4 py-4 text-center text-sm leading-5 font-semibold text-primary"
				>
					{fact.text}
				</div>
			{/each}
		</div>
	</section>
</PageSectionStack>
