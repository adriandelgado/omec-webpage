<script lang="ts">
	import { dashboard } from "./content.remote";
	const data = await dashboard();
</script>

<h1 class="mb-6 text-3xl font-bold">Resumen</h1>
<div class="mb-8 grid gap-4 sm:grid-cols-2">
	<a class="rounded-xl border bg-white p-6" href="/admin/contenido/news_article"
		><strong class="block text-3xl">{data.drafts}</strong>Noticias en borrador</a
	>
	{#if data.user.role !== "editor"}<a
			class="rounded-xl border bg-white p-6"
			href="/admin/contenido/contact_submission"
			><strong class="block text-3xl">{data.unread}</strong>Mensajes sin leer</a
		>{/if}
</div>
<h2 class="mb-4 text-xl font-bold">Contenido del sitio</h2>
<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
	{#each data.collections as collection (collection.key)}
		<a
			class="rounded border bg-white p-4 hover:border-blue-800"
			href="/admin/contenido/{collection.key}">{collection.label}</a
		>
	{/each}
</div>
{#if data.activity.length}
	<h2 class="mt-8 mb-4 text-xl font-bold">Actividad reciente</h2>
	<ul class="space-y-2">
		{#each data.activity as item, i (i)}<li>
				{new Date(item.created_at).toLocaleString("es-EC")} · {item.entity_type} · {item.action}
			</li>{/each}
	</ul>
{/if}
