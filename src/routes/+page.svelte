<script lang="ts">
	import { resolve } from "$app/paths";
	import hero_image from "$lib/assets/hero.png";
	import blocks from "$lib/assets/blocks.svg";
	import triangle_center_gravity from "$lib/assets/triangle-center-gravity.svg";
	import hexagon from "$lib/assets/hexagon.svg";
	import triangle from "$lib/assets/triangle.svg";
	import circle from "$lib/assets/circle.svg";
	import sine from "$lib/assets/sine.svg";
	import logo_imo from "$lib/assets/logo-imo.svg";
	import logo_egmo from "$lib/assets/logo-egmo.svg";
	import logo_pagmo from "$lib/assets/logo-pagmo.svg";
	import olimpiada_de_mayo from "$lib/assets/olimpiada-de-mayo.svg";
	import ContentSection from "$lib/components/content-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import SectionHeading from "$lib/components/section-heading.svelte";
	import TrainingProgramCard from "$lib/components/training-program-card.svelte";

	const training_cards = [
		{
			title: "Entrenamiento Presencial",
			description:
				"Sesiones semanales guiadas por exolímpicos y docentes con experiencia en preparación competitiva.",
			icon: hexagon,
			icon_alt: "Ícono de hexágono",
			bullets: ["Clases semanales", "Material didáctico", "Problemas resueltos"],
		},
		{
			title: "Entrenamiento Personal",
			description:
				"Seguimiento cercano para estudiantes que necesitan fortalecer técnicas de demostración y estrategia.",
			icon: triangle,
			icon_alt: "Ícono de triángulo",
			bullets: ["Mentoría individual", "Retroalimentación", "Rutas por nivel"],
		},
		{
			title: "Programa Virtual",
			description:
				"Acceso remoto a clases en vivo, recursos grabados y acompañamiento continuo durante la temporada.",
			icon: circle,
			icon_alt: "Ícono de círculo",
			bullets: ["Clases en línea", "Biblioteca virtual", "Evaluaciones periódicas"],
		},
	] as const;

	const olympic_stages = [
		["Inscripciones", "Enero - Febrero"],
		["Fase Regional", "Marzo"],
		["Fase Nacional", "Mayo"],
		["IMO", "Julio"],
	] as const;

	const olympic_editions = [1, 2, 3] as const;

	const international_achievements = [
		{
			id: "logo_imo",
			image: logo_imo,
			title: "IMO - Olimpiada Internacional de Matemática",
			description: "Participación y medallistas a nivel mundial.",
		},
		{
			id: "logo_egmo",
			image: logo_egmo,
			title: "EGMO - Olimpiada Europea Femenina de Matemática",
			description: "Participación y medallistas en la competencia europea.",
		},
		{
			id: "logo_pagmo",
			image: logo_pagmo,
			title: "PAGMO - Olimpiada Panamericana Femenina de Matemática",
			description: "Participación y medallistas a nivel panamericano.",
		},
		{
			id: "olimpiada_de_mayo",
			image: olimpiada_de_mayo,
			title: "Olimpiada de Mayo",
			description: "Competencia matemática juvenil a nivel iberoamericano.",
		},
	] as const;

	const gallery_events = Array.from({ length: 8 }, (_, index) => ({
		id: `evento-${index + 1}`,
		title: `Evento ${index + 1}`,
		image: logo_imo,
		image_alt: "Participantes de una actividad de la olimpiada matemática",
	}));
</script>

<Seo
	title=""
	description="Olimpiada Matemática Ecuatoriana. Organizamos competencias, entrenamiento y procesos de selección para desarrollar el talento matemático de estudiantes ecuatorianos."
/>

