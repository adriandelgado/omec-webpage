<script lang="ts">
	// TODO: made with vibecoding. please clean up
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import {
		create_admin_role,
		delete_admin_role,
		get_admin_roles,
		update_admin_role,
	} from "./roles.remote";

	const admin_roles_query = get_admin_roles();
	const admin_roles_data = $derived(await admin_roles_query);

	const selected_role_id = $derived(page.url.searchParams.get("role"));
	const selected_role = $derived.by(() => {
		if (selected_role_id) {
			return (
				admin_roles_data.roles.find((role_row) => String(role_row.id) === selected_role_id) ?? null
			);
		}

		return admin_roles_data.roles[0] ?? null;
	});
</script>

<div class="space-y-6">
	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<div class="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Roles</p>
				<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">Catálogo de roles</h2>
				<p class="mt-2 text-sm leading-6 text-copy/68">
					Define agrupaciones de permisos y controla cuántos usuarios dependen de cada rol.
				</p>
			</div>
		</div>

		<div class="mt-5 overflow-x-auto rounded-2xl border border-primary/18">
			<table class="min-w-full divide-y divide-primary/15 text-left text-sm">
				<thead class="bg-primary/6 text-copy/74">
					<tr>
						<th class="px-4 py-3 font-semibold">Rol</th>
						<th class="px-4 py-3 font-semibold">Permisos</th>
						<th class="px-4 py-3 font-semibold">Usuarios</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-primary/10 bg-white">
					{#each admin_roles_data.roles as role_row (role_row.id)}
						<tr class={selected_role?.id === role_row.id ? "bg-primary/6" : ""}>
							<td class="px-4 py-3 align-top">
								<a
									href={resolve(`/admin/roles?role=${role_row.id}`)}
									class="block font-medium text-primary"
								>
									{role_row.label}
								</a>
								<p class="mt-1 text-copy/62">{role_row.key}</p>
								{#if role_row.description}
									<p class="mt-2 text-copy/62">{role_row.description}</p>
								{/if}
							</td>
							<td class="px-4 py-3 align-top">
								<div class="flex flex-wrap gap-2">
									{#each role_row.permissions as permission_row (permission_row.id)}
										<span class="rounded-full bg-copy/6 px-2.5 py-1 text-xs text-copy/75">
											{permission_row.key}
										</span>
									{:else}
										<span class="text-copy/50">Sin permisos</span>
									{/each}
								</div>
							</td>
							<td class="px-4 py-3 align-top text-copy/62">{role_row.user_count}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="3" class="px-4 py-6 text-center text-copy/60">
								No hay roles configurados.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<div class="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
		<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
			<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Crear rol</p>
			<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">Nuevo rol administrativo</h3>

			{#if create_admin_role.result?.success}
				<div
					class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
				>
					{create_admin_role.result.message}
				</div>
			{/if}

			<form
				{...create_admin_role.enhance(async ({ submit }) => {
					await submit().updates(admin_roles_query);
				})}
				class="mt-5 space-y-4"
			>
				<div>
					<label for="create_role_key" class="text-sm font-medium text-copy/82">Clave</label>
					<input
						id="create_role_key"
						{...create_admin_role.fields.key.as("text")}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
					{#each create_admin_role.fields.key.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<div>
					<label for="create_role_label" class="text-sm font-medium text-copy/82">Nombre</label>
					<input
						id="create_role_label"
						{...create_admin_role.fields.label.as("text")}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
					{#each create_admin_role.fields.label.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<div>
					<label for="create_role_description" class="text-sm font-medium text-copy/82"
						>Descripción</label
					>
					<textarea
						id="create_role_description"
						rows="4"
						{...create_admin_role.fields.description.as("text")}
						class="mt-2 block w-full rounded-2xl border border-primary/35 bg-white px-3.5 py-3 text-sm"
					></textarea>
				</div>

				<div>
					<p class="text-sm font-medium text-copy/82">Permisos</p>
					<div class="mt-3 grid gap-2 sm:grid-cols-2">
						{#each admin_roles_data.permissions as permission_row (permission_row.id)}
							<label
								class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
							>
								<input
									{...create_admin_role.fields.permission_ids.as(
										"checkbox",
										String(permission_row.id),
									)}
									class="mt-0.5 rounded border-primary/40 text-primary"
								/>
								<span>
									<span class="block font-medium text-copy">{permission_row.key}</span>
									<span class="mt-1 block text-copy/62"
										>{permission_row.description ?? "Sin descripción"}</span
									>
								</span>
							</label>
						{/each}
					</div>
					{#each create_admin_role.fields.permission_ids.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<button
					type="submit"
					disabled={create_admin_role.pending > 0}
					class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{create_admin_role.pending > 0 ? "Guardando..." : "Crear rol"}
				</button>
			</form>
		</section>

		<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
			<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Editar rol</p>
			<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
				{selected_role ? selected_role.label : "Selecciona un rol"}
			</h3>

			{#if selected_role}
				{#if update_admin_role.result?.success}
					<div
						class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
					>
						{update_admin_role.result.message}
					</div>
				{/if}

				<form
					{...update_admin_role.enhance(async ({ submit }) => {
						await submit().updates(admin_roles_query);
					})}
					class="mt-5 space-y-4"
				>
					<input {...update_admin_role.fields.role_id.as("hidden", String(selected_role.id))} />

					<div>
						<label for="edit_role_key" class="text-sm font-medium text-copy/82">Clave</label>
						<input
							id="edit_role_key"
							{...update_admin_role.fields.key.as("text", selected_role.key)}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
					</div>

					<div>
						<label for="edit_role_label" class="text-sm font-medium text-copy/82">Nombre</label>
						<input
							id="edit_role_label"
							{...update_admin_role.fields.label.as("text", selected_role.label)}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
					</div>

					<div>
						<label for="edit_role_description" class="text-sm font-medium text-copy/82"
							>Descripción</label
						>
						<textarea
							id="edit_role_description"
							rows="4"
							{...update_admin_role.fields.description.as("text", selected_role.description ?? "")}
							class="mt-2 block w-full rounded-2xl border border-primary/35 bg-white px-3.5 py-3 text-sm"
						></textarea>
					</div>

					<div>
						<p class="text-sm font-medium text-copy/82">Permisos</p>
						<div class="mt-3 grid gap-2 sm:grid-cols-2">
							{#each admin_roles_data.permissions as permission_row (permission_row.id)}
								<label
									class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
								>
									<input
										{...update_admin_role.fields.permission_ids.as(
											"checkbox",
											String(permission_row.id),
										)}
										checked={selected_role.permission_ids.includes(permission_row.id)}
										class="mt-0.5 rounded border-primary/40 text-primary"
									/>
									<span>
										<span class="block font-medium text-copy">{permission_row.key}</span>
										<span class="mt-1 block text-copy/62"
											>{permission_row.description ?? "Sin descripción"}</span
										>
									</span>
								</label>
							{/each}
						</div>
					</div>

					<button
						type="submit"
						disabled={update_admin_role.pending > 0}
						class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{update_admin_role.pending > 0 ? "Guardando..." : "Guardar cambios"}
					</button>
				</form>

				<form
					{...delete_admin_role.enhance(async ({ submit }) => {
						await submit().updates(admin_roles_query);
					})}
					class="mt-6"
				>
					<input {...delete_admin_role.fields.role_id.as("hidden", String(selected_role.id))} />
					<button
						type="submit"
						disabled={delete_admin_role.pending > 0}
						class="inline-flex h-11 items-center justify-center rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{delete_admin_role.pending > 0 ? "Eliminando..." : "Eliminar rol"}
					</button>
				</form>
			{:else}
				<p class="mt-5 text-sm leading-6 text-copy/66">
					Selecciona un rol de la tabla para editar sus permisos.
				</p>
			{/if}
		</section>
	</div>
</div>
