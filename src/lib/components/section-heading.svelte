<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		class?: string;
	}

	let { title, description, class: class_name = "" }: Props = $props();
</script>

<div class={["relative", class_name]}>
	<div class="relative py-5">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute top-0 ml-[calc(50%-50vw)] h-px w-screen bg-line"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 ml-[calc(50%-50vw)] h-px w-screen bg-line"
		></div>

		<div class="relative max-w-150">
			<h2 class="relative z-10 inline-block pr-6 text-2xl leading-none font-medium text-copy">
				{title}
			</h2>
		</div>
	</div>

	{#if description}
		<p class="mt-3 max-w-150 text-sm leading-relaxed text-copy/75">{description}</p>
	{/if}
</div>
