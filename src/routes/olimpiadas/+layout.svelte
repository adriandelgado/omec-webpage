<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import PageIntro from "#lib/components/page-intro.svelte";
	import SectionHeading from "#lib/components/section-heading.svelte";
	import { get_content } from "./content.remote";

	let { children } = $props();
	const content = await get_content();
</script>

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<PageIntro title_lines={content.intro.title_lines} description={content.intro.description} />
	</ContentSection>

	<ContentSection>
		<SectionHeading title={content.section_title} />

		<nav aria-label="Información de olimpiadas" class="mt-5 border-b border-primary/80">
			<div class="flex flex-wrap gap-5 text-sm font-medium">
				{#each content.routes as route (route.href)}
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
