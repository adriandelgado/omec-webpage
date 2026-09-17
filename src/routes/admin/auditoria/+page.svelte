<script lang="ts">
	import { search_audit } from "../accounts.remote";
	let search = $state(""),
		offset = $state(0);
	const events = $derived(await search_audit({ search, offset }));
</script>

<h1 class="mb-6 text-3xl font-bold">Registro de auditoría</h1>
<label class="mb-6 block"
	>Buscar por acción, cuenta o registro <input
		class="rounded border p-2"
		bind:value={search}
		oninput={() => (offset = 0)}
	/></label
>
<ul class="space-y-3">
	{#each events as event (event.id)}
		<li class="rounded border bg-white p-4">
			<p>
				{new Date(event.created_at).toLocaleString("es-EC")} · {event.action} · {event.entity_type}
			</p>
			<p class="break-all">Cuenta: {event.actor_id} · Registro: {event.entity_id}</p>
			<details>
				<summary class="cursor-pointer">Ver cambios</summary>
				<p>Antes</p>
				<pre class="overflow-auto whitespace-pre-wrap">{event.before}</pre>
				<p>Después</p>
				<pre class="overflow-auto whitespace-pre-wrap">{event.after}</pre>
			</details>
		</li>
	{:else}<li>No hay eventos.</li>{/each}
</ul>
<div class="mt-6 flex gap-4">
	<button class="underline" disabled={!offset} onclick={() => (offset = Math.max(0, offset - 100))}
		>Anterior</button
	><button class="underline" disabled={events.length < 100} onclick={() => (offset += 100)}
		>Siguiente</button
	>
</div>
