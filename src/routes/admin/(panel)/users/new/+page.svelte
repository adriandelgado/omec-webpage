<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<div class="space-y-6">
	<a
		href={resolve("/admin/users")}
		class="inline-flex h-10 items-center justify-center rounded-xl border border-primary/35 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
	>
		Volver a usuarios
	</a>

	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<div class="max-w-2xl">
			<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Crear usuario</p>
			<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">Nueva cuenta</h2>
		</div>

		<form class="mt-5 max-w-2xl space-y-4">
			<div>
				<label for="create_full_name" class="text-sm font-medium text-copy/82"
					>Nombre completo</label
				>
				<input
					id="create_full_name"
					type="text"
					name="full_name"
					value="Camila Vega"
					class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
				/>
			</div>

			<div>
				<label for="create_email" class="text-sm font-medium text-copy/82">Correo electrónico</label
				>
				<input
					id="create_email"
					type="email"
					name="email"
					value="camila.vega@example.com"
					class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
				/>
			</div>

			<div>
				<label for="create_temporary_password" class="text-sm font-medium text-copy/82">
					Contraseña temporal
				</label>
				<input
					id="create_temporary_password"
					type="password"
					name="temporary_password"
					value="TempPass!2026"
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
								checked={role_row.id === 2}
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
				Crear usuario
			</button>
		</form>
	</section>
</div>
