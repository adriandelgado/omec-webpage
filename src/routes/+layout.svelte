<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/layout/header.svelte";
	import Footer from "$lib/components/layout/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-background text-gray-900">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
