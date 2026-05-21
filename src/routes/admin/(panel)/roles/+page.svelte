<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
</script>

<div class="space-y-6">
	{#each [[{ id: 1, key: "admin.users.manage", description: "Crear, editar y desactivar cuentas administrativas." }, { id: 2, key: "admin.roles.manage", description: "Configurar roles y permisos." }, { id: 3, key: "admin.messages.read", description: "Leer mensajes recibidos desde el formulario de contacto." }]] as permissions (permissions)}
		{@const admin_roles_data = {
			permissions,
			roles: [
				{
					id: 1,
					key: "super_admin",
					label: "Superadministrador",
					description: "Acceso completo a todas las secciones administrativas.",
					permissions,
					permission_ids: permissions.map((permission_row) => permission_row.id),
					user_count: 2,
				},
				{
					id: 2,
					key: "content_reviewer",
					label: "Revisor de contenido",
					description: "Puede revisar mensajes y solicitudes entrantes.",
					permissions: [permissions[2]],
					permission_ids: [3],
					user_count: 1,
				},
			],
		}}
		{@const selected_role =
			admin_roles_data.roles.find(
				(role_row) => String(role_row.id) === page.url.searchParams.get("role"),
			) ?? admin_roles_data.roles[0]}
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
				<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
					Nuevo rol administrativo
				</h3>

				<form class="mt-5 space-y-4">
					<div>
						<label for="create_role_key" class="text-sm font-medium text-copy/82">Clave</label>
						<input
							id="create_role_key"
							type="text"
							name="key"
							value="community_manager"
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
					</div>

					<div>
						<label for="create_role_label" class="text-sm font-medium text-copy/82">Nombre</label>
						<input
							id="create_role_label"
							type="text"
							name="label"
							value="Gestor comunitario"
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
					</div>

					<div>
						<label for="create_role_description" class="text-sm font-medium text-copy/82"
							>Descripción</label
						>
						<textarea
							id="create_role_description"
							rows="4"
							name="description"
							class="mt-2 block w-full rounded-2xl border border-primary/35 bg-white px-3.5 py-3 text-sm"
							>Coordina comunicaciones y seguimiento a mensajes institucionales.</textarea
						>
					</div>

					<div>
						<p class="text-sm font-medium text-copy/82">Permisos</p>
						<div class="mt-3 grid gap-2 sm:grid-cols-2">
							{#each admin_roles_data.permissions as permission_row (permission_row.id)}
								<label
									class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
								>
									<input
										type="checkbox"
										name="permission_ids"
										value={String(permission_row.id)}
										checked={permission_row.id === 3}
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
						class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
					>
						Crear rol
					</button>
				</form>
			</section>

			<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
				<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Editar rol</p>
				<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
					{selected_role ? selected_role.label : "Selecciona un rol"}
				</h3>

				{#if selected_role}
					<form class="mt-5 space-y-4">
						<input type="hidden" name="role_id" value={String(selected_role.id)} />

						<div>
							<label for="edit_role_key" class="text-sm font-medium text-copy/82">Clave</label>
							<input
								id="edit_role_key"
								type="text"
								name="key"
								value={selected_role.key}
								class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
							/>
						</div>

						<div>
							<label for="edit_role_label" class="text-sm font-medium text-copy/82">Nombre</label>
							<input
								id="edit_role_label"
								type="text"
								name="label"
								value={selected_role.label}
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
								name="description"
								class="mt-2 block w-full rounded-2xl border border-primary/35 bg-white px-3.5 py-3 text-sm"
								>{selected_role.description ?? ""}</textarea
							>
						</div>

						<div>
							<p class="text-sm font-medium text-copy/82">Permisos</p>
							<div class="mt-3 grid gap-2 sm:grid-cols-2">
								{#each admin_roles_data.permissions as permission_row (permission_row.id)}
									<label
										class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
									>
										<input
											type="checkbox"
											name="permission_ids"
											value={String(permission_row.id)}
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
							class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
						>
							Guardar cambios
						</button>
					</form>

					<form class="mt-6">
						<input type="hidden" name="role_id" value={String(selected_role.id)} />
						<button
							type="submit"
							class="inline-flex h-11 items-center justify-center rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
						>
							Eliminar rol
						</button>
					</form>
				{:else}
					<p class="mt-5 text-sm leading-6 text-copy/66">
						Selecciona un rol de la tabla para editar sus permisos.
					</p>
				{/if}
			</section>
		</div>
	{/each}
</div>
