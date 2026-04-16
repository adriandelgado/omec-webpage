<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/layout/header.svelte";
	import Footer from "$lib/components/layout/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="mx-auto flex min-h-screen max-w-295 flex-col text-copy">
	<Header />
	<main class="flex-1 border-x border-primary bg-foreground">
		{@render children()}
	</main>
	<Footer />
</div>
