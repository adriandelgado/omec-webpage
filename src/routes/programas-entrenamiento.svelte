<script lang="ts">
	import blocks from "$lib/assets/blocks.svg";
	import hexagon from "$lib/assets/hexagon.svg";
	import triangle from "$lib/assets/triangle.svg";
	import circle from "$lib/assets/circle.svg";
	import triangle_center_gravity from "$lib/assets/triangle-center-gravity.svg";

	const program_cards = [
		{
			title: "Entrenamiento Presencial",
			description:
				"Sesiones intensivas con entrenadores certificados en diferentes ciudades del país.",
			icon: hexagon,
			icon_alt: "Ícono de hexágono",
			bullets: ["Clases semanales", "Material didáctico", "Problemas de práctica"],
		},
		{
			title: "Entrenamiento Presencial",
			description:
				"Sesiones intensivas con entrenadores certificados en diferentes ciudades del país.",
			icon: triangle,
			icon_alt: "Ícono de triángulo",
			bullets: ["Clases semanales", "Material didáctico", "Problemas de práctica"],
		},
		{
			title: "Programa Virtual",
			description: "Plataforma online con clases en vivo y recursos digitales disponibles 24/7.",
			icon: circle,
			icon_alt: "Ícono de círculo",
			bullets: ["Clases en línea", "Biblioteca virtual", "Evaluaciones continuas"],
		},
	];
</script>

<section class="relative overflow-hidden px-5 py-8 sm:px-8 lg:px-16 lg:py-10">
	<div class="mx-auto max-w-305">
		<div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
			<p
				class="max-w-165 text-[1.05rem] leading-[1.7] font-medium tracking-[0.02em] text-slate-600"
			>
				Ofrecemos programas de entrenamiento diseñados para desarrollar habilidades matemáticas
				desde nivel básico hasta competencia internacional. Nuestros entrenadores son medallistas
				olímpicos y profesores universitarios con amplia experiencia.
			</p>

			<img
				src={blocks}
				alt=""
				class="pointer-events-none w-42.5 self-end opacity-95 sm:w-52.5 lg:mr-10 lg:w-72.5"
			/>
		</div>

		<div class="mt-14 grid gap-7 lg:grid-cols-3 lg:gap-6">
			{#each program_cards as card (card.title + card.icon_alt)}
				<div class="relative px-3 pb-3">
					<div
						aria-hidden="true"
						class="absolute inset-x-0 top-3 bottom-0 rounded-[14px] border-2 border-blue-600 bg-blue-600"
					></div>

					<article
						class="relative flex h-full min-h-82.5 flex-col rounded-[14px] border-2 border-blue-500 bg-[#f7f8fb] px-6 py-7 text-slate-700"
					>
						<img src={card.icon} alt={card.icon_alt} class="h-12 w-12 object-contain" />

						<h2 class="mt-6 max-w-[14ch] text-[2rem] leading-[1.08] font-medium text-slate-700">
							{card.title}
						</h2>

						<p class="mt-5 max-w-[30ch] text-[1.05rem] leading-[1.55] text-slate-500">
							{card.description}
						</p>

						<ul class="mt-4 space-y-2.5 text-[1.05rem] leading-[1.45] text-slate-500">
							{#each card.bullets as bullet (bullet)}
								<li class="flex items-start gap-3">
									<span class="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-blue-600"></span>
									<span>{bullet}</span>
								</li>
							{/each}
						</ul>
					</article>
				</div>
			{/each}
		</div>
	</div>

	<img
		src={triangle_center_gravity}
		alt=""
		class="pointer-events-none mt-8 w-27.5 opacity-95 sm:w-32.5 lg:absolute lg:bottom-6 lg:left-2 lg:mt-0 lg:w-41.25"
	/>
</section>
