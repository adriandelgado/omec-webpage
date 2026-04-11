<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/layout/header.svelte";
	import Footer from "$lib/components/layout/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="min-h-screen bg-background bg-[linear-gradient(to_right,rgba(61,120,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(61,120,255,0.12)_1px,transparent_1px)] bg-size-[48px_48px] text-copy"
>
	<div class="mx-auto flex min-h-screen w-full max-w-295 flex-col border-x border-line bg-sheet">
		<Header />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
</div>
