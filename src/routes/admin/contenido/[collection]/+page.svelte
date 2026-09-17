<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import { beforeNavigate } from "$app/navigation";
	import { list_content, save_content, reorder, reference_options } from "../../content.remote";
	import { list_media } from "../../media.remote";
	import { field_label } from "#lib/admin-labels.js";
	import type { Collection, RecordData } from "#lib/server/cms/registry.js";
	let { params } = $props();
	let search = $state("");
	let archived = $state(false);
	let inbox_status = $state<"all" | "unread" | "read" | "archived" | "spam">("all");
	const bundle = $derived(
		await Promise.all([
			list_content({
				collection: params.collection as Collection,
				search,
				archived,
				status: inbox_status,
			}),
			reference_options(params.collection as Collection),
			list_media({ archived: false, search: "" }),
		]),
	);
	const result = $derived(bundle[0]);
	const references = $derived(bundle[1]);
	const media = $derived(bundle[2]);
	let selected = $state<RecordData | null>(null);
	let values = $state<RecordData>({});
	let creating = $state(false);
	let dirty = $state(false);
	let pending = $state(false);
	let notice = $state("");
	beforeNavigate(({ cancel }) => {
		if (dirty && !confirm("Tienes cambios sin guardar. ¿Quieres salir?")) {
			cancel();
			return;
		}
		selected = null;
		creating = false;
		dirty = false;
	});
	function open_record(row: RecordData | null) {
		if (dirty && !confirm("¿Descartar los cambios sin guardar?")) return;
		selected = row;
		creating = row === null;
		values = Object.fromEntries(
			result.definition.fields.map((field) => [
				field.name,
				row
					? row[field.name]
					: field.name === "owner_id"
						? result.user.id
						: field.name === "status"
							? "draft"
							: field.name === "sort_order"
								? Math.max(-1, ...result.rows.map((r) => Number(r.sort_order))) + 1
								: field.name === "content_id"
									? 1
									: field.numeric
										? field.primary
											? Math.max(0, ...result.rows.map((r) => Number(r[field.name]))) + 1
											: 0
										: field.required
											? (field.options[0] ?? "")
											: null,
			]),
		);
		dirty = false;
		notice = "";
	}
	function key_for(row: RecordData) {
		return Object.fromEntries(result.definition.keys.map((key) => [key, row[key]]));
	}
	async function move(row: RecordData, direction: number) {
		const scope = ["content_id", "national_olympiad_id", "card_number", "page_key", "placement"];
		const group = result.rows.filter((other) =>
			scope.every((field) => other[field] === row[field]),
		);
		const index = group.indexOf(row),
			other = group[index + direction];
		if (!other || pending) return;
		if (dirty && !confirm("¿Descartar los cambios sin guardar?")) return;
		pending = true;
		try {
			const items = direction < 0 ? [row, other] : [other, row];
			const response = await reorder({
				collection: params.collection as Collection,
				items: items.map((item) => ({ key: key_for(item), updated_at: Number(item.updated_at) })),
			});
			notice = response.message;
			selected = null;
			dirty = false;
			await list_content({
				collection: params.collection as Collection,
				search,
				archived,
				status: inbox_status,
			}).refresh();
		} catch (cause) {
			notice = admin_error_message(cause, "No se pudo ordenar.");
		} finally {
			pending = false;
		}
	}
	async function save(action: "save" | "create" | "archive" | "restore") {
		if (
			(action === "archive" || action === "restore") &&
			!confirm(
				action === "archive"
					? "¿Archivar este registro? Dejará de aparecer en el sitio."
					: "¿Restaurar este registro?",
			)
		)
			return;
		pending = true;
		notice = "";
		try {
			const response = await save_content({
				collection: params.collection as Collection,
				action,
				key: key_for(selected ?? values),
				updated_at: selected ? Number(selected.updated_at) : null,
				data: $state.snapshot(values),
			});
			dirty = false;
			selected = null;
			creating = false;
			notice = response.message;
			await list_content({
				collection: params.collection as Collection,
				search,
				archived,
				status: inbox_status,
			}).refresh();
		} catch (cause) {
			notice = admin_error_message(cause, "No se pudo guardar.");
		} finally {
			pending = false;
		}
	}
