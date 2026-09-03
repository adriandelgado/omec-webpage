<script lang="ts">
	import { ExternalLink } from "@lucide/svelte";
	import Card from "#lib/components/card.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { get_content } from "./content.remote";

	const content = await get_content();
</script>

<Seo title={content.seo.title} description={content.seo.description} />

<PageSectionStack>
	<section>
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">
			{content.intro.eyebrow}
		</p>
		<h2 class="mt-2 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
			{content.intro.title}
		</h2>
		<p class="mt-5 max-w-170 text-sm leading-6 text-copy/75">
			{content.intro.description}
		</p>

		<div class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{#each content.olympiads as olympiad (olympiad.id)}
				<Card class="flex min-h-105 flex-col overflow-hidden">
					<div
						class="flex h-48 items-center justify-center border-b border-primary/20 bg-foreground p-4"
					>
						<enhanced:img
							src={olympiad.image}
							alt={olympiad.image_alt}
							loading="lazy"
							decoding="async"
							sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
							class="h-full w-full object-contain"
						/>
					</div>

					<div class="flex flex-1 flex-col p-5">
						<h3 class="text-2xl leading-none font-semibold tracking-tighter text-primary">
							{olympiad.name}
						</h3>
						<p class="mt-4 text-sm leading-6 text-copy/75">{olympiad.description}</p>

						{#if olympiad.href}
							<a
								href={olympiad.href}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							>
								Sitio oficial
								<ExternalLink aria-hidden="true" class="size-4" strokeWidth={2} />
							</a>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	</section>

	<section>
		<div class="border-y border-primary/20 py-7">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				{content.sponsors.eyebrow}
			</p>
			<div class="mt-5 grid grid-cols-2 items-center gap-6 sm:grid-cols-3">
				{#each content.sponsors.items as sponsor (sponsor.id)}
					<div class="flex h-18 items-center justify-center">
						<img
							src={sponsor.image}
							alt={sponsor.name}
							loading="lazy"
							decoding="async"
							class="max-h-full max-w-full object-contain"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>
</PageSectionStack>
