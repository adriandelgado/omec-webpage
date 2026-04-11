<script lang="ts">
	import { resolve } from "$app/paths";
	import { BadgeCheck, ArrowRight } from "@lucide/svelte";
	import sine from "$lib/assets/sine.svg";

	const olympic_stages = [
		{ label: "Inscripciones", date: "Enero - Febrero" },
		{ label: "Fase Regional", date: "Marzo" },
		{ label: "Fase Nacional", date: "Mayo" },
		{ label: "IMO 2026", date: "Julio" },
	] as const;

	const olympic_editions = [1, 2, 3] as const;
</script>

<section class="px-5 py-12 sm:px-8 lg:px-16 lg:py-16" aria-labelledby="olympic-calendar-title">
	<div class="mx-auto max-w-380">
		<div class="grid gap-6 lg:grid-cols-3">
			{#each olympic_editions as edition (edition)}
				<article
					class="rounded-3xl border-2 border-blue-500 bg-white shadow-[0_22px_50px_-35px_rgba(37,99,235,0.45)]"
				>
					<header
						class="flex items-center justify-between rounded-t-[22px] bg-blue-600 px-5 py-4 text-white sm:px-6"
					>
						<h2
							id={edition === 1 ? "olympic-calendar-title" : undefined}
							class="text-xl leading-none font-medium sm:text-[2rem]"
						>
							Olimpiada Nacional
						</h2>

						<p class="text-xl font-light text-blue-200 sm:text-[2rem]">n={edition}</p>
					</header>

					<div class="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
						{#each olympic_stages as stage (stage.label)}
							<div class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
								<p class="text-lg leading-snug font-semibold text-slate-700 sm:text-[1.2rem]">
									{stage.label}
								</p>
								<p class="text-right text-lg leading-snug text-slate-700 sm:text-[1.2rem]">
									{stage.date}
								</p>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>

		<div
			class="relative mt-10 overflow-hidden rounded-[26px] bg-blue-600 shadow-[0_24px_48px_-26px_rgba(37,99,235,0.65)]"
		>
			<div
				class="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-center lg:px-10"
			>
				<div class="relative z-10">
					<div class="flex items-start gap-3">
						<div
							class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20"
						>
							<BadgeCheck class="h-5 w-5 text-white" aria-hidden="true" />
						</div>

						<div>
							<h3 class="text-3xl leading-tight font-medium text-white sm:text-[2.5rem]">
								Inscripciones Abiertas
							</h3>
							<p class="mt-2 max-w-3xl text-base leading-relaxed text-blue-100 sm:text-xl">
								Regístrate ahora para la temporada 2026 de las Olimpiadas Matemáticas
							</p>
						</div>
					</div>
				</div>

				<div class="relative z-10 flex items-center justify-start lg:justify-end">
					<img
						src={sine}
						alt=""
						aria-hidden="true"
						class="pointer-events-none absolute top-1/2 left-1/2 hidden w-md max-w-none -translate-x-[42%] -translate-y-1/2 opacity-90 lg:block"
					/>
					<a
						href={resolve("/informacion")}
						class="relative inline-flex items-center justify-center gap-3 rounded-[18px] bg-white px-7 py-4 text-lg font-medium text-blue-700 shadow-[0_10px_25px_-18px_rgba(15,23,42,0.85)] transition hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-w-60 sm:text-[1.85rem]"
					>
						<span>Inscríbete Ahora</span>
						<ArrowRight class="h-5 w-5 sm:h-7 sm:w-7" aria-hidden="true" />
					</a>
				</div>
			</div>

			<div
				class="pointer-events-none absolute inset-y-0 right-0 hidden w-[31%] border-l border-blue-400/35 lg:block"
				aria-hidden="true"
			>
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_62%)]"
				></div>
				<div class="absolute inset-y-1/2 right-0 left-0 h-px -translate-y-1/2 bg-blue-400/30"></div>
			</div>
		</div>
	</div>
</section>
