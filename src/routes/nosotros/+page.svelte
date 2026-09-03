<script lang="ts">
	import { Bell, ShieldAlert } from "@lucide/svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import MembersSection from "#lib/components/members-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";
	import TrainingCtaSection from "#lib/components/training-cta-section.svelte";
	import { get_content } from "./content.remote";

	const content = await get_content();
</script>

<Seo
	title={content.seo.title}
	description={content.seo.description}
	image={content.seo.image}
	image_alt={content.seo.image_alt}
	include_organization
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
			src={content.labor.image}
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
					{#if "description" in card}
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

		<MembersSection members={content.directors} class="mt-8 sm:grid-cols-2 lg:mt-10" />
	</ContentSection>
</PageSectionStack>

<TrainingCtaSection />
