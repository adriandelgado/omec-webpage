<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: class_name = "" }: Props = $props();
</script>

<div class={["flex flex-col gap-y-16 lg:gap-y-24", class_name]}>
	{@render children()}
</div>
