<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		class?: string;
	}

	let { title, description, class: class_name = "" }: Props = $props();
</script>

<div class={["max-w-150", class_name]}>
	<h2 class="text-[22px] leading-none font-medium text-copy">{title}</h2>

	{#if description}
		<p class="mt-3 max-w-150 text-[12px] leading-[1.6] text-copy/75">{description}</p>
	{/if}
</div>
