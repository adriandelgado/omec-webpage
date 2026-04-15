<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: class_name = "" }: Props = $props();
</script>

<div class={["flex flex-col gap-y-8 lg:gap-y-10", class_name]}>
	{@render children()}
</div>
