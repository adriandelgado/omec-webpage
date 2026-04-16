<script lang="ts">
	import Card from "$lib/components/card.svelte";

	interface Props {
		title: string;
		description: string;
		bullets: readonly string[];
		icon: string;
		icon_alt: string;
	}

	let { title, description, bullets, icon, icon_alt }: Props = $props();
</script>

<Card class="p-4">
	<img src={icon} alt={icon_alt} class="size-12" />
	<h3 class="mt-3 max-w-[14ch] text-base leading-tight font-medium">{title}</h3>
	<p class="mt-2.5 text-sm leading-relaxed text-copy/70">{description}</p>
	<ul
		class="mt-3.5 list-disc space-y-1.5 pl-3.5 text-sm leading-normal text-copy/80 marker:text-primary"
	>
		{#each bullets as bullet (bullet)}
			<li>{bullet}</li>
		{/each}
	</ul>
</Card>
