<script lang="ts">
	import imo_classic from "$lib/assets/imo-classic.svg";
	import imo_knot from "$lib/assets/imo-knot.svg";
	import imo_geometry from "$lib/assets/imo-geometry.svg";
	import olimpiada_de_mayo from "$lib/assets/olimpiada-de-mayo.svg";

	const international_achievements = [
		{
			id: "classic",
			image: imo_classic,
			title: "IMO – Olimpiada Mundial",
			description: "Participación y medallistas a nivel global",
			stats: [
				{ value: "1", label: "BRONCE", tone: "bronze" },
				{ value: "10+", label: "HON.", tone: "honorable" },
			],
		},
		{
			id: "knot",
			image: imo_knot,
			title: "IMO – Olimpiada Mundial",
			description: "Participación y medallistas a nivel global",
			stats: [
				{ value: "1", label: "BRONCE", tone: "bronze" },
				{ value: "10+", label: "HON.", tone: "honorable" },
			],
		},
		{
			id: "geometry",
			image: imo_geometry,
			title: "IMO – Olimpiada Mundial",
			description: "Participación y medallistas a nivel global",
			stats: [
				{ value: "1", label: "BRONCE", tone: "bronze" },
				{ value: "10+", label: "HON.", tone: "honorable" },
			],
		},
		{
			id: "may",
			image: olimpiada_de_mayo,
			title: "IMO – Olimpiada Mundial",
			description: "Participación y medallistas a nivel global",
			stats: [
				{ value: "1", label: "BRONCE", tone: "bronze" },
				{ value: "10+", label: "HON.", tone: "honorable" },
			],
		},
	] as const;
</script>

<section class="px-5 py-12 sm:px-8 lg:px-16 lg:py-16" aria-label="Logros internacionales">
	<div class="mx-auto max-w-472">
		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
			{#each international_achievements as achievement (achievement.id)}
				<article
					class="rounded-[1.35rem] border-2 border-blue-500 bg-white px-7 py-8 shadow-[0_18px_48px_-34px_rgba(37,99,235,0.45)]"
				>
					<div class="flex min-h-44 items-center justify-center">
						<img src={achievement.image} alt="" class="h-34 w-full max-w-56 object-contain" />
					</div>

					<div class="mt-4 text-center">
						<h2 class="mx-auto max-w-[10ch] text-[2rem] leading-[1.15] font-normal text-blue-600">
							{achievement.title}
						</h2>
						<p
							class="mx-auto mt-3 max-w-[12ch] text-[1rem] leading-[1.65] tracking-[0.12em] text-slate-900 uppercase sm:text-[1.05rem]"
						>
							{achievement.description}
						</p>
					</div>

					<div class="mt-8 flex items-start justify-center gap-5">
						{#each achievement.stats as stat (stat.label)}
							<div class="flex min-w-16 flex-col items-center">
								<div
									class={[
										"flex h-11 w-11 items-center justify-center rounded-full text-[1.45rem] leading-none font-medium",
										stat.tone === "bronze"
											? "bg-[#d08231] text-slate-950"
											: "bg-slate-100 text-slate-700",
									]}
								>
									{stat.value}
								</div>
								<p class="mt-3 text-sm font-medium tracking-tight text-slate-950">
									{stat.label}
								</p>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
