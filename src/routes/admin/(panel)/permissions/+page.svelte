<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
	{#each [[{ id: 1, key: "admin.users.manage", description: "Crear, editar y desactivar cuentas administrativas.", updated_at: "2026-05-12T10:00:00" }, { id: 2, key: "admin.roles.manage", description: "Configurar roles y sus permisos asignados.", updated_at: "2026-05-14T14:20:00" }]] as permission_rows (permission_rows)}
		{@const selected_permission =
			permission_rows.find(
				(permission_row) => String(permission_row.id) === page.url.searchParams.get("permission"),
			) ?? permission_rows[0]}
		<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
			<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Permisos</p>
			<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">
				Catálogo fijo de permisos
			</h2>
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
									>{new Intl.DateTimeFormat("es-EC", {
										dateStyle: "medium",
										timeStyle: "short",
									}).format(new Date(permission_row.updated_at))}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
			<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
				Editar descripción
			</p>
			<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
				{selected_permission ? selected_permission.key : "Selecciona un permiso"}
			</h3>

			{#if selected_permission}
				<form class="mt-5 space-y-4">
					<input type="hidden" name="permission_id" value={String(selected_permission.id)} />

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
							name="description"
							class="mt-2 block w-full rounded-2xl border border-primary/35 bg-white px-3.5 py-3 text-sm"
							>{selected_permission.description ?? ""}</textarea
						>
					</div>

					<button
						type="submit"
						class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
					>
						Guardar descripción
					</button>
				</form>
			{:else}
				<p class="mt-5 text-sm leading-6 text-copy/66">
					Selecciona un permiso de la tabla para editar su descripción.
				</p>
			{/if}
		</section>
	{/each}
</div>
