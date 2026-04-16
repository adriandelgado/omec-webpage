<script lang="ts">
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import Seo from "$lib/components/seo.svelte";

	const national_results = [
		{
			participant: "Paul Atreides",
			school: "Colegio Dune",
			level: "Senior",
			points: 42,
			gold: "-",
			silver: "-",
			bronze: 1,
			mentions: "-",
		},
		{
			participant: "Kyle Scheible",
			school: "Javier",
			level: "Senior",
			points: 40,
			gold: "-",
			silver: "-",
			bronze: 4,
			mentions: "-",
		},
		{
			participant: "Ana Lucía Garcés",
			school: "La Condamine",
			level: "Intermedio",
			points: 38,
			gold: "-",
			silver: 1,
			bronze: "-",
			mentions: "-",
		},
		{
			participant: "Matías Ordoñez",
			school: "Alemán",
			level: "Junior",
			points: 36,
			gold: "-",
			silver: "-",
			bronze: 1,
			mentions: 1,
		},
		{
			participant: "Sofía Almeida",
			school: "Británico",
			level: "Junior",
			points: 35,
			gold: "-",
			silver: 1,
			bronze: "-",
			mentions: "-",
		},
		{
			participant: "Martín Cevallos",
			school: "Spellman",
			level: "Intermedio",
			points: 34,
			gold: "-",
			silver: "-",
			bronze: 1,
			mentions: "-",
		},
		{
			participant: "Camila Donoso",
			school: "Pensionado Universitario",
			level: "Senior",
			points: 33,
			gold: "-",
			silver: "-",
			bronze: "-",
			mentions: 1,
		},
		{
			participant: "Nicolás Pérez",
			school: "Americano",
			level: "Intermedio",
			points: 32,
			gold: "-",
			silver: "-",
			bronze: 1,
			mentions: "-",
		},
		{
			participant: "Valentina Jarrín",
			school: "Einstein",
			level: "Junior",
			points: 31,
			gold: "-",
			silver: "-",
			bronze: "-",
			mentions: 1,
		},
		{
			participant: "Joaquín Freire",
			school: "24 de Mayo",
			level: "Junior",
			points: 30,
			gold: "-",
			silver: "-",
			bronze: 1,
			mentions: "-",
		},
		{
			participant: "Elena Mena",
			school: "Liceo Internacional",
			level: "Senior",
			points: 29,
			gold: "-",
			silver: 1,
			bronze: "-",
			mentions: "-",
		},
		{
			participant: "Sebastián Ruales",
			school: "Montúfar",
			level: "Intermedio",
			points: 28,
			gold: "-",
			silver: "-",
			bronze: "-",
			mentions: 1,
		},
	] as const;

	const national_columns = [
		"Participante",
		"Colegio",
		"Nivel",
		"Puntos",
		"🥇 Oro",
		"🥈 Plata",
		"🥉 Bronce",
		"Menciones",
	] as const;
</script>

<Seo
	title="Olimpiadas Anteriores Nacionales"
	description="Consulta resultados históricos de olimpiadas matemáticas nacionales de Ecuador, incluyendo participantes, puntajes, niveles y medallas."
/>

<PageSectionStack>
	<p class="text-xs tracking-wider text-copy/45 uppercase">
		Max puntaje: 42 pts • Participantes: {national_results.length}
	</p>

	<div class="overflow-hidden rounded-2xl border border-primary bg-white">
		<div class="overflow-x-auto">
			<table class="min-w-full text-left text-sm">
				<thead class="bg-primary/8 text-xs font-semibold tracking-wide text-primary uppercase">
					<tr>
						{#each national_columns as column (column)}
							<th class="px-4 py-3">{column}</th>
						{/each}
					</tr>
				</thead>

				<tbody class="divide-y divide-primary/70">
					{#each national_results as result (result.participant + result.school)}
						<tr class="transition-colors hover:bg-primary/4">
							<td class="px-4 py-3 whitespace-nowrap">{result.participant}</td>
							<td class="px-4 py-3 whitespace-nowrap">{result.school}</td>
							<td class="px-4 py-3 whitespace-nowrap">{result.level}</td>
							<td class="px-4 py-3 whitespace-nowrap">{result.points}</td>
							<td class="px-4 py-3 text-center whitespace-nowrap">{result.gold}</td>
							<td class="px-4 py-3 text-center whitespace-nowrap">{result.silver}</td>
							<td class="px-4 py-3 text-center whitespace-nowrap">{result.bronze}</td>
							<td class="px-4 py-3 text-center whitespace-nowrap">{result.mentions}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</PageSectionStack>
