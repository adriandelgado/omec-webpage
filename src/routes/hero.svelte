<script lang="ts">
	import hero_image from "$lib/assets/hero.png";
</script>

<section class="overflow-hidden" aria-labelledby="hero-title">
	<div
		class="mx-auto grid min-h-185.5 max-w-480 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.2fr)] lg:gap-6 lg:px-16 xl:px-20"
	>
		<div class="flex max-w-175 flex-col justify-center self-center pt-4 lg:pl-8 xl:pl-12">
			<h1 id="hero-title" class="max-w-160 text-[3.75rem] leading-[0.9] font-bold text-slate-950">
				<span class="block">Olimpiada</span>
				<span class="block">Matemática</span>
				<span class="block text-blue-600">Ecuatoriana</span>
			</h1>

			<p class="mt-10 max-w-155 text-[1.5rem] leading-[1.42] font-medium text-slate-800">
				Desarrollando el talento matemático de los estudiantes ecuatorianos y promoviendo la
				excelencia académica
			</p>
		</div>

		<div class="relative flex min-h-110 items-center justify-center self-stretch lg:min-h-170">
			<div
				class="absolute inset-y-0 right-[-14vw] -left-16 bg-[linear-gradient(to_right,rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.12)_1px,transparent_1px)] bg-size-[82px_82px] bg-position-[0_10px] lg:right-[-10vw] lg:-left-24 xl:right-[-6vw]"
				aria-hidden="true"
			></div>
			<div class="absolute inset-y-0 left-[24%] w-px bg-blue-200/40" aria-hidden="true"></div>

			<div class="relative z-10 w-full max-w-245 translate-x-[4%] lg:translate-x-[6%]">
				<img
					src={hero_image}
					alt="Problema de geometría olímpica"
					class="block h-auto w-full object-contain select-none"
				/>
			</div>
		</div>
	</div>
</section>
