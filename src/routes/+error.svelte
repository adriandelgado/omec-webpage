<script lang="ts">
	import ErrorPage from "#lib/components/error-page.svelte";

	let { error } = $props();
</script>

<ErrorPage {error} />
