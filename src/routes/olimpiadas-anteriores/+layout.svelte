<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import ContentSection from "$lib/components/content-section.svelte";
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import PageIntro from "$lib/components/page-intro.svelte";
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

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<PageIntro
			title_lines={[{ text: "Olimpiadas" }, { text: "Anteriores", class: "text-primary" }]}
			description="Histórico completo de participaciones ecuatorianas en olimpiadas matemáticas nacionales e internacionales, incluyendo resultados, medallas y menciones honoríficas desde 1988."
		/>
	</ContentSection>

	<ContentSection>
		<SectionHeading title="Históricos" />

		<nav aria-label="Históricos de olimpiadas" class="mt-5 border-b border-primary/80">
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

		<div class="pt-5">
			{@render children()}
		</div>
	</ContentSection>
</PageSectionStack>
