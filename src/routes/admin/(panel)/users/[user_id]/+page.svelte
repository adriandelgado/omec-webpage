<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
</script>

<div class="space-y-6">
	<a
		href={resolve("/admin/users")}
		class="inline-flex h-10 items-center justify-center rounded-xl border border-primary/35 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
	>
		Volver a usuarios
	</a>

	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		{#each [[{ id: "usr_001", full_name: "Ana Torres", email: "ana.torres@example.com", role_ids: [1] }, { id: "usr_002", full_name: "Luis Moreno", email: "luis.moreno@example.com", role_ids: [2] }].find((user_row) => user_row.id === page.params.user_id)] as selected_user (selected_user?.id ?? "missing")}
			<div class="max-w-2xl">
				<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Editar usuario</p>
				<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">
					{selected_user ? selected_user.full_name : "Usuario no encontrado"}
				</h2>
			</div>

			{#if selected_user}
				<form class="mt-5 max-w-2xl space-y-4">
					<input type="hidden" name="user_id" value={selected_user.id} />

					<div>
						<label for="edit_full_name" class="text-sm font-medium text-copy/82"
							>Nombre completo</label
						>
						<input
							id="edit_full_name"
							type="text"
							name="full_name"
							value={selected_user.full_name}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
					</div>

					<div>
						<label for="edit_email" class="text-sm font-medium text-copy/82"
							>Correo electrónico</label
						>
						<input
							id="edit_email"
							type="email"
							name="email"
							value={selected_user.email}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
						/>
					</div>

					<div>
						<p class="text-sm font-medium text-copy/82">Roles asignados</p>
						<div class="mt-3 grid gap-2 sm:grid-cols-2">
							{#each [{ id: 1, key: "super_admin", label: "Superadministrador" }, { id: 2, key: "content_reviewer", label: "Revisor de contenido" }] as role_row (role_row.id)}
								<label
									class="flex items-start gap-3 rounded-2xl border border-primary/20 px-3 py-3 text-sm"
								>
									<input
										type="checkbox"
										name="role_ids"
										value={String(role_row.id)}
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
					</div>

					<button
						type="submit"
						class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
					>
						Guardar cambios
					</button>
				</form>

				<form class="mt-6 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-4">
					<input type="hidden" name="user_id" value={selected_user.id} />
					<label for="reset_password" class="text-sm font-medium text-copy/82">
						Nueva contraseña temporal
					</label>
					<input
						id="reset_password"
						type="password"
						name="temporary_password"
						value="ResetPass!2026"
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>

					<button
						type="submit"
						class="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-primary/35 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/8 disabled:cursor-not-allowed disabled:opacity-70"
					>
						Restablecer contraseña
					</button>
				</form>

				<form class="mt-6">
					<input type="hidden" name="user_id" value={selected_user.id} />
					<button
						type="submit"
						class="inline-flex h-11 items-center justify-center rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
					>
						Eliminar usuario
					</button>
				</form>
			{:else}
				<p class="mt-5 text-sm leading-6 text-copy/66">
					No existe una cuenta administrativa con el identificador solicitado.
				</p>
			{/if}
		{/each}
	</section>
</div>
