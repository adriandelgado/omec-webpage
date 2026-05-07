<script lang="ts">
	// TODO: made with vibecoding. please clean up
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import {
		create_admin_user,
		get_admin_users,
		reset_admin_user_password,
		soft_delete_admin_user,
		update_admin_user,
	} from "./users.remote";

	const admin_users_query = get_admin_users();
	const admin_users_data = $derived(await admin_users_query);

	const selected_user_id = $derived(page.url.searchParams.get("user"));
	const selected_user = $derived.by(() => {
		if (selected_user_id) {
			return admin_users_data.users.find((user_row) => user_row.id === selected_user_id) ?? null;
		}

		return admin_users_data.users[0] ?? null;
	});

	function format_date(date_value: Date) {
		return new Intl.DateTimeFormat("es-EC", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(date_value);
	}
</script>

<div class="space-y-6">
	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<div class="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Usuarios</p>
				<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">Cuentas activas</h2>
				<p class="mt-2 text-sm leading-6 text-copy/68">
					Administra accesos, roles asignados y contraseñas temporales.
				</p>
			</div>

			<div class="rounded-2xl border border-primary/20 bg-primary/6 px-4 py-3 text-sm text-copy/70">
				{admin_users_data.users.length} usuarios activos
			</div>
		</div>

		<div class="mt-5 overflow-x-auto rounded-2xl border border-primary/18">
			<table class="min-w-full divide-y divide-primary/15 text-left text-sm">
				<thead class="bg-primary/6 text-copy/74">
					<tr>
						<th class="px-4 py-3 font-semibold">Usuario</th>
						<th class="px-4 py-3 font-semibold">Roles</th>
						<th class="px-4 py-3 font-semibold">Permisos efectivos</th>
						<th class="px-4 py-3 font-semibold">Creado</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-primary/10 bg-white">
					{#each admin_users_data.users as user_row (user_row.id)}
						<tr class={selected_user?.id === user_row.id ? "bg-primary/6" : ""}>
							<td class="px-4 py-3 align-top">
								<a
									href={resolve(`/admin/users?user=${user_row.id}`)}
									class="block font-medium text-primary"
								>
									{user_row.full_name}
								</a>
								<p class="mt-1 text-copy/62">{user_row.email}</p>
							</td>
							<td class="px-4 py-3 align-top">
								<div class="flex flex-wrap gap-2">
									{#each user_row.roles as role_row (role_row.id)}
										<span
											class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
										>
											{role_row.label}
										</span>
									{:else}
										<span class="text-copy/50">Sin roles</span>
									{/each}
								</div>
							</td>
							<td class="px-4 py-3 align-top">
								<div class="flex flex-wrap gap-2">
									{#each user_row.permission_keys as permission_key (permission_key)}
										<span class="rounded-full bg-copy/6 px-2.5 py-1 text-xs text-copy/75">
											{permission_key}
										</span>
									{:else}
										<span class="text-copy/50">Sin permisos</span>
									{/each}
								</div>
							</td>
							<td class="px-4 py-3 align-top text-copy/62">{format_date(user_row.created_at)}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="px-4 py-6 text-center text-copy/60">
								No hay usuarios activos para mostrar.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<div class="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
		<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
			<div class="max-w-2xl">
				<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Crear usuario</p>
				<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">Nueva cuenta</h3>
			</div>

			{#if create_admin_user.result?.success}
				<div
					class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
				>
					{create_admin_user.result.message}
				</div>
			{/if}

			{#if create_admin_user.fields.allIssues()?.length}
				<div
					class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
				>
					Revisa los campos del formulario antes de guardar.
				</div>
			{/if}

			<form
				{...create_admin_user.enhance(async ({ submit }) => {
					await submit().updates(admin_users_query);
				})}
				class="mt-5 space-y-4"
			>
				<div>
					<label for="create_full_name" class="text-sm font-medium text-copy/82"
						>Nombre completo</label
					>
					<input
						id="create_full_name"
						{...create_admin_user.fields.full_name.as("text")}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
					{#each create_admin_user.fields.full_name.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<div>
					<label for="create_email" class="text-sm font-medium text-copy/82"
						>Correo electrónico</label
					>
					<input
						id="create_email"
						{...create_admin_user.fields.email.as("email")}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
					{#each create_admin_user.fields.email.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<div>
					<label for="create_temporary_password" class="text-sm font-medium text-copy/82">
						Contraseña temporal
					</label>
					<input
						id="create_temporary_password"
						{...create_admin_user.fields.temporary_password.as("password")}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
					{#each create_admin_user.fields.temporary_password.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<div>
					<p class="text-sm font-medium text-copy/82">Roles asignados</p>
					<div class="mt-3 grid gap-2 sm:grid-cols-2">
						{#each admin_users_data.roles as role_row (role_row.id)}
							<label
								class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
							>
								<input
									{...create_admin_user.fields.role_ids.as("checkbox", String(role_row.id))}
									class="mt-0.5 rounded border-primary/40 text-primary"
								/>
								<span>
									<span class="block font-medium text-copy">{role_row.label}</span>
									<span class="mt-1 block text-copy/62">{role_row.key}</span>
								</span>
							</label>
						{/each}
					</div>
					{#each create_admin_user.fields.role_ids.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}
				</div>

				<button
					type="submit"
					disabled={create_admin_user.pending > 0}
					class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{create_admin_user.pending > 0 ? "Guardando..." : "Crear usuario"}
				</button>
			</form>
		</section>

		<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
			<div class="max-w-2xl">
				<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Editar usuario</p>
				<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
					{selected_user ? selected_user.full_name : "Selecciona un usuario"}
				</h3>
			</div>

			{#if selected_user}
				{#if update_admin_user.result?.success}
					<div
						class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
					>
						{update_admin_user.result.message}
					</div>
				{/if}

				{#if reset_admin_user_password.result?.success}
					<div
						class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
					>
						{reset_admin_user_password.result.message}
					</div>
				{/if}

				{#if soft_delete_admin_user.result?.success}
					<div
						class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
					>
						{soft_delete_admin_user.result.message}
					</div>
				{/if}

				<form
					{...update_admin_user.enhance(async ({ submit }) => {
						await submit().updates(admin_users_query);
					})}
					class="mt-5 space-y-4"
				>
					<input {...update_admin_user.fields.user_id.as("hidden", selected_user.id)} />

					<div>
						<label for="edit_full_name" class="text-sm font-medium text-copy/82"
							>Nombre completo</label
						>
						<input
							id="edit_full_name"
							{...update_admin_user.fields.full_name.as("text", selected_user.full_name)}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
						{#each update_admin_user.fields.full_name.issues() ?? [] as issue (issue.message)}
							<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
						{/each}
					</div>

					<div>
						<label for="edit_email" class="text-sm font-medium text-copy/82"
							>Correo electrónico</label
						>
						<input
							id="edit_email"
							{...update_admin_user.fields.email.as("email", selected_user.email)}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
						{#each update_admin_user.fields.email.issues() ?? [] as issue (issue.message)}
							<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
						{/each}
					</div>

					<div>
						<p class="text-sm font-medium text-copy/82">Roles asignados</p>
						<div class="mt-3 grid gap-2 sm:grid-cols-2">
							{#each admin_users_data.roles as role_row (role_row.id)}
								<label
									class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
								>
									<input
										{...update_admin_user.fields.role_ids.as("checkbox", String(role_row.id))}
										checked={selected_user.role_ids.includes(role_row.id)}
										class="mt-0.5 rounded border-primary/40 text-primary"
									/>
									<span>
										<span class="block font-medium text-copy">{role_row.label}</span>
										<span class="mt-1 block text-copy/62">{role_row.key}</span>
									</span>
								</label>
							{/each}
						</div>
						{#each update_admin_user.fields.role_ids.issues() ?? [] as issue (issue.message)}
							<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
						{/each}
					</div>

					<div class="flex flex-wrap gap-3">
						<button
							type="submit"
							disabled={update_admin_user.pending > 0}
							class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{update_admin_user.pending > 0 ? "Guardando..." : "Guardar cambios"}
						</button>
					</div>
				</form>

				<form
					{...reset_admin_user_password.enhance(async ({ submit }) => {
						await submit().updates(admin_users_query);
					})}
					class="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4"
				>
					<input {...reset_admin_user_password.fields.user_id.as("hidden", selected_user.id)} />
					<label for="reset_password" class="text-sm font-medium text-copy/82"
						>Nueva contraseña temporal</label
					>
					<input
						id="reset_password"
						{...reset_admin_user_password.fields.temporary_password.as("password")}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
					{#each reset_admin_user_password.fields.temporary_password.issues() ?? [] as issue (issue.message)}
						<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
					{/each}

					<button
						type="submit"
						disabled={reset_admin_user_password.pending > 0}
						class="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-primary/35 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/8 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{reset_admin_user_password.pending > 0 ? "Restableciendo..." : "Restablecer contraseña"}
					</button>
				</form>

				<form
					{...soft_delete_admin_user.enhance(async ({ submit }) => {
						await submit().updates(admin_users_query);
					})}
					class="mt-6"
				>
					<input {...soft_delete_admin_user.fields.user_id.as("hidden", selected_user.id)} />
					<button
						type="submit"
						disabled={soft_delete_admin_user.pending > 0}
						class="inline-flex h-11 items-center justify-center rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{soft_delete_admin_user.pending > 0 ? "Eliminando..." : "Eliminar usuario"}
					</button>
				</form>
			{:else}
				<p class="mt-5 text-sm leading-6 text-copy/66">
					Selecciona un usuario de la tabla para editar sus datos o restablecer su contraseña.
				</p>
			{/if}
		</section>
	</div>
</div>
