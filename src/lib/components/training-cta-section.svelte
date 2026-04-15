<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<section class="px-4 py-0 lg:px-0">
	<div class="bg-primary px-4 py-9 text-center text-white lg:px-6 lg:py-11">
		<div class="mx-auto max-w-170">
			<h2 class="text-3xl leading-none font-semibold tracking-tighter">
				¿Listo para comenzar tu camino matemático?
			</h2>
			<p class="mx-auto mt-4 max-w-130 text-sm leading-7 text-white/82">
				Inscríbete en uno de nuestros programas y comienza a desarrollar tu potencial junto a los
				mejores entrenadores del país.
			</p>
			<a
				href={resolve("/nosotros")}
				class="mt-6 inline-flex h-10 items-center justify-center rounded-sm bg-white px-5 text-sm font-medium text-primary transition-colors hover:bg-white/90"
			>
				Inscribirse Ahora
			</a>
		</div>
	</div>
</section>
