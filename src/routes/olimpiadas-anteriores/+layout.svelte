<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import SectionHeading from "$lib/components/section-heading.svelte";

	let { children } = $props();

	const historical_routes = [
		{
			label: "Olimpiadas internacionales",
			href: "/olimpiadas-anteriores/internacionales",
		},
		{
			label: "Olimpiadas nacionales",
			href: "/olimpiadas-anteriores/nacionales",
		},
	] as const;
</script>

<svelte:head>
	<title>Olimpiadas Anteriores | OMEC</title>
</svelte:head>

<section class="border-b border-line px-4 pt-8 pb-8 lg:px-6 lg:pt-10 lg:pb-10">
	<div class="mx-auto max-w-270">
		<h1 class="text-4xl leading-none font-semibold tracking-tighter text-copy lg:text-5xl">
			<span class="block">Olimpiadas</span>
			<span class="block text-primary">Anteriores</span>
		</h1>

		<p class="mt-4 max-w-175 text-sm leading-6 text-copy/75">
			Histórico completo de participaciones ecuatorianas en olimpiadas matemáticas nacionales e
			internacionales, incluyendo resultados, medallas y menciones honoríficas desde 1988.
		</p>
	</div>
</section>

<section class="px-4 py-8 lg:px-6 lg:pb-10">
	<div class="mx-auto max-w-270">
		<div class="border-b border-line pb-4">
			<SectionHeading title="Históricos" />

			<nav aria-label="Históricos de olimpiadas" class="mt-5 border-b border-line/80">
				<div class="flex flex-wrap gap-5 text-sm font-medium">
					{#each historical_routes as route (route.href)}
						<a
							href={resolve(route.href)}
							aria-current={page.url.pathname === route.href ? "page" : undefined}
							class={[
								"border-b px-1 pb-2 transition-colors",
								page.url.pathname === route.href
									? "border-primary text-primary"
									: "border-transparent text-copy/45 hover:text-primary",
							]}
						>
							{route.label}
						</a>
					{/each}
				</div>
			</nav>
		</div>

		<div class="pt-5">
			{@render children()}
		</div>
	</div>
</section>
