<script lang="ts">
	import { resolve } from "$app/paths";
	import hexagon from "$lib/assets/hexagon.svg";
	import triangle from "$lib/assets/triangle.svg";
	import circle from "$lib/assets/circle.svg";
	import hero_image from "$lib/assets/hero.png";
	import imo_classic from "$lib/assets/imo-classic.png";
	import egmo_knot from "$lib/assets/egmo-knot.png";
	import pagmo_geometry from "$lib/assets/pagmo-geometry.png";
	import SectionHeading from "$lib/components/section-heading.svelte";
	import TrainingProgramCard from "$lib/components/training-program-card.svelte";

	const training_programs = [
		{
			title: "Entrenamiento Presencial",
			description:
				"Sesiones semanales con entrenadores olímpicos para afianzar técnicas de resolución y demostración.",
			icon: hexagon,
			icon_alt: "Ícono de hexágono",
			bullets: ["Clases semanales", "Material curado", "Prácticas por nivel"],
		},
		{
			title: "Entrenamiento Olímpico",
			description:
				"Sesiones intensivas para estudiantes con proyección competitiva y preparación para fases selectivas.",
			icon: triangle,
			icon_alt: "Ícono de triángulo",
			bullets: ["Listas selectivas", "Análisis de pruebas", "Entrenamiento estratégico"],
		},
		{
			title: "Programa Virtual",
			description:
				"Formato remoto con clases en vivo y seguimiento continuo para estudiantes fuera de las sedes principales.",
			icon: circle,
			icon_alt: "Ícono de círculo",
			bullets: ["Clases en Zoom", "Biblioteca virtual", "Evaluaciones continuas"],
		},
	] as const;

	const material_cards = [
		{
			id: "geometria-1",
			title: "Introducción a la Geometría",
			description: "Problemas introductorios a la geometría euclidiana.",
		},
		{
			id: "geometria-2",
			title: "Introducción a la Geometría",
			description: "Problemas introductorios a la geometría euclidiana.",
		},
		{
			id: "geometria-3",
			title: "Introducción a la Geometría",
			description: "Problemas introductorios a la geometría euclidiana.",
		},
		{
			id: "geometria-4",
			title: "Introducción a la Geometría",
			description: "Problemas introductorios a la geometría euclidiana.",
		},
	] as const;

	const coaches = [
		{
			id: "coach-marty-1",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: hero_image,
			image_alt: "Retrato del entrenador Marty Mauser",
		},
		{
			id: "coach-marty-2",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: imo_classic,
			image_alt: "Retrato del entrenador Marty Mauser",
		},
		{
			id: "coach-willy",
			name: "Willy Wonka",
			role: "Entrenador Básico",
			image: egmo_knot,
			image_alt: "Retrato del entrenador Willy Wonka",
		},
	] as const;
</script>

<svelte:head>
	<title>Entrenamiento | OMEC</title>
</svelte:head>

<section class="border-b border-line px-4 pt-8 pb-9 lg:px-6 lg:pt-10 lg:pb-10">
	<div class="mx-auto max-w-270">
		<div class="max-w-150">
			<h1
				class="text-[36px] leading-[0.96] font-semibold tracking-[-0.04em] text-primary lg:text-[48px]"
			>
				Entrenamientos
			</h1>
			<p class="mt-4 max-w-120 text-[13px] leading-[1.55] text-copy/75">
				Desarrollamos las habilidades matemáticas de los estudiantes desde nivel básico hasta
				competencia internacional. Nuestros entrenadores son medallistas olímpicos y profesores
				universitarios con amplia experiencia.
			</p>
		</div>
	</div>
</section>

<section class="border-b border-line px-4 py-8 lg:px-6">
	<div class="mx-auto max-w-270">
		<SectionHeading
			title="Nuestros Programas"
			description="Tres modalidades de estudio para adaptarse a las necesidades de cada estudiante, sin importar su ubicación o nivel actual."
		/>

		<div class="mt-7 grid gap-5 lg:grid-cols-3">
			{#each training_programs as program (program.title)}
				<TrainingProgramCard {...program} />
			{/each}
		</div>
	</div>
</section>

<section class="border-b border-line px-4 py-8 lg:px-6">
	<div class="mx-auto max-w-270">
		<SectionHeading
			title="Material"
			description="La mejor manera de prepararse para concursos de matemáticas es resolviendo pruebas pasadas. Nuestro banco de problemas podrá ayudarte a practicar con problemas de competencias nacionales e internacionales."
		/>

		<div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each material_cards as card (card.id)}
				<article
					class="flex min-h-60 flex-col justify-between border border-line bg-white px-5 py-5"
				>
					<div>
						<div
							class="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/6"
						>
							<img
								src={pagmo_geometry}
								alt=""
								class="h-7 w-7 rounded-full object-cover opacity-80"
							/>
						</div>
						<h3
							class="mt-6 max-w-[12ch] text-[28px] leading-[0.88] font-semibold tracking-[-0.05em] text-primary"
						>
							{card.title}
						</h3>
						<p class="mt-4 max-w-42 text-[11px] leading-[1.55] text-copy/70">{card.description}</p>
					</div>

					<a
						href={resolve("/informacion")}
						class="mt-8 inline-flex h-10 w-10 items-center justify-center bg-primary text-white transition-colors hover:bg-primary-dark"
						aria-label={`Ver material ${card.title}`}
					>
						<span class="text-2xl leading-none">↗</span>
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="border-b border-line px-4 py-8 lg:px-6">
	<div class="mx-auto max-w-270">
		<SectionHeading
			title="Entrenadores"
			description="Cada programa cuenta con temas específicos según el nivel. Los estudiantes avanzan al ritmo que necesitan."
		/>

		<div class="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-190">
			{#each coaches as coach (coach.id)}
				<article class="flex items-center gap-4">
					<img
						src={coach.image}
						alt={coach.image_alt}
						class="h-18 w-18 rounded-full border border-line object-cover"
					/>
					<div>
						<h3 class="text-[24px] leading-[0.95] font-semibold tracking-[-0.04em] text-primary">
							{coach.name}
						</h3>
						<p class="mt-1 text-[12px] leading-normal text-copy/70">{coach.role}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="px-4 py-0 lg:px-0">
	<div class="bg-primary px-4 py-9 text-center text-white lg:px-6 lg:py-11">
		<div class="mx-auto max-w-170">
			<h2 class="text-[28px] leading-[0.95] font-semibold tracking-[-0.04em]">
				¿Listo para comenzar tu camino matemático?
			</h2>
			<p class="mx-auto mt-4 max-w-130 text-[12px] leading-[1.7] text-white/82">
				Inscríbete en uno de nuestros programas y comienza a desarrollar tu potencial junto a los
				mejores entrenadores del país.
			</p>
			<a
				href={resolve("/informacion")}
				class="mt-6 inline-flex h-10 items-center justify-center rounded-sm bg-white px-5 text-[13px] font-medium text-primary transition-colors hover:bg-white/90"
			>
				Inscribirse Ahora
			</a>
		</div>
	</div>
</section>
