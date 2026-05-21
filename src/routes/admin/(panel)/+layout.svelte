<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { KeyRound, LogOut, Mail, ShieldCheck, Users } from "@lucide/svelte";

	let { children } = $props();
</script>

<div class="min-h-screen bg-background/60">
	<div class="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 lg:px-6 lg:py-6">
		<header
			class="rounded-3xl border border-primary/35 bg-white/92 p-4 shadow-[4px_4px_0_0_var(--color-primary)] lg:p-5"
		>
			<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-primary uppercase">Panel OMEC</p>
					<h1 class="mt-2 text-2xl font-semibold tracking-tight text-copy lg:text-3xl">
						Administración interna
					</h1>
					<p class="mt-2 max-w-2xl text-sm leading-6 text-copy/68">
						Gestiona usuarios, roles, permisos y mensajes enviados desde el formulario público.
					</p>
				</div>

				<div class="flex flex-col gap-3 lg:items-end">
					<div class="rounded-2xl border border-primary/20 bg-primary/6 px-4 py-3 text-sm">
						<p class="font-medium text-copy">Administrador OMEC</p>
						<p class="mt-1 text-copy/65">admin@example.com</p>
					</div>

					<form>
						<button
							type="submit"
							class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/35 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/8 disabled:cursor-not-allowed disabled:opacity-70"
						>
							<LogOut class="size-4" aria-hidden="true" />
							Cerrar sesión
						</button>
					</form>
				</div>
			</div>
		</header>

		<div class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
			<aside class="rounded-3xl border border-primary/30 bg-white/88 p-3 lg:p-4">
				<nav class="space-y-2" aria-label="Navegación del panel administrativo">
					<a
						href={resolve("/admin/(panel)/users")}
						class={[
							"flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
							page.url.pathname === "/admin/users"
								? "bg-primary text-white shadow-[3px_3px_0_0_var(--color-primary)]"
								: "text-copy/74 hover:bg-primary/8 hover:text-primary",
						]}
					>
						<Users class="size-4" aria-hidden="true" />
						<span>Usuarios</span>
					</a>

					<a
						href={resolve("/admin/(panel)/roles")}
						class={[
							"flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
							page.url.pathname === "/admin/roles"
								? "bg-primary text-white shadow-[3px_3px_0_0_var(--color-primary)]"
								: "text-copy/74 hover:bg-primary/8 hover:text-primary",
						]}
					>
						<ShieldCheck class="size-4" aria-hidden="true" />
						<span>Roles</span>
					</a>

					<a
						href={resolve("/admin/(panel)/permissions")}
						class={[
							"flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
							page.url.pathname === "/admin/permissions"
								? "bg-primary text-white shadow-[3px_3px_0_0_var(--color-primary)]"
								: "text-copy/74 hover:bg-primary/8 hover:text-primary",
						]}
					>
						<KeyRound class="size-4" aria-hidden="true" />
						<span>Permisos</span>
					</a>

					<a
						href={resolve("/admin/(panel)/contact-submissions")}
						class={[
							"flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
							page.url.pathname === "/admin/contact-submissions"
								? "bg-primary text-white shadow-[3px_3px_0_0_var(--color-primary)]"
								: "text-copy/74 hover:bg-primary/8 hover:text-primary",
						]}
					>
						<Mail class="size-4" aria-hidden="true" />
						<span>Mensajes</span>
					</a>
				</nav>
			</aside>

			<div class="min-w-0">
				{@render children()}
			</div>
		</div>
	</div>
</div>
