<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/layout/header.svelte";
	import Footer from "$lib/components/layout/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen text-copy">
	<div
		class="mx-auto flex min-h-screen w-full max-w-295 flex-col border-x border-line bg-foreground"
	>
		<Header />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
</div>
