<script lang="ts">
	import { resolve } from "$app/paths";
	import Card from "#lib/components/card.svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import Seo from "#lib/components/seo.svelte";
</script>

<Seo
	title="Noticias"
	description="Noticias y comunicados de la Olimpiada Matemática Ecuatoriana."
/>

<PageSectionStack class="py-12 lg:py-20">
	<ContentSection>
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">OMEC</p>
		<h1 class="mt-3 text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">Noticias</h1>
		<p class="mt-5 max-w-150 text-sm leading-6 text-copy/75">
			Conoce las últimas noticias y comunicados de la Olimpiada Matemática Ecuatoriana.
		</p>
	</ContentSection>

	<ContentSection>
		<Card class="max-w-3xl">
			<a
				href={resolve("/noticias/logros-de-la-omec-en-2026")}
				class="block p-6 transition-colors hover:bg-foreground/45 lg:p-8"
			>
				<p class="text-sm font-semibold text-primary">13 de agosto de 2026 · OMEC</p>
				<h2 class="mt-3 text-2xl font-semibold tracking-tight text-copy lg:text-3xl">
					Logros de la OMEC en 2026
				</h2>
				<p class="mt-4 max-w-2xl text-sm leading-6 text-copy/75">
					17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo.
				</p>
				<span class="mt-6 inline-flex text-sm font-semibold text-primary">Leer noticia →</span>
			</a>
		</Card>
	</ContentSection>
</PageSectionStack>
