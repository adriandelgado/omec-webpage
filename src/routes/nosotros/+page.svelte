<script lang="ts">
	import { content_asset } from "#lib/presentation.js";
	import about_imo_2018 from "#lib/assets/nosotros/imo-2018.jpg";
	import about_imo_2018_enhanced from "#lib/assets/nosotros/imo-2018.jpg?enhanced";
	import director_fernando_gomez from "#lib/assets/nosotros/fernando-gomez.jpg?enhanced";
	import director_lucero_llanos from "#lib/assets/nosotros/lucero-llanos.jpg?enhanced";
	import director_pablo_serrano from "#lib/assets/nosotros/pablo-serrano.jpg?enhanced";
	import director_pedro_suarez from "#lib/assets/nosotros/pedro-suarez.png?enhanced";
	import director_valeria_santana from "#lib/assets/nosotros/valeria-santana.jpeg?enhanced";
	import type { Picture } from "@sveltejs/enhanced-img";

	import { Bell, ShieldAlert } from "@lucide/svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import MembersSection from "#lib/components/members-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";
	import TrainingCtaSection from "#lib/components/training-cta-section.svelte";
	import { get_site_content } from "#lib/content.remote.js";
	import { get_content } from "./content.remote";

	const DIRECTOR_IMAGES: Record<string, Picture> = {
		"fernando-gomez": director_fernando_gomez,
		"lucero-llanos": director_lucero_llanos,
		"pablo-serrano": director_pablo_serrano,
		"pedro-suarez": director_pedro_suarez,
		"valeria-santana": director_valeria_santana,
	};

	const [content, site_content] = await Promise.all([get_content(), get_site_content()]);
</script>

<Seo
	title={content.seo.title}
	description={content.seo.description}
	image={about_imo_2018}
	image_alt={content.seo.image_alt}
	include_organization
	social_links={site_content.social_links}
	page_type="AboutPage"
/>

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<h1 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
			{content.seo.title}
		</h1>

		<aside
			class="mt-7 grid gap-4 overflow-hidden rounded-2xl border border-primary/20 bg-primary px-4 py-3 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:px-5"
		>
			<div class="flex items-start gap-3">
				<div class="mt-0.5 rounded-full bg-white/12 p-2">
					<ShieldAlert aria-hidden="true" class="size-4" strokeWidth={2} />
				</div>

				<div>
					<p class="max-w-160 text-sm leading-5 font-semibold">
						{content.alert}
					</p>
				</div>
			</div>

			<div class="hidden items-center gap-2 lg:flex">
				<Bell
					aria-hidden="true"
					class="size-4 text-primary-dark/80"
					fill="currentColor"
					strokeWidth={1.8}
				/>
				<Bell
					aria-hidden="true"
					class="size-6 text-primary-dark/80"
					fill="currentColor"
					strokeWidth={1.8}
				/>
			</div>
		</aside>
	</ContentSection>

	<ContentSection container_class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
		<div class="max-w-125 text-sm leading-6 text-copy/75">
			<p class="text-4xl leading-none font-semibold tracking-tighter text-primary lg:text-5xl">
				{content.labor.eyebrow}
			</p>
			<h2 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
				{content.labor.title}
			</h2>

			<p class="mt-6">
				{content.labor.description}
			</p>
		</div>

		<enhanced:img
			src={about_imo_2018_enhanced}
			alt={content.labor.image_alt}
			sizes="(min-width: 1024px) 60vw, 100vw"
			class="mx-auto aspect-4/3 w-full rounded-2xl object-cover"
		/>
	</ContentSection>

	<ContentSection>
		<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
			{#each content.values_cards as card (card.number)}
				<article class="rounded-2xl border border-primary/30 bg-white px-5 py-4">
					<p class="text-5xl leading-none font-semibold tracking-tighter text-primary">
						{card.number}
					</p>
					<h3 class="mt-4 text-lg leading-tight font-semibold text-primary">{card.title}</h3>
					{#if card.description !== null}
						<p class="mt-3 text-sm leading-6 text-copy/75 italic">{card.description}</p>
					{:else}
						<ul class="mt-3 space-y-1 text-sm leading-6 text-copy/75 italic">
							{#each card.values as value (value)}
								<li>{value}</li>
							{/each}
						</ul>
					{/if}
				</article>
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading title={content.members_heading} />
		<ul
			class="mt-8 grid gap-x-12 gap-y-2 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-15 lg:mt-10 lg:gap-x-20 lg:gap-y-3"
		>
			{#each content.members as member (member)}
				<li
					class="border-b border-primary/20 py-2 text-lg leading-tight font-semibold tracking-tighter text-primary"
				>
					{member}
				</li>
			{/each}
		</ul>
	</ContentSection>

	<ContentSection>
		<div class="text-center">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.team.eyebrow}
			</p>
			<h2 class="mt-3 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
				{content.team.title}
			</h2>
		</div>

		<MembersSection
			members={content.directors.map((director) => ({
				...director,
				image: content_asset(DIRECTOR_IMAGES, director.asset_key),
			}))}
			class="mt-8 sm:grid-cols-2 lg:mt-10"
		/>
	</ContentSection>
</PageSectionStack>

<TrainingCtaSection />
