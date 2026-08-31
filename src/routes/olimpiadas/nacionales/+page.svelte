<script lang="ts">
	import { BookOpen, CirclePlay, ExternalLink } from "@lucide/svelte";
	import onm_2019_awards from "#lib/assets/olimpiadas/nacionales/onm-2019-awards.jpg";
	import onm_2019_video_thumbnail from "#lib/assets/olimpiadas/nacionales/onm-2019-video-thumbnail.jpg";
	import Card from "#lib/components/card.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";

	type ParticipationLevel = {
		id: string;
		name: string;
		description: string;
	};

	type Fact = {
		id: string;
		text: string;
	};

	type SocialDestination = {
		id: string;
		label: string;
		href: string;
	};

	const participation_levels: readonly ParticipationLevel[] = [
		{
			id: "nivel-b",
			name: "Nivel B",
			description: "Estudiantes de hasta 5º de Educación Básica",
		},
		{
			id: "nivel-a",
			name: "Nivel A",
			description: "Estudiantes de hasta 7º de Educación Básica",
		},
		{
			id: "nivel-1",
			name: "Nivel 1",
			description: "Estudiantes de hasta 9º de Educación Básica",
		},
		{
			id: "nivel-2",
			name: "Nivel 2",
			description: "Estudiantes de hasta 1º de Bachillerato General Unificado",
		},
		{
			id: "nivel-3",
			name: "Nivel 3",
			description: "Estudiantes de hasta 3º de Bachillerato General Unificado",
		},
		{
			id: "nivel-u",
			name: "Nivel U",
			description: "Estudiantes universitarios",
		},
	] as const;

	const facts: readonly Fact[] = [
		{ id: "levels", text: "6 niveles" },
		{ id: "open", text: "Abierto a todos los estudiantes ecuatorianos" },
		{ id: "problems", text: "Problemas de razonamiento y creatividad" },
		{ id: "fee", text: "Costo de inscripción de $10" },
		{ id: "phases", text: "3 fases: online y presencial" },
	] as const;

	const social_destinations: readonly SocialDestination[] = [
		{
			id: "facebook",
			label: "Facebook",
			href: "https://www.facebook.com/OlimpiadaMatematicaEcuatoriana",
		},
		{ id: "instagram", label: "Instagram", href: "https://www.instagram.com/omec.mat" },
		{ id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@omec.mat" },
	] as const;

	const onm_books_url =
		"https://drive.google.com/drive/folders/1uHvRIcHWBflcFO0LajeEoJJoS2e8fNVi?usp=sharing";
	const onm_2019_video_url =
		"https://www.facebook.com/OlimpiadaMatematicaEcuatoriana/videos/1084803171855869";
</script>

<Seo
	title="Olimpiada Nacional de Matemática"
	description="Información sobre la Olimpiada Nacional de Matemática de OMEC: fechas, niveles de participación, preparación y premios."
/>

<PageSectionStack>
	<section
		class="rounded-2xl border border-primary bg-primary px-5 py-6 text-center text-white shadow-[4px_4px_0_0_var(--color-primary-dark)] lg:px-10 lg:py-8"
	>
		<p class="text-lg leading-7 font-semibold lg:text-xl">
			Las inscripciones de la Olimpiada Nacional de Matemática 2026 se abrirán en septiembre.
		</p>
		<ul class="mt-5 grid gap-3 text-sm font-medium sm:grid-cols-3 sm:gap-4">
			<li class="rounded-md bg-white/12 px-3 py-3">Primera fase: 17 de octubre</li>
			<li class="rounded-md bg-white/12 px-3 py-3">Segunda fase: 7 de noviembre</li>
			<li class="rounded-md bg-white/12 px-3 py-3">Fase final: 11 y 12 de diciembre</li>
		</ul>
	</section>

	<section class="grid gap-5 lg:grid-cols-2">
		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Información</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				¿A quién está dirigido?
			</h2>
			<p class="mt-4 text-sm leading-6 text-copy/75">
				Para participar es necesario ser estudiante regular de cualquier institución educativa del
				país, ya sea de Educación Básica, Bachillerato o Universitarios.
			</p>

			<h3 class="mt-7 text-lg leading-tight font-semibold text-primary">
				Cuándo y cómo inscribirse
			</h3>
			<p class="mt-3 text-sm leading-6 text-copy/75">
				Las inscripciones de la Olimpiada Nacional de Matemática se abren usualmente en los meses de
				junio o julio. La apertura de inscripciones, la convocatoria y los pasos de inscripción se
				publicarán en nuestras redes sociales y esta página web.
			</p>
		</Card>

		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Síguenos</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				No te pierdas las fechas importantes
			</h2>
			<p class="mt-4 text-sm leading-6 text-copy/75">
				Síguenos en Facebook, Instagram o TikTok para estar al tanto de fechas importantes, eventos
				y convocatorias.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				{#each social_destinations as destination (destination.id)}
					<a
						href={destination.href}
						target="_blank"
						rel="noopener noreferrer"
						class="rounded-sm border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						{destination.label}
					</a>
				{/each}
			</div>
		</Card>
	</section>

	<section>
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">Niveles</p>
		<h2 class="mt-3 text-3xl leading-none font-semibold tracking-tighter lg:text-4xl">
			Encuentra tu nivel
		</h2>
		<p class="mt-4 max-w-150 text-sm leading-6 text-copy/75">
			Las categorías de participación se determinan según la edad y el nivel de escolaridad del
			competidor.
		</p>

		<div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each participation_levels as level (level.id)}
				<article class="rounded-md border border-primary/30 bg-white px-5 py-4">
					<h3 class="text-lg leading-none font-semibold tracking-tighter text-primary">
						{level.name}
					</h3>
					<p class="mt-3 text-sm leading-5 text-copy/75">{level.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Preparación</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				Practica con pruebas anteriores
			</h2>
			<p class="mt-4 max-w-125 text-sm leading-6 text-copy/75">
				Te sugerimos prepararte con problemas de concursos pasados. Puedes acceder a pruebas
				anteriores de nuestra competencia haciendo clic en el botón de abajo.
			</p>
			<a
				href={onm_books_url}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-6 inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<BookOpen aria-hidden="true" class="size-4" strokeWidth={2} />
				Ver Libros ONM
				<ExternalLink aria-hidden="true" class="size-4" strokeWidth={2} />
			</a>
		</Card>

		<Card class="p-6">
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">Premios</p>
			<h2 class="mt-3 text-2xl leading-none font-semibold tracking-tighter text-primary">
				¿Qué gano?
			</h2>
			<p class="mt-4 text-sm leading-6 text-copy/75">
				Además de su medalla y reconocimiento, los ganadores de cada nivel recibirán medallas de
				oro, plata y bronce, según su ubicación por puntuaciones obtenidas en la última etapa.
			</p>
			<p class="mt-4 text-sm leading-6 text-copy/75">
				Además de las medallas y los premios respectivos, los ganadores de la Olimpiada Nacional de
				Matemática tendrán la posibilidad de ser invitados a las pruebas selectivas para determinar
				los integrantes de los diferentes equipos que representarán al Ecuador en las competencias
				internacionales.
			</p>
		</Card>
	</section>

	<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
		<div>
			<p class="text-sm font-semibold tracking-widest text-primary uppercase">
				Premiación ONM 2019
			</p>
			<img
				src={onm_2019_awards}
				alt="Estudiantes durante la premiación de la Olimpiada Nacional de Matemática 2019"
				loading="lazy"
				decoding="async"
				class="mt-5 aspect-4/3 w-full rounded-2xl object-cover"
			/>
		</div>

		<a
			href={onm_2019_video_url}
			target="_blank"
			rel="noopener noreferrer"
			class="group relative block overflow-hidden rounded-2xl border border-primary bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			<img
				src={onm_2019_video_thumbnail}
				alt="Vista previa del video de la premiación ONM 2019"
				loading="lazy"
				decoding="async"
				class="aspect-4/3 w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
			/>
			<span class="absolute inset-0 flex items-center justify-center bg-primary/25">
				<span
					class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm"
				>
					<CirclePlay aria-hidden="true" class="size-5" strokeWidth={2} />
					Ver video
				</span>
			</span>
		</a>
	</section>

	<section>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
			{#each facts as fact (fact.id)}
				<div
					class="rounded-md border border-primary/25 bg-primary/5 px-4 py-4 text-center text-sm leading-5 font-semibold text-primary"
				>
					{fact.text}
				</div>
			{/each}
		</div>
	</section>
</PageSectionStack>
