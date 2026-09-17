<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import { list_media, upload_media, change_media } from "../media.remote";
	let archived = $state(false),
		search = $state(""),
		notice = $state(""),
		pending = $state(false);
	const result = $derived(await list_media({ archived, search }));
	let alt_texts = $state<Record<string, string>>({});
	async function change(
		asset: (typeof result.assets)[number],
		action: "save" | "archive" | "restore" | "purge",
	) {
		if (
			action !== "save" &&
			!confirm(
				action === "purge"
					? "¿Eliminar definitivamente este archivo? Esta acción no se puede deshacer."
					: "¿Confirmar el cambio de estado del archivo?",
			)
		)
			return;
		pending = true;
		try {
			const response = await change_media({
				id: asset.id,
				updated_at: asset.updated_at,
				action,
				alt_text: alt_texts[asset.id] ?? asset.alt_text,
			});
			notice = response.message;
			await list_media({ archived, search }).refresh();
		} catch (cause) {
			notice = admin_error_message(cause, "No se pudo actualizar.");
		} finally {
			pending = false;
		}
	}
	async function copy(url: string) {
		try {
			await navigator.clipboard.writeText(new URL(url, location.origin).href);
			notice = "URL copiada.";
		} catch {
			notice = "No se pudo copiar. Abre el enlace y copia la dirección.";
		}
	}
	let form_error = $state("");
</script>

{#if form_error}<p role="alert" class="mb-4 rounded border border-red-300 bg-red-50 p-3">
		{form_error}
	</p>{/if}

<fieldset disabled={!ready} class="min-w-0">
	<h1 class="mb-6 text-3xl font-bold">Biblioteca de medios</h1>
	<form
		{...upload_media.enhance(async (form) => {
			form_error = "";
			try {
				await form.submit();
			} catch (cause) {
				form_error = admin_error_message(cause, "No se pudo completar la operación.");
			}
		})}
		class="mb-6 grid gap-4 rounded border bg-white p-5"
		enctype="multipart/form-data"
	>
		<label class="grid gap-1"
			>Archivo<input
				{...upload_media.fields.file.as("file")}
				required
				accept=".jpg,.jpeg,.png,.webp,.avif,.gif,.svg,.pdf"
			/></label
		>
		<label class="grid gap-1"
			>Texto alternativo<input
				class="rounded border p-2"
				{...upload_media.fields.alt_text.as("text")}
				maxlength="500"
			/></label
		>
		<p>Imágenes: hasta 10 MB. PDF: hasta 25 MB. Los SVG deben ser estáticos y sin referencias.</p>
		<button class="rounded bg-blue-800 p-3 text-white" disabled={!!upload_media.pending}
			>{upload_media.pending ? "Subiendo…" : "Subir archivo"}</button
		>
		{#if upload_media.result}<p role="status">
				{upload_media.result.message}
				<a class="underline" href={upload_media.result.url}>Abrir archivo</a>
			</p>
			<button
				type="button"
				class="underline"
				onclick={() => list_media({ archived, search }).refresh()}>Actualizar biblioteca</button
			>{/if}
	</form>
	<div class="mb-6 flex flex-wrap gap-4">
		<label>Buscar <input class="rounded border p-2" bind:value={search} /></label>
		<label class="flex items-center gap-2"
			><input type="checkbox" bind:checked={archived} />Ver archivados</label
		>
	</div>
	{#if notice}<p class="mb-4" role="status">{notice}</p>{/if}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each result.assets as asset (asset.id)}
			<article class="space-y-3 rounded border bg-white p-4">
				{#if asset.mime_type.startsWith("image/")}<img
						class="h-40 w-full object-contain"
						src={asset.url}
						alt={asset.alt_text}
					/>{/if}
				<h2 class="font-bold break-all">{asset.filename}</h2>
				<p>
					{Math.ceil(asset.size / 1024)} KB {asset.width
						? "· " + asset.width + " × " + asset.height
						: ""}
				</p>
				<label class="grid gap-1"
					>Texto alternativo<input
						class="rounded border p-2"
						value={alt_texts[asset.id] ?? asset.alt_text}
						oninput={(event) => (alt_texts[asset.id] = event.currentTarget.value)}
						disabled={result.user.role === "editor"}
					/></label
				>
				<p>Referencias: {asset.references.join(", ") || "Ninguna"}</p>
				<div class="flex flex-wrap gap-3">
					<a href={asset.url} class="underline">Abrir</a>
					<button class="underline" onclick={() => copy(asset.url)}>Copiar URL</button>
					{#if result.user.role !== "editor"}<button
							class="underline"
							disabled={pending}
							onclick={() => change(asset, "save")}>Guardar</button
						>{/if}
					{#if result.user.role !== "editor" || (!archived && asset.uploader_id === result.user.id && !asset.references.length)}<button
							class="underline"
							disabled={pending}
							onclick={() => change(asset, archived ? "restore" : "archive")}
							>{archived ? "Restaurar" : "Archivar"}</button
						>{/if}
					{#if archived && result.user.role === "superadmin"}<button
							class="text-red-800 underline"
							disabled={pending}
							onclick={() => change(asset, "purge")}>Eliminar definitivamente</button
						>{/if}
				</div>
			</article>
		{:else}<p>No hay archivos.</p>{/each}
	</div>
</fieldset>