<div class="flex flex-col gap-y-8 py-8 lg:gap-y-10 lg:py-10">
	<ContentSection container_class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
		<div class="max-w-80">
			<h1 class="text-4xl leading-none font-semibold tracking-tighter text-copy lg:text-5xl">
				Olimpiada Matemática
				<span class="text-primary">Ecuatoriana</span>
			</h1>

			<p class="mt-4 max-w-67.5 text-sm leading-6 text-copy/75 lg:max-w-75">
				Desarrollando el talento matemático de los estudiantes ecuatorianos y potenciando la
				excelencia académica.
			</p>
		</div>

		<div
			class="relative overflow-hidden rounded-3xl border border-primary/25 bg-[linear-gradient(to_right,rgba(61,120,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(61,120,255,0.14)_1px,transparent_1px)] bg-size-[40px_40px] px-4 py-5 lg:min-h-72.5 lg:px-7 lg:py-8"
		>
			<img
				src={hero_image}
				alt="Problema de geometría olímpica"
				class="mx-auto h-auto w-full max-w-130 object-contain"
			/>
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Programas de Entrenamiento" />

		<div class="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
			<p class="max-w-150 text-sm leading-relaxed text-copy/75">
				Ofrecemos programas de entrenamiento diseñados para desarrollar las capacidades matemáticas
				desde etapas iniciales hasta niveles de alta competencia. Nuestros entrenadores combinan
				experiencia olímpica y formación universitaria.
			</p>

			<img src={blocks} alt="" class="w-18 justify-self-end lg:w-24" />
		</div>

		<div class="mt-7 grid gap-5 lg:grid-cols-3">
			{#each training_cards as card (card.title)}
				<TrainingProgramCard {...card} />
			{/each}
		</div>

		<img src={triangle_center_gravity} alt="" class="mt-6 w-14 lg:w-20" />
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Calendario Olímpico" />

		<div class="mt-5 grid gap-4 lg:grid-cols-3">
			{#each olympic_editions as edition (edition)}
				<article class="overflow-hidden rounded-sm border border-primary bg-white">
					<div class="flex items-center justify-between bg-primary px-4 py-2 text-white">
						<h3 class="text-sm font-medium">Olimpiada Nacional</h3>
						<p class="text-xs tracking-widest uppercase opacity-70">fase {edition}</p>
					</div>

					<div class="grid gap-2 p-4 text-sm text-copy">
						{#each olympic_stages as [label, date] (label)}
							<div class="grid grid-cols-[1fr_auto] gap-3">
								<p>{label}</p>
								<p>{date}</p>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>

		<div
			class="relative mt-5 overflow-hidden rounded-md bg-primary px-5 py-4 text-white lg:grid lg:grid-cols-[1fr_auto] lg:items-center"
		>
			<div>
				<h3 class="text-lg font-medium">Inscripciones Abiertas</h3>
				<p class="mt-1 text-sm text-white/85">
					Regístrate ahora para la temporada 2026 de las Olimpiadas Matemáticas.
				</p>
			</div>

			<img
				src={sine}
				alt=""
				class="pointer-events-none absolute top-1/2 right-8 hidden w-44 -translate-y-1/2 opacity-50 lg:block"
			/>

			<a
				href={resolve("/nosotros")}
				class="relative mt-4 inline-flex h-9 items-center justify-center rounded-sm bg-white px-5 text-sm font-medium text-primary lg:mt-0"
				>Inscríbete Ahora</a
			>
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Logros Internacionales" />

		<div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#each international_achievements as achievement (achievement.id)}
				<article class="rounded-sm border-x border-t-6 border-b border-primary bg-white p-4">
					<div class="flex h-20 items-center justify-center">
						<img src={achievement.image} alt="" class="max-h-16 w-auto object-contain" />
					</div>

					<div class="mt-4 text-center">
						<h3 class="text-sm leading-tight font-medium text-primary">{achievement.title}</h3>
						<p class="mt-2 text-xs leading-normal text-copy/70">{achievement.description}</p>
					</div>

					<div class="mt-3 flex items-end justify-center gap-5 text-center">
						<div>
							<div
								class="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-xs font-semibold text-white"
							>
								1
							</div>
							<p class="mt-1 text-xs text-copy/70">Bronce</p>
						</div>
						<div>
							<div
								class="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-copy"
							>
								10
							</div>
							<p class="mt-1 text-xs text-copy/70">HM</p>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Galería de eventos" />

		<div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each gallery_events as event (event.id)}
				<article>
					<div class="overflow-hidden border border-primary/25 bg-white">
						<img
							src={event.image}
							alt={event.image_alt}
							class="aspect-[4/2.7] w-full object-cover"
						/>
					</div>
					<p class="mt-2 text-sm text-copy/70">{event.title}</p>
				</article>
			{/each}
		</div>
	</ContentSection>
</div>
