<script lang="ts">
	// TODO: made with vibecoding. please clean up
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { get_admin_permissions, update_admin_permission } from "./permissions.remote";

	const admin_permissions_query = get_admin_permissions();
	const permission_rows = $derived(await admin_permissions_query);

	const selected_permission_id = $derived(page.url.searchParams.get("permission"));
	const selected_permission = $derived.by(() => {
		if (selected_permission_id) {
			return (
				permission_rows.find(
					(permission_row) => String(permission_row.id) === selected_permission_id,
				) ?? null
			);
		}

		return permission_rows[0] ?? null;
	});

	function format_date(date_value: Date) {
		return new Intl.DateTimeFormat("es-EC", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(date_value);
	}
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Permisos</p>
		<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">Catálogo fijo de permisos</h2>
		<p class="mt-2 text-sm leading-6 text-copy/68">
			En esta versión solo puedes ajustar la descripción visible de cada permiso.
		</p>

		<div class="mt-5 overflow-x-auto rounded-2xl border border-primary/18">
			<table class="min-w-full divide-y divide-primary/15 text-left text-sm">
				<thead class="bg-primary/6 text-copy/74">
					<tr>
						<th class="px-4 py-3 font-semibold">Clave</th>
						<th class="px-4 py-3 font-semibold">Descripción</th>
						<th class="px-4 py-3 font-semibold">Actualizado</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-primary/10 bg-white">
					{#each permission_rows as permission_row (permission_row.id)}
						<tr class={selected_permission?.id === permission_row.id ? "bg-primary/6" : ""}>
							<td class="px-4 py-3 align-top">
								<a
									href={resolve(`/admin/permissions?permission=${permission_row.id}`)}
									class="font-medium text-primary"
								>
									{permission_row.key}
								</a>
							</td>
							<td class="px-4 py-3 align-top text-copy/68">
								{permission_row.description ?? "Sin descripción"}
							</td>
							<td class="px-4 py-3 align-top text-copy/62"
								>{format_date(permission_row.updated_at)}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Editar descripción</p>
		<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
			{selected_permission ? selected_permission.key : "Selecciona un permiso"}
		</h3>

		{#if selected_permission}
			{#if update_admin_permission.result?.success}
				<div
					class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
				>
					{update_admin_permission.result.message}
				</div>
			{/if}

			<form
				{...update_admin_permission.enhance(async ({ submit }) => {
					await submit().updates(admin_permissions_query);
				})}
				class="mt-5 space-y-4"
			>
				<input
					{...update_admin_permission.fields.permission_id.as(
						"hidden",
						String(selected_permission.id),
					)}
				/>

				<div
					class="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-copy/70"
				>
					La clave del permiso es fija y no se puede modificar: <strong
						>{selected_permission.key}</strong
					>
				</div>

				<div>
					<label for="permission_description" class="text-sm font-medium text-copy/82"
						>Descripción</label
					>
					<textarea
						id="permission_description"
						rows="6"
						{...update_admin_permission.fields.description.as(
							"text",
							selected_permission.description ?? "",
						)}
						class="mt-2 block w-full rounded-2xl border border-primary/35 bg-white px-3.5 py-3 text-sm"
					></textarea>
				</div>

				<button
					type="submit"
					disabled={update_admin_permission.pending > 0}
					class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{update_admin_permission.pending > 0 ? "Guardando..." : "Guardar descripción"}
				</button>
			</form>
		{:else}
			<p class="mt-5 text-sm leading-6 text-copy/66">
				Selecciona un permiso de la tabla para editar su descripción.
			</p>
		{/if}
	</section>
</div>
