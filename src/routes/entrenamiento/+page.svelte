<script lang="ts">
	import { CalendarDays, ExternalLink, Presentation } from "@lucide/svelte";
	import Card from "#lib/components/card.svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageIntro from "#lib/components/page-intro.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";
	import { get_content } from "./content.remote";

	const MATERIAL_ICONS = { presentation: Presentation, calendar_days: CalendarDays } as const;
	const content = await get_content();
</script>

<Seo title={content.seo.title} description={content.seo.description} />

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<PageIntro
			title_lines={[{ text: content.intro.title, class: "text-primary" }]}
			description={content.intro.description}
		/>
	</ContentSection>

	<ContentSection>
		<SectionHeading title={content.section.title} description={content.section.description} />

		<div class="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each content.materials as material (material.id)}
				<Card class="flex min-h-96 flex-col overflow-hidden">
					<div class="flex h-36 items-center justify-center bg-foreground px-6 py-5">
						{#if material.icon}
							{@const Icon = MATERIAL_ICONS[material.icon]}
							<Icon aria-hidden="true" class="size-20 text-primary" strokeWidth={1.8} />
						{:else if material.image}
							<img
								src={material.image}
								alt={material.image_alt}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-contain"
							/>
						{/if}
					</div>

					<div class="flex flex-1 flex-col px-6 py-6">
						<h3
							class="max-w-[18ch] text-2xl leading-none font-semibold tracking-tighter text-primary"
						>
							{material.title}
						</h3>
						<p class="mt-4 text-sm leading-6 text-copy/75">{material.description}</p>

						<a
							href={material.href}
							target="_blank"
							rel="noreferrer"
							class="mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>
							Abrir en Drive
							<ExternalLink aria-hidden="true" class="size-4" strokeWidth={2} />
						</a>
					</div>
				</Card>
			{/each}
		</div>
	</ContentSection>
</PageSectionStack>
