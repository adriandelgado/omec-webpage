<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		class?: string;
	}

	let { title, description, class: class_name = "" }: Props = $props();
</script>

<div class={class_name}>
	<div
		class="relative py-5 before:pointer-events-none before:absolute before:top-0 before:left-[calc(50%-50vw)] before:z-10 before:h-px before:w-screen before:bg-primary before:content-[''] after:pointer-events-none after:absolute after:bottom-0 after:left-[calc(50%-50vw)] after:z-10 after:h-px after:w-screen after:bg-primary after:content-[''] lg:py-6"
	>
		<div
			class="absolute top-0 bottom-0 left-[calc((100%_-_90svw)_/_2)] w-[90svw] bg-foreground md:left-[calc((100%_-_96dvw)_/_2)]
  md:w-[96dvw]"
		></div>
		<h2 class="relative z-10 bg-foreground px-2 text-2xl font-medium text-primary">
			{title}
		</h2>
	</div>

	{#if description}
		<p class="mt-3 max-w-150 px-2 text-sm leading-relaxed text-copy/75">
			{description}
		</p>
	{/if}
</div>
