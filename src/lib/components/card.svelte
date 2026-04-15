<script lang="ts">
	interface Props {
		children: import("svelte").Snippet;
		class?: string;
	}

	let { children, class: class_name = "" }: Props = $props();
</script>

<article
	class={[
		"rounded-md border border-primary bg-white shadow-[4px_4px_0_0_var(--color-primary)]",
		class_name,
	]}
>
	{@render children()}
</article>
