<script lang="ts">
	import { resolve } from "$app/paths";
	import hexagon from "$lib/assets/hexagon.svg";
	import triangle from "$lib/assets/triangle.svg";
	import circle from "$lib/assets/circle.svg";
	import ContentSection from "$lib/components/content-section.svelte";
	import MembersSection from "$lib/components/members-section.svelte";
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import PageIntro from "$lib/components/page-intro.svelte";
	import Seo from "$lib/components/seo.svelte";
	import SectionHeading from "$lib/components/section-heading.svelte";
	import TrainingCtaSection from "$lib/components/training-cta-section.svelte";
	import TrainingProgramCard from "$lib/components/training-program-card.svelte";

	const title = "Entrenamientos";
	const coach_portrait =
		"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80";

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
			image: coach_portrait,
			image_alt: "Retrato del entrenador Marty Mauser",
		},
		{
			id: "coach-marty-2",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: coach_portrait,
			image_alt: "Retrato del entrenador Marty Mauser",
		},
		{
			id: "coach-willy",
			name: "Willy Wonka",
			role: "Entrenador Básico",
			image: coach_portrait,
			image_alt: "Retrato del entrenador Willy Wonka",
		},
	] as const;
</script>

<Seo
	{title}
	description="Programas de entrenamiento de OMEC para fortalecer resolución de problemas, demostración y preparación olímpica desde nivel básico hasta competencia internacional."
/>

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<PageIntro
			title_lines={[{ text: title, class: "text-primary" }]}
			description="Desarrollamos las habilidades matemáticas de los estudiantes desde nivel básico hasta competencia internacional. Nuestros entrenadores son medallistas olímpicos y profesores universitarios con amplia experiencia."
		/>
	</ContentSection>

	<ContentSection>
		<SectionHeading
			title="Nuestros Programas"
			description="Tres modalidades de estudio para adaptarse a las necesidades de cada estudiante, sin importar su ubicación o nivel actual."
		/>

		<div class="mt-7 grid gap-5 lg:grid-cols-3">
			{#each training_programs as program (program.title)}
				<TrainingProgramCard {...program} />
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading
			title="Material"
			description="La mejor manera de prepararse para concursos de matemáticas es resolviendo pruebas pasadas. Nuestro banco de problemas podrá ayudarte a practicar con problemas de competencias nacionales e internacionales."
		/>

		<div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each material_cards as card (card.id)}
				<article
					class="relative flex min-h-96 flex-col justify-between overflow-hidden rounded-xl border border-primary bg-white px-6 pt-10 pb-24 sm:px-7"
				>
					<div>
						<h3
							class="mx-auto max-w-[9ch] text-center text-3xl leading-8 font-semibold tracking-tighter text-primary sm:text-4xl"
						>
							{card.title}
						</h3>
						<p class="mx-auto mt-10 max-w-[20ch] text-center text-base leading-snug">
							{card.description}
						</p>
					</div>

					<a
						href={resolve("/nosotros")}
						class="absolute bottom-0 left-0 inline-flex size-20 items-center justify-center bg-primary text-white transition-colors hover:bg-primary-dark"
						aria-label={`Ver material ${card.title}`}
					>
						<span class="text-5xl leading-none">↗</span>
					</a>
				</article>
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading
			title="Entrenadores"
			description="Cada programa cuenta con temas específicos según el nivel. Los estudiantes avanzan al ritmo que necesitan."
		/>

		<MembersSection members={coaches} class="mt-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3" />
	</ContentSection>
</PageSectionStack>

<TrainingCtaSection />
