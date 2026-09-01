<script lang="ts">
	import { ExternalLink } from "@lucide/svelte";
	import type { Picture } from "@sveltejs/enhanced-img";
	import logo_apmo from "#lib/assets/logos/apmo.svg";
	import olympiad_ciim from "#lib/assets/olimpiadas/internacionales/olympiad-ciim.jpg?enhanced";
	import olympiad_cono_sur from "#lib/assets/olimpiadas/internacionales/olympiad-cono-sur.jpeg?enhanced";
	import olympiad_egmo from "#lib/assets/olimpiadas/internacionales/olympiad-egmo.jpeg?enhanced";
	import logo_igo from "#lib/assets/logos/igo.svg";
	import olympiad_imo from "#lib/assets/olimpiadas/internacionales/olympiad-imo.jpeg?enhanced";
	import logo_mayo from "#lib/assets/logos/mayo.svg";
	import olympiad_pagmo from "#lib/assets/olimpiadas/internacionales/olympiad-pagmo.jpeg?enhanced";
	import olympiad_tjm from "#lib/assets/olimpiadas/internacionales/olympiad-tjm.jpeg?enhanced";
	import logo_ucsg from "#lib/assets/logos/ucsg.svg";
	import logo_sedem from "#lib/assets/logos/sedem.svg";
	import logo_usfq from "#lib/assets/logos/usfq.svg";
	import Card from "#lib/components/card.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";

	type Olympiad = {
		id: string;
		name: string;
		description: string;
		image: Picture | string;
		image_alt: string;
		href?: string;
	};

	type Sponsor = {
		id: string;
		name: string;
		image: string;
	};

	const olympiads: readonly Olympiad[] = [
		{
			id: "imo",
			name: "IMO",
			description:
				"La Olimpiada Internacional de Matemáticas es el certamen mundial en el que participan alrededor de 100 países de todos los continentes del mundo.",
			image: olympiad_imo,
			image_alt: "Participantes en la Olimpiada Internacional de Matemáticas",
			href: "http://imo-official.org/",
		},
		{
			id: "egmo",
			name: "EGMO",
			description:
				"Ecuador es un país invitado a la Olimpiada Europea Femenina que tiene como finalidad promover el estudio de las matemáticas en las mujeres.",
			image: olympiad_egmo,
			image_alt: "Participantes en la Olimpiada Europea Femenina de Matemáticas",
			href: "https://www.egmo.org/",
		},
		{
			id: "cono-sur",
			name: "Cono Sur",
			description:
				"La Olimpiada Matemática de Países del Cono Sur está dirigida a estudiantes de hasta 16 años de 8 países de Sudamérica.",
			image: olympiad_cono_sur,
			image_alt: "Participantes en la Olimpiada Matemática de Países del Cono Sur",
		},
		{
			id: "pagmo",
			name: "PAGMO",
			description:
				"La Olimpiada Panamericana Femenina de Matemáticas tiene como finalidad promover el estudio de las matemáticas en las mujeres. Tiene un límite de edad de 16 años.",
			image: olympiad_pagmo,
			image_alt: "Participantes en la Olimpiada Panamericana Femenina de Matemáticas",
			href: "https://www.pagmo.info/",
		},
		{
			id: "tjm",
			name: "Torneo de Jóvenes Matemáticos",
			description:
				"El TJM es una competencia entre países de Latinoamérica, para chicos de 13 a 16 años. Tiene un formato único donde los participantes obtienen retroalimentación sobre sus soluciones en tiempo real.",
			image: olympiad_tjm,
			image_alt: "Participantes en el Torneo de Jóvenes Matemáticos",
		},
		{
			id: "apmo",
			name: "APMO",
			description:
				"La Olimpiada Matemática de Asia Pacífico se realiza por correspondencia, tiene un formato y dificultad similar a la IMO.",
			image: logo_apmo,
			image_alt: "Logotipo de la Olimpiada Matemática de Asia Pacífico",
			href: "https://www.apmo-official.org/",
		},
		{
			id: "mayo",
			name: "Olimpiada de Mayo",
			description:
				'Conocida como la "Iberoamericana Junior", esta competencia por correspondencia es organizada por Argentina a nivel iberoamericano y está destinada a estudiantes menores de 15 años.',
			image: logo_mayo,
			image_alt: "Logotipo de la Olimpiada de Mayo",
		},
		{
			id: "igo",
			name: "IGO",
			description:
				"La Olimpiada Iraní de Geometría se enfoca únicamente en el área que le da el nombre. Esta olimpiada por correspondencia es única por tener un nivel abierto a todo el público, sin restricciones.",
			image: logo_igo,
			image_alt: "Logotipo de la Olimpiada Iraní de Geometría",
		},
		{
			id: "ciim",
			name: "CIIM",
			description:
				"La Competencia Iberoamericana Interuniversitaria de Matemáticas tiene el ánimo de incentivar el estudio de las matemáticas en la comunidad universitaria iberoamericana.",
			image: olympiad_ciim,
			image_alt: "Participantes en la Competencia Iberoamericana Interuniversitaria de Matemáticas",
			href: "http://ciim.uan.edu.co/",
		},
	] as const;

	const sponsors: readonly Sponsor[] = [
		{ id: "usfq", name: "Universidad San Francisco de Quito", image: logo_usfq },
		{
			id: "egcs-ucsg",
			name: "Escuela de Graduados en Ciencias de la Salud de la UCSG",
			image: logo_ucsg,
		},
		{ id: "sponsor", name: "Entidad auspiciadora de OMEC", image: logo_sedem },
	] as const;
</script>

<Seo
	title="Olimpiadas Internacionales"
	description="Conoce las competencias matemáticas internacionales en las que participan las delegaciones ecuatorianas de OMEC."
/>

<PageSectionStack>
	<section>
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">
			Conoce algunas de las
		</p>
		<h2 class="mt-2 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
			Olimpiadas Internacionales
		</h2>
		<p class="mt-5 max-w-170 text-sm leading-6 text-copy/75">
			Estas son algunas de las olimpiadas en las que Ecuador participa a nivel internacional. Los
			ganadores de la ONM del año previo serán convocados a los selectivos de estas competencias y
			tendrán una oportunidad de formar parte de la delegación de Ecuador en estas olimpiadas,
			dependiendo de su edad y género.
		</p>

		<div class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{#each olympiads as olympiad (olympiad.id)}
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
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Con el apoyo de</p>
			<div class="mt-5 grid grid-cols-2 items-center gap-6 sm:grid-cols-3">
				{#each sponsors as sponsor (sponsor.id)}
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
