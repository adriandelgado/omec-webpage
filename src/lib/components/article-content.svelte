<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<article class="article-content">
	<!-- The server-side Markdown adapter validates and safely renders this HTML. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</article>

<style>
	.article-content {
		max-width: 70ch;
		font-size: 1rem;
		line-height: 2;
		color: color-mix(in oklab, var(--color-copy) 80%, transparent);
	}

	.article-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.025em;
		color: var(--color-copy);
	}

	.article-content :global(h3) {
		margin-top: 2.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.75rem;
		color: var(--color-copy);
	}

	.article-content :global(p) {
		margin-top: 1.5rem;
	}

	.article-content :global(h2 + p) {
		margin-top: 2rem;
	}

	.article-content :global(h3 + table) {
		margin-top: 1rem;
	}

	.article-content :global(strong) {
		font-weight: 700;
		color: var(--color-copy);
	}

	.article-content :global(table) {
		display: block;
		width: 100%;
		max-width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
		border: 1px solid color-mix(in oklab, var(--color-primary) 30%, transparent);
		border-radius: 0.375rem;
		background: white;
		box-shadow: 4px 4px 0 0 var(--color-primary);
		font-size: 0.875rem;
		line-height: 1.5rem;
		text-align: left;
	}

	.article-content :global(thead),
	.article-content :global(tbody) {
		display: table;
		width: 100%;
		min-width: 42.5rem;
		table-layout: fixed;
	}

	.article-content :global(thead) {
		background: var(--color-primary);
		color: white;
	}

	.article-content :global(th),
	.article-content :global(td) {
		padding: 0.75rem 1rem;
	}

	.article-content :global(th) {
		font-weight: 600;
	}

	.article-content :global(tbody tr + tr) {
		border-top: 1px solid color-mix(in oklab, var(--color-primary) 15%, transparent);
	}

	@media (min-width: 64rem) {
		.article-content :global(h2) {
			font-size: 1.875rem;
		}
	}
</style>
