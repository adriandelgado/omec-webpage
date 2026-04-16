<script lang="ts">
	interface TitleLine {
		text: string;
		class?: string;
	}

	interface Props {
		title_lines: TitleLine[];
		description?: string;
		class?: string;
	}

	let { title_lines, description, class: class_name = "" }: Props = $props();
</script>

<div class={["max-w-185", class_name]}>
	<h1 class="text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
		{#each title_lines as title_line (title_line.text)}
			<span class={["block", title_line.class]}>
				{title_line.text}
			</span>
		{/each}
	</h1>

	{#if description}
		<p class="mt-4 max-w-175 text-sm leading-6 text-copy/75">{description}</p>
	{/if}
</div>
