<script lang="ts">
	import { resolve } from "$app/paths";
	import { Info, Lightbulb, Newspaper } from "@lucide/svelte";
	import blocks from "#lib/assets/shared/blocks.svg";
	import logo_egcs_ucsg from "#lib/assets/logos/ucsg.svg";
	import sine from "#lib/assets/shared/sine.svg";
	import triangle_center_gravity from "#lib/assets/home/triangle-center-gravity.svg";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";

	const olympiad_stages = [
		{ label: "Primera fase", date: "17 de octubre" },
		{ label: "Segunda fase", date: "7 de noviembre" },
		{ label: "Fase final", date: "11 y 12 de diciembre" },
	] as const;

	const information_items = [
		{
			title: "Información",
			icon: Info,
			href: resolve("/olimpiadas/nacionales"),
		},
		{
			title: "Preparación",
			icon: Lightbulb,
			href: resolve("/entrenamiento"),
		},
		{
			title: "Noticias",
			icon: Newspaper,
			href: resolve("/noticias"),
		},
	] as const;

	const olympiad_cards = [
		{
			title: "Olimpiada Nacional de Matemáticas",
			description:
				"Tienen como objetivo preseleccionar a los alumnos que formarán parte de los equipos que representan al país en los torneos internacionales en los que competimos. Son abiertas para cualquier estudiante del sistema educativo ecuatoriano.",
			href: resolve("/olimpiadas/nacionales"),
		},
		{
			title: "Olimpiadas Internacionales",
			description:
				"Incluye varias competencias tanto presenciales como por correspondencia. A estos eventos sólo se asiste con invitación, la cual es enviada únicamente a los ganadores de las Olimpiadas Nacionales del año anterior.",
			href: resolve("/olimpiadas/internacionales"),
		},
	] as const;

	const national_olympiad_facts = [
		"Participan colegios de todo el Ecuador. También se puede participar de manera independiente.",
		"Concursantes de primaria, secundaria y universidades",
		"Abierto a todas las provincias del Ecuador",
	] as const;

	const social_links = [
		{ label: "Facebook", href: "https://www.facebook.com/OlimpiadaMatematicaEcuatoriana" },
		{ label: "Instagram", href: "https://www.instagram.com/omec.mat" },
		{ label: "TikTok", href: "https://www.tiktok.com/@omec.mat" },
	] as const;
</script>

<Seo
	title=""
	description="Olimpiada Matemática Ecuatoriana. Organizamos competencias, entrenamiento y procesos de selección para desarrollar el talento matemático de estudiantes ecuatorianos."
/>

