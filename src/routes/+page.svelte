<script lang="ts">
	import { resolve } from "$app/paths";
	import { Icon } from "lucide-svelte";
	import {
		Trophy,
		BookOpen,
		Earth,
		Users,
		Calendar,
		Award,
		Facebook,
		Instagram,
	} from "lucide-svelte";

	const stats = [
		{ icon: Calendar, label: "Desde", value: "1997" },
		{ icon: Users, label: "Participantes", value: "1000+" },
		{ icon: Trophy, label: "Niveles", value: "6" },
		{ icon: Earth, label: "Competencias", value: "Internacional" },
	];

	const sections = [
		{
			icon: BookOpen,
			title: "Información",
			description: "Conoce todo sobre la Olimpiada Nacional de Matemáticas",
			href: "/nacional",
		},
		{
			icon: Trophy,
			title: "Preparación",
			description: "Accede a problemas anteriores y material de entrenamiento",
			href: "/entrenamiento",
		},
		{
			icon: Award,
			title: "Noticias",
			description: "Mantente al día con convocatorias y resultados",
			href: "/blog",
		},
	] as const;
</script>

<svelte:head>
	<title>Olimpiada Matemática Ecuatoriana (OMEC)</title>
	<meta
		name="description"
		content="Detectando, formando y preparando talentos matemáticos desde 1997. Participa en la Olimpiada Nacional de Matemáticas y representa al Ecuador a nivel internacional."
	/>
</svelte:head>

<!-- Hero Section -->
<section
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-20 text-white"
>
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-white blur-3xl"></div>
		<div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-white blur-3xl"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-6xl text-center">
		<img src="/logo.svg" alt="OMEC Logo" class="mx-auto mb-8 h-32 w-32" />

		<h1 class="mb-6 text-5xl font-bold md:text-7xl">Olimpiada Matemática Ecuatoriana</h1>

		<p class="mb-8 text-xl font-light md:text-2xl">Encontrando talentos matemáticos desde 1997</p>

		<div class="mx-auto mb-12 max-w-3xl rounded-lg bg-white/10 p-6 backdrop-blur-sm">
			<p class="text-lg leading-relaxed">
				La fase final de la ONM será el <strong>9 y 10 de enero</strong>. Los resultados de la
				segunda fase fueron enviados a los correos.
			</p>
		</div>

		<div class="flex flex-wrap justify-center gap-4">
			<a
				href={resolve("/nacional")}
				class="rounded-lg bg-white px-8 py-4 font-semibold text-blue-700 transition-transform hover:scale-105"
			>
				Inscríbete ahora
			</a>
			<a
				href={resolve("/entrenamiento")}
				class="rounded-lg border-2 border-white px-8 py-4 font-semibold transition-colors hover:bg-white/10"
			>
				Material de estudio
			</a>
		</div>

		<!-- Stats Grid -->
		<div class="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
			{#each stats as stat (stat.label)}
				<div class="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
					<Icon icon={stat.icon} class="mx-auto mb-2 h-8 w-8" />
					<div class="text-3xl font-bold">{stat.value}</div>
					<div class="text-sm text-blue-200">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Quick Access Section -->
<section class="bg-gray-50 px-4 py-20">
	<div class="mx-auto max-w-6xl">
		<div class="grid gap-8 md:grid-cols-3">
			{#each sections as section (section.href)}
				<a
					href={resolve(section.href)}
					class="group rounded-xl bg-white p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
				>
					<Icon icon={section.icon} class="mb-4 h-12 w-12 text-blue-600" />
					<h3 class="mb-2 text-2xl font-bold text-gray-900">
						{section.title}
					</h3>
					<p class="text-gray-600">{section.description}</p>
					<span class="mt-4 inline-block font-semibold text-blue-600 group-hover:underline">
						Ver más →
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- About Section -->
<section class="px-4 py-20">
	<div class="mx-auto max-w-6xl">
		<div class="grid items-center gap-12 md:grid-cols-2">
			<div>
				<h2 class="mb-6 text-4xl font-bold text-gray-900">Acerca de Nosotros</h2>
				<h3 class="mb-4 text-2xl font-semibold text-blue-600">
					Encontrando Talentos Matemáticos desde 1997
				</h3>
				<p class="mb-4 text-lg leading-relaxed text-gray-700">
					Desde 1997 la <strong>Olimpiada Matemática Ecuatoriana (OMEC)</strong>
					se encarga de detectar, formar y preparar los talentos matemáticos que conforman los equipos
					que representarán al país en varias competencias olímpicas.
				</p>
				<p class="mb-6 text-lg leading-relaxed text-gray-700">
					Entre ellas el <strong>Mundial de Matemáticas (IMO)</strong>, la
					<strong>Olimpiada Europea Femenina de Matemáticas (EGMO)</strong>, la
					<strong>Olimpiada de Matemáticas de Asia-Pacífico (APMO)</strong>, y la Olimpiada de
					Matemáticas de países del <strong>Cono Sur</strong>.
				</p>
				<a
					href={resolve("/acerca")}
					class="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
				>
					Conocer más
				</a>
			</div>
			<div class="relative">
				<img src="/team-photo.jpg" alt="Equipo OMEC" class="rounded-xl shadow-2xl" />
			</div>
		</div>
	</div>
</section>

<!-- ONM Info Section -->
<section class="bg-blue-600 px-4 py-20 text-white">
	<div class="mx-auto max-w-6xl text-center">
		<h2 class="mb-12 text-4xl font-bold">Nuestra Olimpiada Nacional de Matemáticas</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
				<div class="mb-4 text-5xl">🏫</div>
				<h3 class="mb-2 text-xl font-semibold">Participación Nacional</h3>
				<p class="text-blue-100">
					Participan colegios de todo el Ecuador. También se puede participar de manera
					independiente.
				</p>
			</div>

			<div class="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
				<div class="mb-4 text-5xl">🎓</div>
				<h3 class="mb-2 text-xl font-semibold">Todos los Niveles</h3>
				<p class="text-blue-100">Concursantes de primaria, secundaria y universidades</p>
			</div>

			<div class="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
				<div class="mb-4 text-5xl">🌎</div>
				<h3 class="mb-2 text-xl font-semibold">Alcance Nacional</h3>
				<p class="text-blue-100">Abierto a todas las provincias del Ecuador</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-16">
	<div class="mx-auto max-w-4xl text-center text-white">
		<h2 class="mb-4 text-3xl font-bold">No te pierdas de inscripciones y fechas importantes</h2>
		<p class="mb-8 text-xl">Síguenos en nuestras redes sociales</p>

		<div class="flex flex-wrap justify-center gap-4">
			<a
				href="https://www.facebook.com/OlimpiadaMatematicaEcuatoriana"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
			>
				<Icon icon={Facebook} class="h-5 w-5" />
				Facebook
			</a>
			<a
				href="https://www.instagram.com/omec.mat"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
			>
				<Icon icon={Instagram} class="h-5 w-5" />
				Instagram
			</a>
		</div>
	</div>
</section>
