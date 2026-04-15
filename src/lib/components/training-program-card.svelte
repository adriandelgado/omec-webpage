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
	<img src={icon} alt={icon_alt} class="h-6 w-6" />
	<h3 class="mt-3 max-w-[14ch] text-base leading-tight font-medium text-copy">{title}</h3>
	<p class="mt-2.5 text-sm leading-relaxed text-copy/70">{description}</p>
	<ul class="mt-3.5 space-y-1.5 text-sm leading-normal text-copy/80">
		{#each bullets as bullet (bullet)}
			<li class="flex items-start gap-2">
				<span class="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
				<span>{bullet}</span>
			</li>
		{/each}
	</ul>
</Card>
