<script lang="ts">
	import imo_classic from "$lib/assets/imo-classic.png";

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
			olympiad: "OMCC - Olimpiada Matemática de Centroamérica y el Caribe",
			years: "2006-2025",
			participants: 28,
			gold: 1,
			silver: 4,
			bronze: 9,
			mentions: 16,
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

<div class="space-y-8">
	<section>
		<h2 class="text-center text-[28px] leading-none font-medium tracking-[-0.03em] text-primary">
			Medallero
		</h2>

		<div class="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
			<div class="overflow-x-auto">
				<table class="min-w-full text-left text-[12px] text-copy">
					<thead
						class="bg-primary/8 text-[11px] font-semibold tracking-[0.08em] text-primary uppercase"
					>
						<tr>
							{#each medallero_columns as column (column)}
								<th class="px-4 py-3">{column}</th>
							{/each}
						</tr>
					</thead>

					<tbody class="divide-y divide-line/70">
						{#each medal_summary as olympiad (olympiad.olympiad)}
							<tr class="align-top transition-colors hover:bg-primary/4">
								<td class="px-4 py-3">
									<p class="font-medium text-copy">{olympiad.olympiad}</p>
									<p class="mt-1 text-[11px] text-copy/55">
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
		<article
			class="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_40px_rgba(45,103,255,0.08)]"
		>
			<div class="border-b border-line bg-primary/5 p-3">
				<img
					src={imo_classic}
					alt="Delegación ecuatoriana en una competencia internacional de matemática"
					class="h-56 w-full rounded-[18px] object-cover"
				/>
			</div>

			<div class="p-5">
				<h3 class="text-[26px] leading-[0.95] font-semibold tracking-[-0.04em] text-primary">
					IMO
				</h3>
				<p class="mt-1 text-[18px] leading-tight font-medium text-primary">
					Olimpiada Internacional de Matemática
				</p>
				<p class="mt-3 text-[11px] tracking-[0.12em] text-copy/45 uppercase">
					2001-2025 • 24 participaciones
				</p>
				<p class="mt-4 max-w-85 text-[12px] leading-[1.6] text-copy/75">
					La olimpiada internacional de matemáticas es el certamen mundial en el que participan
					alrededor de 100 países de todos los continentes del mundo.
				</p>
			</div>
		</article>

		<div class="pt-1">
			<h2 class="text-[30px] leading-none font-medium tracking-[-0.03em] text-primary">
				Conoce las olimpiadas
			</h2>
			<p class="mt-4 max-w-120 text-[12px] leading-[1.65] text-copy/75">
				Estas son algunas de las olimpiadas en las que Ecuador participa a nivel internacional. Los
				ganadores de la ONM del año previo son convocados a los selectivos de estas competencias y
				tendrán una oportunidad de formar parte de la delegación de Ecuador en esas olimpiadas,
				dependiendo de su edad y género.
			</p>
		</div>
	</section>
</div>
