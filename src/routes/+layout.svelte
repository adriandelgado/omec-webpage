<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/layout/header.svelte";
	import Footer from "$lib/components/layout/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="mx-auto flex min-h-screen max-w-[90svw] flex-col text-copy md:max-w-[96dvw]">
	<Header />
	<main
		class="relative flex-1 bg-foreground bg-[linear-gradient(to_right,#bfdbfe_1px,transparent_1px),linear-gradient(to_bottom,#bfdbfe_1px,transparent_1px)] bg-[size:32px_32px]"
	>
		<div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-px bg-primary"></div>
		<div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-px bg-primary"></div>
		{@render children()}
	</main>
	<Footer />
</div>
