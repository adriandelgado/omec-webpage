<script lang="ts">
	import "./layout.css";
	import favicon from "#lib/assets/global/favicon.svg";
	import { page } from "$app/state";
	import PublicShell from "#lib/components/public-shell.svelte";
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{#if page.url.pathname.startsWith("/admin")}
	{@render children()}
{:else}
	<PublicShell>{@render children()}</PublicShell>
{/if}
