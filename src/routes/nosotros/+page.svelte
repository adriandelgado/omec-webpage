<script lang="ts">
	import ContentSection from "$lib/components/content-section.svelte";
	import PageIntro from "$lib/components/page-intro.svelte";
	import Seo from "$lib/components/seo.svelte";

	const title = "Nosotros";
</script>

<Seo
	{title}
	description="Conoce a OMEC, su misión y el trabajo que realiza para promover la excelencia matemática y las olimpiadas estudiantiles en Ecuador."
/>

<ContentSection class="pt-8 pb-9 lg:pt-10 lg:pb-10">
	<PageIntro title_lines={[{ text: title }]} />
</ContentSection>
