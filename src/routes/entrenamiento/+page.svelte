<script lang="ts">
	import { ExternalLink } from "@lucide/svelte";
	import training_calendar from "#lib/assets/entrenamiento/training-calendar.png";
	import logo_egmo from "#lib/assets/logos/egmo.svg";
	import logo_omec from "#lib/assets/logos/omec.svg";
	import training_tutoring from "#lib/assets/entrenamiento/training-tutoring.png";
	import Card from "#lib/components/card.svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageIntro from "#lib/components/page-intro.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";

	const title = "Entrenamiento";

	const training_materials = [
		{
			id: "estudio-a-profundidad",
			title: "Estudio a profundidad",
			description: "Temario a fondo de teoría de números y álgebra. Incluye temas avanzados.",
			image: logo_omec,
			image_alt: "Logotipo de la Olimpiada Matemática Ecuatoriana",
			href: "https://drive.google.com/drive/folders/1PkZNnvenS0Bt9siJlsH8XTa7iEZOVcHj",
		},
		{
			id: "olimpiada-nacional",
			title: "Olimpiada Nacional de Matemáticas",
			description:
				"Esta carpeta incluye los problemas y soluciones de todos los niveles de las ONM 2016 – 2019",
			image: logo_omec,
			image_alt: "Logotipo de la Olimpiada Matemática Ecuatoriana",
			href: "https://drive.google.com/drive/folders/1uHvRIcHWBflcFO0LajeEoJJoS2e8fNVi",
		},
		{
			id: "olimpiadas-internacionales",
			title: "Olimpiadas Internacionales",
			description:
				"Esta carpeta incluye pruebas pasadas de: IMO, EGMO, Cono Sur, Olimpiada de Mayo, CIIM y APMO",
			image: logo_egmo,
			image_alt: "Logotipo de la Olimpiada Europea Femenina de Matemáticas",
			href: "https://drive.google.com/drive/folders/1z2aMiN57ITnnd7oZOtvENsOjDWdRaSkY?usp=sharing",
		},
		{
			id: "pruebas-selectivas",
			title: "Pruebas selectivas",
			description:
				"Esta carpeta incluye las pruebas selectivas que se llevan a cabo cada año con el fin de seleccionar al equipo Ecuatoriano que participará a nivel internacional.",
			image: training_tutoring,
			image_alt: "Ilustración de tutoría matemática",
			href: "https://drive.google.com/drive/folders/1o_tWnaBMD_0B54bZqVKEHmkFZzP9bHAi?usp=sharing",
		},
		{
			id: "listas-semanales",
			title: "Listas semanales",
			description:
				"Esta carpeta incluye las listas semanales OMEC. Estas listas fueron dadas cada semana entre 2013-2015. Hay de distintos niveles.",
			image: training_calendar,
			image_alt: "Ícono de calendario",
			href: "https://drive.google.com/drive/folders/1yhcXrcbxDZ2fMJtt--jiCUvn4Obog4Yk?usp=sharing",
		},
	] as const;
</script>

<Seo
	{title}
	description="Material de entrenamiento de OMEC para prepararse para competencias matemáticas nacionales e internacionales."
/>

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<PageIntro
			title_lines={[{ text: title, class: "text-primary" }]}
			description="Nuestro material de entrenamiento"
		/>
	</ContentSection>

	<ContentSection>
		<SectionHeading
			title="Prepárate para las competencias"
			description="La mejor manera de perpararse para concursos de matemáticas es resolviendo pruebas pasadas. En nuestro banco de problemas podrás encontrar problemas de competencias nacionales e internacionales. Asegúrate de practicar con problemas de tu nivel académico y de la competencia para la cual te estás preparando. Al hacer clic serás redirigido a una carpeta de Google Drive."
		/>

		<div class="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each training_materials as material (material.id)}
				<Card class="flex min-h-96 flex-col overflow-hidden">
					<div class="flex h-36 items-center justify-center bg-foreground px-6 py-5">
						<img
							src={material.image}
							alt={material.image_alt}
							loading="lazy"
							decoding="async"
							class="h-full w-full object-contain"
						/>
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