</script>

<svelte:window
	onbeforeunload={(event) => {
		if (dirty) event.preventDefault();
	}}
/>
<fieldset disabled={!ready} class="min-w-0">
	<h1 class="mb-6 text-3xl font-bold">{result.definition.label}</h1>
	<div class="mb-6 flex flex-wrap items-end gap-4">
		<label class="grid gap-1"
			>Buscar<input class="rounded border bg-white p-2" bind:value={search} /></label
		>
		{#if !result.definition.singleton && params.collection !== "contact_submission"}
			<label class="flex items-center gap-2"
				><input type="checkbox" bind:checked={archived} />Ver archivados</label
			>
			<button class="rounded bg-blue-800 px-4 py-2 text-white" onclick={() => open_record(null)}
				>Crear registro</button
			>
		{/if}
		{#if params.collection === "contact_submission"}
			<label class="grid gap-1"
				>Estado<select class="rounded border p-2" bind:value={inbox_status}
					><option value="all">Todos</option><option value="unread">Sin leer</option><option
						value="read">Leídos</option
					><option value="archived">Archivados</option><option value="spam">Spam</option></select
				></label
			>
		{/if}
	</div>
	{#if notice}<p class="mb-4 rounded border bg-white p-4" role="status">{notice}</p>{/if}
	<div class="grid gap-6 lg:grid-cols-[minmax(220px,1fr)_3fr]">
		<div>
			<ul class="space-y-2">
				{#each result.rows as row (JSON.stringify(key_for(row)))}
					<li>
						{#if !archived && row.sort_order !== undefined}
							<div class="mb-1 flex gap-3">
								<button
									type="button"
									class="text-sm underline"
									disabled={pending}
									onclick={() => move(row, -1)}>Subir</button
								><button
									type="button"
									class="text-sm underline"
									disabled={pending}
									onclick={() => move(row, 1)}>Bajar</button
								>
							</div>
						{/if}
						<button
							class="w-full rounded border bg-white p-3 text-left hover:border-blue-800"
							onclick={() => open_record(row)}
						>
							<span class="block font-semibold"
								>{row.title ??
									row.name ??
									row.subject ??
									row.label ??
									row.text ??
									row.slug ??
									Object.values(key_for(row)).join(" · ")}</span
							>
							{#if row.status}<span class="text-sm"
									>{row.status === "published"
										? "Publicada"
										: row.status === "draft"
											? "Borrador"
											: row.status === "unread"
												? "Sin leer"
												: row.status === "read"
													? "Leído"
													: row.status === "archived"
														? "Archivado"
														: "Spam"}</span
								>{/if}
						</button>
					</li>
				{:else}<li>No hay registros.</li>{/each}
			</ul>
			{#if result.rows.length === 500}<p>
					Se muestran hasta 500 registros. Usa la búsqueda para acotar los resultados.
				</p>{/if}
		</div>
		{#if selected || creating}
			<form
				class="grid gap-4 rounded-xl border bg-white p-5"
				onsubmit={(event) => {
					event.preventDefault();
					save(creating ? "create" : "save");
				}}
			>
				<h2 class="text-xl font-bold">{creating ? "Nuevo registro" : "Editar registro"}</h2>
				{#each result.definition.fields as field (field.name)}
					{@const readonly =
						(!creating && field.primary && field.name !== "slug") ||
						(params.collection === "contact_submission" && field.name !== "status") ||
						(field.name === "owner_id" && result.user.role === "editor")}
					<label class="grid gap-1">
						<span>{field_label(field.name)}{field.required ? " *" : ""}</span>
						{#if references[field.name]}
							<select
								aria-label={field_label(field.name) + (field.required ? " *" : "")}
								class="rounded border p-2"
								disabled={readonly}
								required={field.required}
								value={values[field.name] ?? ""}
								onchange={(event) => {
									values[field.name] =
										event.currentTarget.value === ""
											? null
											: field.numeric
												? Number(event.currentTarget.value)
												: event.currentTarget.value;
									dirty = true;
								}}
							>
								<option value="">Sin asignar</option>
								{#each references[field.name] as option (option.value)}<option value={option.value}
										>{option.label}</option
									>{/each}
							</select>
						{:else if field.name.endsWith("media_id")}
							<select
								aria-label={field_label(field.name) + (field.required ? " *" : "")}
								class="rounded border p-2"
								value={values[field.name] ?? ""}
								onchange={(event) => {
									values[field.name] = event.currentTarget.value || null;
									dirty = true;
								}}
							>
								<option value="">Usar imagen incluida</option>
								{#each media.assets.filter( (asset) => asset.mime_type.startsWith("image/") ) as asset (asset.id)}<option
										value={asset.id}>{asset.filename} · {asset.alt_text}</option
									>{/each}
							</select>
						{:else if field.options.length || field.boolean}
							<select
								aria-label={field_label(field.name) + (field.required ? " *" : "")}
								class="rounded border p-2"
								disabled={readonly}
								value={String(values[field.name] ?? "")}
								onchange={(event) => {
									values[field.name] = field.numeric
										? Number(event.currentTarget.value)
										: event.currentTarget.value || null;
									dirty = true;
								}}
							>
								{#if !field.required}<option value="">Sin valor</option>{/if}
								{#each field.boolean ? ["0", "1"] : field.options as option (option)}<option
										value={option}
										>{option === "0"
											? "No"
											: option === "1"
												? "Sí"
												: option === "draft"
													? "Borrador"
													: option === "published"
														? "Publicada"
														: option === "unread"
															? "Sin leer"
															: option === "read"
																? "Leído"
																: option === "archived"
																	? "Archivado"
																	: option}</option
									>{/each}
							</select>
						{:else if /markdown|description|summary|message|text|announcement/.test(field.name)}
							<textarea
								aria-label={field_label(field.name) + (field.required ? " *" : "")}
								class="min-h-28 rounded border p-2 font-mono"
								rows={field.name === "body_markdown" ? 18 : 4}
								required={field.required}
								disabled={readonly}
								value={values[field.name] ?? ""}
								oninput={(event) => {
									values[field.name] = event.currentTarget.value || (field.required ? "" : null);
									dirty = true;
								}}></textarea>
						{:else}
							<input
								aria-label={field_label(field.name) + (field.required ? " *" : "")}
								class="rounded border p-2 disabled:bg-slate-100"
								type={field.numeric
									? "number"
									: /^(published_on|starts_on|ends_on)$/.test(field.name)
										? "date"
										: "text"}
								required={field.required}
								disabled={readonly}
								value={values[field.name] ?? ""}
								oninput={(event) => {
									values[field.name] =
										event.currentTarget.value === "" && !field.required
											? null
											: field.numeric
												? Number(event.currentTarget.value)
												: event.currentTarget.value;
									dirty = true;
								}}
							/>
						{/if}
					</label>
				{/each}
				{#if params.collection === "news_article"}<p>
						La firma es independiente de la cuenta propietaria. Solo las noticias publicadas
						aparecen en el sitio.
					</p>{/if}
				<p class="text-sm">
					Los cambios se aplican al guardar. {dirty ? "Tienes cambios sin guardar." : ""}
				</p>
				<div class="flex flex-wrap gap-3">
					<button
						class="rounded bg-blue-800 px-4 py-2 text-white disabled:opacity-50"
						disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button
					>
					{#if selected && !result.definition.singleton && params.collection !== "contact_submission"}<button
							type="button"
							class="rounded border px-4 py-2"
							disabled={pending}
							onclick={() => save(archived ? "restore" : "archive")}
							>{archived ? "Restaurar" : "Archivar"}</button
						>{/if}
				</div>
			</form>
		{:else}<p class="rounded border border-dashed p-6">
				Selecciona un registro para editarlo.
			</p>{/if}
	</div>
</fieldset>
