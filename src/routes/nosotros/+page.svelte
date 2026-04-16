<script lang="ts">
	import { Bell, ShieldAlert } from "@lucide/svelte";
	import imo_2018 from "$lib/assets/imo-2018.jpg";
	import ContentSection from "$lib/components/content-section.svelte";
	import MembersSection from "$lib/components/members-section.svelte";
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import Seo from "$lib/components/seo.svelte";
	import SectionHeading from "$lib/components/section-heading.svelte";
	import TrainingCtaSection from "$lib/components/training-cta-section.svelte";

	const title = "Nosotros";
	const member_portrait =
		"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80";

	const values_cards = [
		{
			number: "01",
			eyebrow: "Nuestra Visión",
			title: "Promover talento matemático",
			description:
				"Buscamos que más estudiantes ecuatorianos descubran en la matemática un espacio para pensar con rigor, creatividad y curiosidad.",
		},
		{
			number: "02",
			eyebrow: "Nuestra Misión",
			title: "Construir formación sostenida",
			description:
				"Organizamos competencias, entrenamientos y acompañamiento académico para que el aprendizaje no termine con una sola prueba.",
		},
		{
			number: "03",
			eyebrow: "Nuestro Compromiso",
			title: "Representar al país con excelencia",
			description:
				"Preparamos delegaciones que compiten a nivel nacional e internacional con solidez técnica, trabajo en equipo y responsabilidad.",
		},
	] as const;

	const members = [
		{
			id: "member-marty-1",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: member_portrait,
			image_alt: "Retrato de Marty Mauser",
		},
		{
			id: "member-marty-2",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: member_portrait,
			image_alt: "Retrato de Marty Mauser",
		},
		{
			id: "member-marty-3",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: member_portrait,
			image_alt: "Retrato de Marty Mauser",
		},
		{
			id: "member-marty-4",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: member_portrait,
			image_alt: "Retrato de Marty Mauser",
		},
		{
			id: "member-marty-5",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: member_portrait,
			image_alt: "Retrato de Marty Mauser",
		},
		{
			id: "member-marty-6",
			name: "Marty Mauser",
			role: "Jefe de Entrenamiento",
			image: member_portrait,
			image_alt: "Retrato de Marty Mauser",
		},
	] as const;
</script>

<Seo
	{title}
	description="Conoce a OMEC, su misión y el trabajo que realiza para promover la excelencia matemática y las olimpiadas estudiantiles en Ecuador."
/>

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<h1 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
			{title}
		</h1>

		<p class="mt-4 max-w-175 text-sm leading-6 text-copy/75">
			Somos una organización sin fines de lucro dedicada a desarrollar el talento matemático de
			estudiantes ecuatorianos mediante competencias, entrenamiento y acompañamiento académico.
		</p>

		<div
			class="mt-7 grid gap-4 overflow-hidden rounded-2xl border border-primary/20 bg-primary px-4 py-3 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:px-5"
		>
			<div class="flex items-start gap-3">
				<div class="mt-0.5 rounded-full bg-white/12 p-2">
					<ShieldAlert aria-hidden="true" class="size-4" strokeWidth={2} />
				</div>

				<div>
					<p class="text-sm font-semibold">Aviso a la comunidad</p>
					<p class="mt-1 max-w-160 text-xs leading-5 text-white/80">
						OMEC comunica únicamente por sus canales oficiales y por convocatorias publicadas en sus
						espacios institucionales.
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
		</div>
	</ContentSection>

	<ContentSection container_class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
		<div class="max-w-125">
			<p class="text-4xl leading-none font-semibold tracking-tighter text-primary lg:text-5xl">
				Acerca de
			</p>
			<h2 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
				Nuestra labor
			</h2>

			<p class="mt-6 text-sm leading-6 text-copy/78">
				OMEC crea espacios donde la matemática se vive como una práctica formativa, desafiante y
				colectiva. Nuestro trabajo impulsa el razonamiento lógico, la resolución de problemas y la
				confianza intelectual de niñas, niños y jóvenes interesados en profundizar en esta área.
			</p>

			<p class="mt-4 text-sm leading-6 text-copy/78">
				Las olimpiadas matemáticas conectan al país con una comunidad internacional de aprendizaje y
				exigencia académica. A través de ellas, estudiantes de diferentes provincias, contextos y
				edades desarrollan disciplina, creatividad y autonomía para enfrentar problemas complejos.
			</p>
		</div>

		<img
			src={imo_2018}
			alt="Delegación ecuatoriana durante la IMO 2018"
			class="mx-auto aspect-4/3 w-full rounded-2xl object-cover"
		/>
	</ContentSection>

	<ContentSection>
		<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
			{#each values_cards as card (card.number)}
				<article class="rounded-2xl border border-primary/30 bg-white px-5 py-4">
					<p class="text-5xl leading-none font-semibold tracking-tighter text-primary">
						{card.number}
					</p>
					<p class="mt-4 text-xs font-semibold tracking-widest text-primary uppercase">
						{card.eyebrow}
					</p>
					<h3 class="mt-3 text-lg leading-tight font-semibold">{card.title}</h3>
					<p class="mt-3 text-sm leading-6 text-copy/72">{card.description}</p>
				</article>
			{/each}
		</div>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Miembros" />
		<MembersSection class="mt-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3" {members} />
	</ContentSection>
</PageSectionStack>

<TrainingCtaSection />
