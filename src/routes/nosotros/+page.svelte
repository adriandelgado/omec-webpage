<script lang="ts">
	import { Bell, ShieldAlert } from "@lucide/svelte";
	import fernando_gomez from "#lib/assets/nosotros/fernando-gomez.jpg?enhanced";
	import imo_2018 from "#lib/assets/nosotros/imo-2018.jpg";
	import lucero_llanos from "#lib/assets/nosotros/lucero-llanos.jpg?enhanced";
	import pablo_serrano from "#lib/assets/nosotros/pablo-serrano.jpg?enhanced";
	import pedro_suarez from "#lib/assets/nosotros/pedro-suarez.png?enhanced";
	import valeria_santana from "#lib/assets/nosotros/valeria-santana.jpeg?enhanced";
	import ContentSection from "#lib/components/content-section.svelte";
	import MembersSection from "#lib/components/members-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";
	import TrainingCtaSection from "#lib/components/training-cta-section.svelte";

	const title = "Acerca de nosotros";

	const values_cards = [
		{
			number: "01",
			title: "Nuestra misión",
			description:
				"Desarrollar el talento matemático mediante competencias académicas y experiencias de aprendizaje. Nuestro compromiso es proporcionar las herramientas necesarias para competir al más alto nivel, mientras cultivamos valores que trascienden el ámbito académico.",
		},
		{
			number: "02",
			title: "Nuestra visión",
			description:
				"Consolidarnos como un referente del desarrollo científico y cultural en Ecuador y América Latina, promoviendo una comunidad matemática reconocida por su excelencia académica, liderazgo, calidad humana y compromiso con la sociedad.",
		},
		{
			number: "03",
			title: "Nuestros valores",
			values: [
				"Altruismo académico",
				"Auto aprendizaje",
				"Equidad",
				"Honestidad",
				"Transparencia",
				"Trabajo en equipo",
			],
		},
	] as const;

	const members = [
		"Adrián Delgado",
		"Adrián Cerda",
		"Anthony Flores",
		"Ana Indacochea",
		"Arody Carlosama",
		"Cristhyan Cayetano",
		"Daniel Suárez",
		"Eduardo Arteaga",
		"Emilio Zamora",
		"Fernando Gómez",
		"Giacomo Yu",
		"Gratzia Indacochea",
		"Jahir Cajas",
		"Jordie Astudillo",
		"Keny Carlosama",
		"Lucero Llanos",
		"Marcelo Rodríguez",
		"Mauricio Cevallos",
		"Melvin Poveda",
		"Mia Dunn",
		"Miguel Guzmán",
		"Pablo Serrano",
		"Pedro Suárez",
		"Romnie Acosta",
		"Samantha Carrillo",
		"Santiago Velázquez",
		"Sebastián Regalado",
		"Valentina Ulloa",
		"Valeria Santana",
		"Víctor Marriott",
	] as const;

	const directors = [
		{
			id: "fernando-gomez",
			name: "Fernando Gómez",
			role: "Director académico",
			image: fernando_gomez,
			image_alt: "Retrato de Fernando Gómez, director académico de OMEC",
		},
		{
			id: "pablo-serrano",
			name: "Pablo Serrano",
			role: "Director general",
			image: pablo_serrano,
			image_alt: "Retrato de Pablo Serrano, director general de OMEC",
		},
		{
			id: "lucero-llanos",
			name: "Lucero Llanos",
			role: "Directora de comunicación",
			image: lucero_llanos,
			image_alt: "Retrato de Lucero Llanos, directora de comunicación de OMEC",
		},
		{
			id: "valeria-santana",
			name: "Valeria Santana",
			role: "Tesorera",
			image: valeria_santana,
			image_alt: "Retrato de Valeria Santana, tesorera de OMEC",
		},
		{
			id: "pedro-suarez",
			name: "Pedro Suárez",
			role: "Relaciones Interinstitucionales",
			contact: "pedro.suarez@omec-mat.org",
			image: pedro_suarez,
			image_alt: "Retrato de Pedro Suárez, responsable de Relaciones Interinstitucionales de OMEC",
		},
	] as const;
</script>

<Seo
	{title}
	description="Conoce la labor, misión, visión, valores y miembros de la Olimpiada Matemática Ecuatoriana."
	image={imo_2018}
	image_alt="Delegación ecuatoriana en la Olimpiada Internacional de Matemáticas 2018"
/>

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<h1 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
			{title}
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
						Aviso a la comunidad: Vicente Torres y Jorge Chamaidán ya no forman parte de la OMEC
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
				Acerca de
			</p>
			<h2 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
				Nuestra labor
			</h2>

			<p class="mt-6">
				Descubrir, formar e impulsar el talento matemático para contribuir al desarrollo científico,
				educativo y humano del Ecuador. OMEC existe para abrir oportunidades a estudiantes
				apasionados por las matemáticas, brindándoles espacios donde el conocimiento, la curiosidad
				y el esfuerzo se conviertan en herramientas para alcanzar su máximo potencial.
			</p>
		</div>

		<enhanced:img
			src="#lib/assets/nosotros/imo-2018.jpg"
			alt="Delegación ecuatoriana en la Olimpiada Internacional de Matemáticas 2018"
			sizes="(min-width: 1024px) 60vw, 100vw"
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
		<SectionHeading title="Miembros de la OMEC" />
		<ul
			class="mt-8 grid gap-x-12 gap-y-2 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-15 lg:mt-10 lg:gap-x-20 lg:gap-y-3"
		>
			{#each members as member (member)}
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
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Nuestro Equipo</p>
			<h2 class="mt-3 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
				Conoce a los directores de actividades
			</h2>
		</div>

		<MembersSection members={directors} class="mt-8 sm:grid-cols-2 lg:mt-10" />
	</ContentSection>
</PageSectionStack>

<TrainingCtaSection />
