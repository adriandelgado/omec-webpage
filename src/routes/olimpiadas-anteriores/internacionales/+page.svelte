<script lang="ts">
	import logo_imo from "$lib/assets/logo-imo.svg";
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import Seo from "$lib/components/seo.svelte";

	const medal_summary = [
		{
			olympiad: "IMO - Olimpiada Internacional de Matemática",
			years: "2001-2025",
			participants: 24,
			gold: "-",
			silver: "-",
			bronze: 4,
			mentions: 20,
		},
		{
			olympiad: "Cono Sur - Olimpiada Matemática del Cono Sur",
			years: "2000-2025",
			participants: 26,
			gold: 2,
			silver: 5,
			bronze: 12,
			mentions: 15,
		},
		{
			olympiad: "OIM - Olimpiada Iberoamericana de Matemática",
			years: "1998-2025",
			participants: 27,
			gold: "-",
			silver: 2,
			bronze: 8,
			mentions: 17,
		},
	] as const;

	const medallero_columns = ["Olimpiada", "🥇 Oro", "🥈 Plata", "🥉 Bronce", "Menciones"] as const;
</script>

<Seo
	title="Olimpiadas Anteriores Internacionales"
	description="Revisa la participación internacional de Ecuador en olimpiadas matemáticas, con medallero, resultados históricos y resumen de competencias."
/>

<PageSectionStack>
	<section>
		<h2 class="text-center text-3xl leading-none font-medium tracking-tight text-primary">
			Medallero
		</h2>

		<div class="mt-5 overflow-hidden rounded-2xl border border-primary bg-white">
			<div class="overflow-x-auto">
				<table class="min-w-full text-left text-sm text-copy">
					<thead class="bg-primary/8 text-xs font-semibold tracking-wide text-primary uppercase">
						<tr>
							{#each medallero_columns as column (column)}
								<th class="px-4 py-3">{column}</th>
							{/each}
						</tr>
					</thead>

					<tbody class="divide-y divide-primary/70">
						{#each medal_summary as olympiad (olympiad.olympiad)}
							<tr class="align-top transition-colors hover:bg-primary/4">
								<td class="px-4 py-3">
									<p class="font-medium text-copy">{olympiad.olympiad}</p>
									<p class="mt-1 text-xs text-copy/55">
										{olympiad.years} • {olympiad.participants} participaciones
									</p>
								</td>
								<td class="px-4 py-3 text-center">{olympiad.gold}</td>
								<td class="px-4 py-3 text-center">{olympiad.silver}</td>
								<td class="px-4 py-3 text-center">{olympiad.bronze}</td>
								<td class="px-4 py-3 text-center">{olympiad.mentions}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
		<article class="overflow-hidden rounded-3xl border border-primary bg-white shadow-xl">
			<div class="border-b border-primary bg-primary/5 p-3">
				<img
					src={logo_imo}
					alt="Delegación ecuatoriana en una competencia internacional de matemática"
					class="h-56 w-full rounded-2xl object-cover"
				/>
			</div>

			<div class="p-5">
				<h3 class="text-3xl leading-none font-semibold tracking-tighter text-primary">IMO</h3>
				<p class="mt-1 text-lg leading-tight font-medium text-primary">
					Olimpiada Internacional de Matemática
				</p>
				<p class="mt-3 text-xs tracking-wider text-copy/45 uppercase">
					2001-2025 • 24 participaciones
				</p>
				<p class="mt-4 max-w-85 text-sm leading-relaxed text-copy/75">
					La olimpiada internacional de matemáticas es el certamen mundial en el que participan
					alrededor de 100 países de todos los continentes del mundo.
				</p>
			</div>
		</article>

		<div class="pt-1">
			<h2 class="text-3xl leading-none font-medium tracking-tight text-primary">
				Conoce las olimpiadas
			</h2>
			<p class="mt-4 max-w-120 text-sm leading-relaxed text-copy/75">
				Estas son algunas de las olimpiadas en las que Ecuador participa a nivel internacional. Los
				ganadores de la ONM del año previo son convocados a los selectivos de estas competencias y
				tendrán una oportunidad de formar parte de la delegación de Ecuador en esas olimpiadas,
				dependiendo de su edad y género.
			</p>
		</div>
	</section>
</PageSectionStack>