<PageSectionStack class="py-12 lg:py-20">
	<ContentSection container_class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
		<div class="max-w-100">
			<h1 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
				Olimpiada Matemática
				<span class="text-primary">Ecuatoriana</span>
			</h1>
		</div>

		<figure
			class="overflow-hidden rounded-md border border-primary bg-white p-2 shadow-[4px_4px_0_0_var(--color-primary)] lg:p-3"
		>
			<enhanced:img
				src="#lib/assets/home/imo-team-2026.jpeg"
				alt="Delegación ecuatoriana junto al letrero de la IMO 2026 en Shanghái"
				fetchpriority="high"
				sizes="(min-width: 1024px) 60vw, 100vw"
				class="aspect-[2.7/1] w-full object-cover"
			/>
		</figure>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Olimpiada Nacional de Matemática 2026" />

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
						Las inscripciones de la Olimpiada Nacional de Matemática 2026 se abrirán en septiembre.
					</p>
					<a
						href={resolve("/olimpiadas/nacionales")}
						class="mt-5 inline-flex h-9 items-center justify-center rounded-sm bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						Conoce la olimpiada nacional
					</a>
				</div>
			</div>

			<dl
				class="divide-y divide-primary/20 rounded-md border border-primary bg-white px-5 py-1 text-sm shadow-[4px_4px_0_0_var(--color-primary)]"
			>
				{#each olympiad_stages as stage (stage.label)}
					<div class="flex items-center justify-between gap-4 py-3">
						<dt class="font-medium text-primary">{stage.label}</dt>
						<dd class="text-right text-copy/75">{stage.date}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			{#each information_items as item (item.title)}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-md border border-primary/30 bg-white px-4 py-3 transition-colors hover:bg-primary/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					<item.icon aria-hidden="true" class="size-10 text-primary" strokeWidth={1.8} />
					<p class="text-sm font-medium text-primary">{item.title}</p>
				</a>
			{/each}
		</div>
	</ContentSection>

	<ContentSection container_class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
		<div>
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Acerca de nosotros</p>
			<h2 class="mt-3 max-w-150 text-3xl leading-none font-semibold tracking-tighter lg:text-5xl">
				Encontrando Talentos Matemáticos desde 1997
			</h2>

			<p class="mt-6 max-w-150 text-sm leading-6 text-copy/75">
				Desde 1997 <em>Olimpiada Matemática Ecuatoriana (OMEC)</em> se encarga de detectar, formar y
				preparar los talentos matemáticos que conforman los equipos que representarán al país en
				varias competencias olímpicas. Entre ellas el <strong>Mundial de Matemáticas (IMO)</strong>,
				la <strong>Olimpiada Europea Femenina de Matemáticas (EGMO)</strong>, la
				<strong>Olimpiada de Matemáticas de Asia-Pacífico (APMO)</strong>, la Olimpiada de
				Matemáticas de países del <strong>Cono Sur</strong>.
			</p>

			<a
				href={resolve("/nosotros")}
				class="mt-6 inline-flex h-9 items-center justify-center rounded-sm border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				Ver más sobre OMEC
			</a>
		</div>

		<figure
			class="overflow-hidden rounded-md border border-primary bg-white p-2 shadow-[4px_4px_0_0_var(--color-primary)] lg:p-3"
		>
			<enhanced:img
				src="#lib/assets/home/olympiad-student.jpeg"
				alt="Dos estudiantes sostienen sus diplomas y medallas de la Olimpiada Matemática Ecuatoriana"
				loading="lazy"
				decoding="async"
				sizes="(min-width: 1024px) 36vw, 100vw"
				class="aspect-4/5 w-full object-cover object-center"
			/>
		</figure>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Conoce a Nuestros Auspiciantes" />

		<div
			class="mt-8 flex justify-center rounded-md border border-primary/30 bg-white px-6 py-8 shadow-[4px_4px_0_0_var(--color-primary)]"
		>
			<img
				src={logo_egcs_ucsg}
				alt="Logo de la Escuela de Graduados en Ciencias de la Salud de la Universidad Católica de Santiago de Guayaquil"
				loading="lazy"
				decoding="async"
				class="h-auto w-full max-w-70 object-contain"
			/>
		</div>
	</ContentSection>

	<ContentSection>
		<div class="grid overflow-hidden rounded-md border border-primary lg:grid-cols-2">
			{#each olympiad_cards as card (card.title)}
				<article class="bg-primary px-6 py-8 text-white even:bg-primary-dark lg:px-10 lg:py-12">
					<h2 class="max-w-105 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
						{card.title}
					</h2>
					<p class="mt-5 max-w-130 text-sm leading-6 text-white/80">{card.description}</p>
					<a
						href={card.href}
						class="mt-6 inline-flex h-9 items-center justify-center rounded-sm bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						Ver más
					</a>
				</article>
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<div class="relative overflow-hidden rounded-md border border-primary bg-primary">
			<enhanced:img
				src="#lib/assets/home/national-olympiad-participants.jpg"
				alt="Estudiantes participan en una prueba de la Olimpiada Nacional de Matemáticas"
				loading="lazy"
				decoding="async"
				sizes="100vw"
				class="absolute inset-0 size-full object-cover opacity-25"
			/>
			<div class="relative px-6 py-10 text-white lg:px-10 lg:py-14">
				<h2 class="max-w-180 text-3xl leading-none font-semibold tracking-tighter lg:text-5xl">
					Nuestra Olimpiada Nacional de Matemáticas
				</h2>
				<div class="mt-8 grid gap-4 md:grid-cols-3">
					{#each national_olympiad_facts as fact (fact)}
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
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Síguenos</p>
			<h2 class="mt-3 text-3xl leading-none font-semibold tracking-tighter lg:text-5xl">
				No te pierdas de inscripciones y fechas importantes
			</h2>
			<nav class="mt-6 flex flex-wrap gap-3" aria-label="Redes sociales de OMEC">
				{#each social_links as social_link (social_link.label)}
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
