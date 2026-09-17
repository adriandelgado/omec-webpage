<script lang="ts">
	import { content_asset } from "#lib/presentation.js";
	import olympiad_ciim from "#lib/assets/olimpiadas/internacionales/olympiad-ciim.jpg?enhanced";
	import olympiad_cono_sur from "#lib/assets/olimpiadas/internacionales/olympiad-cono-sur.jpeg?enhanced";
	import olympiad_egmo from "#lib/assets/olimpiadas/internacionales/olympiad-egmo.jpeg?enhanced";
	import olympiad_imo from "#lib/assets/olimpiadas/internacionales/olympiad-imo.jpeg?enhanced";
	import olympiad_pagmo from "#lib/assets/olimpiadas/internacionales/olympiad-pagmo.jpeg?enhanced";
	import olympiad_tjm from "#lib/assets/olimpiadas/internacionales/olympiad-tjm.jpeg?enhanced";
	import logo_apmo from "#lib/assets/logos/apmo.svg";
	import logo_mayo from "#lib/assets/logos/mayo.svg";
	import logo_igo from "#lib/assets/logos/igo.svg";
	import logo_usfq from "#lib/assets/logos/usfq.svg";
	import logo_ucsg from "#lib/assets/logos/ucsg.svg";
	import logo_sedem from "#lib/assets/logos/sedem.svg";
	import type { Picture } from "@sveltejs/enhanced-img";

	import { ExternalLink } from "@lucide/svelte";
	import Card from "#lib/components/card.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { get_content } from "./content.remote";

	const OLYMPIAD_IMAGES: Record<string, string | Picture> = {
		ciim: olympiad_ciim,
		"cono-sur": olympiad_cono_sur,
		egmo: olympiad_egmo,
		imo: olympiad_imo,
		pagmo: olympiad_pagmo,
		tjm: olympiad_tjm,
		apmo: logo_apmo,
		mayo: logo_mayo,
		igo: logo_igo,
	};
	const SPONSOR_IMAGES: Record<string, string> = {
		usfq: logo_usfq,
		ucsg: logo_ucsg,
		sedem: logo_sedem,
	};

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
						{#if olympiad.image_url}<img
								src={olympiad.image_url}
								alt={olympiad.image_alt}
								class="h-auto w-full object-contain"
							/>{:else if content_asset(OLYMPIAD_IMAGES, olympiad.asset_key)}
							{@const asset = content_asset(OLYMPIAD_IMAGES, olympiad.asset_key)!}
							<enhanced:img
								src={asset}
								alt={olympiad.image_alt}
								loading="lazy"
								decoding="async"
								sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
								class="h-full w-full object-contain"
							/>
						{:else}
							<span class="text-center font-semibold text-primary">{olympiad.name}</span>
						{/if}
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
						{#if sponsor.image_url}<img
								src={sponsor.image_url}
								alt={sponsor.image_alt}
								class="h-auto w-full object-contain"
							/>{:else if content_asset(SPONSOR_IMAGES, sponsor.asset_key)}
							{@const asset = content_asset(SPONSOR_IMAGES, sponsor.asset_key)!}
							<img
								src={asset}
								alt={sponsor.image_alt}
								loading="lazy"
								decoding="async"
								class="max-h-full max-w-full object-contain"
							/>
						{:else}
							<span class="text-center font-semibold text-primary">{sponsor.name}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>
</PageSectionStack>
