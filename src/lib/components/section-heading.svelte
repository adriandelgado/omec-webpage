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
		class="relative py-4 before:pointer-events-none before:absolute before:top-0 before:left-[calc(50%-50vw)] before:h-px before:w-screen before:bg-primary before:content-[''] after:pointer-events-none after:absolute after:bottom-0 after:left-[calc(50%-50vw)] after:h-px after:w-screen after:bg-primary after:content-['']"
	>
		<h2 class="text-2xl font-medium">
			{title}
		</h2>
	</div>

	{#if description}
		<p class="mt-3 max-w-150 text-sm leading-relaxed text-copy/75">
			{description}
		</p>
	{/if}
</div>
