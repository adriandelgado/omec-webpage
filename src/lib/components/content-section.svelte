<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		class?: string;
		container_class?: string;
	}

	let { children, class: class_name = "", container_class = "" }: Props = $props();
</script>

<section class={["px-4 lg:px-6", class_name]}>
	<div class={["mx-auto max-w-270", container_class]}>
		{@render children()}
	</div>
</section>
