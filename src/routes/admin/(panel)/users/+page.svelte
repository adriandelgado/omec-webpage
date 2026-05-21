<script lang="ts">
	import { resolve } from "$app/paths";
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
				2 usuarios activos
			</div>
		</div>

		<a
			href={resolve("/admin/users/new")}
			class="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92"
		>
			Crear usuario
		</a>

		<div class="mt-5 overflow-x-auto rounded-2xl border border-primary/18">
			<table class="min-w-full divide-y divide-primary/15 text-left text-sm">
				<thead class="bg-primary/6 text-copy/74">
					<tr>
						<th class="px-4 py-3 font-semibold">Usuario</th>
						<th class="px-4 py-3 font-semibold">Roles</th>
						<th class="px-4 py-3 font-semibold">Permisos efectivos</th>
						<th class="px-4 py-3 font-semibold">Creado</th>
						<th class="px-4 py-3 font-semibold">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-primary/10 bg-white">
					{#each [{ id: "usr_001", full_name: "Ana Torres", email: "ana.torres@example.com", roles: [{ id: 1, key: "super_admin", label: "Superadministrador" }], permission_keys: ["admin.users.manage", "admin.roles.manage", "admin.messages.read"], created_at: "2026-05-10T08:45:00" }, { id: "usr_002", full_name: "Luis Moreno", email: "luis.moreno@example.com", roles: [{ id: 2, key: "content_reviewer", label: "Revisor de contenido" }], permission_keys: ["admin.messages.read"], created_at: "2026-05-15T13:20:00" }] as user_row (user_row.id)}
						<tr>
							<td class="px-4 py-3 align-top">
								<p class="font-medium text-copy">{user_row.full_name}</p>
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
							<td class="px-4 py-3 align-top text-copy/62">
								{new Intl.DateTimeFormat("es-EC", {
									dateStyle: "medium",
									timeStyle: "short",
								}).format(new Date(user_row.created_at))}
							</td>
							<td class="px-4 py-3 align-top">
								<a
									href={resolve(`/admin/users/${user_row.id}`)}
									class="inline-flex h-10 items-center justify-center rounded-xl border border-primary/35 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
								>
									Editar
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-6 text-center text-copy/60">
								No hay usuarios activos para mostrar.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
