<script lang="ts">
	interface Props {
		title: string;
		description: string;
		bullets: readonly string[];
		icon: string;
		icon_alt: string;
	}

	let { title, description, bullets, icon, icon_alt }: Props = $props();
</script>

<article class="rounded-md border border-primary bg-white p-4 shadow-[4px_4px_0_0_#2d67ff]">
	<img src={icon} alt={icon_alt} class="h-6 w-6" />
	<h3 class="mt-3 max-w-[14ch] text-[15px] leading-tight font-medium text-copy">{title}</h3>
	<p class="mt-2.5 text-[11px] leading-[1.6] text-copy/70">{description}</p>
	<ul class="mt-3.5 space-y-1.5 text-[11px] leading-normal text-copy/80">
		{#each bullets as bullet (bullet)}
			<li class="flex items-start gap-2">
				<span class="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
				<span>{bullet}</span>
			</li>
		{/each}
	</ul>
</article>
