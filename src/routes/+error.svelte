<script lang="ts">
	import ErrorPage from "$lib/components/error-page.svelte";

	// TODO: remove later
	// eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
	let { error }: { error: App.Error } = $props();
</script>

<ErrorPage {error} />
