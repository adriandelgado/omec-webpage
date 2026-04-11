<script lang="ts">
	import imo_classic from "$lib/assets/imo-classic.png";

	const gallery_events = Array.from({ length: 8 }, (_, index) => ({
		id: `evento-${index + 1}`,
		title: "Evento 1",
		image: imo_classic,
		image_alt: "Participantes de la olimpiada matemática en formación",
	}));
</script>

<section class="px-5 py-12 sm:px-8 lg:px-16 lg:py-16" aria-labelledby="gallery-title">
	<div class="mx-auto max-w-472">
		<h2 id="gallery-title" class="sr-only">Galería de eventos</h2>

		<div class="grid gap-x-7 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
			{#each gallery_events as event (event.id)}
				<article class="space-y-3">
					<div class="overflow-hidden bg-white">
						<img
							src={event.image}
							alt={event.image_alt}
							class="aspect-[4/2.6] w-full object-cover"
						/>
					</div>

					<p class="text-[1.9rem] leading-none font-normal text-slate-900 sm:text-[2rem]">
						{event.title}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>
