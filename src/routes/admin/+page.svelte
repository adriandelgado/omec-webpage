<script lang="ts">
	import ContentSection from "$lib/components/content-section.svelte";
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { redirect_if_authenticated, login_admin } from "./admin.remote";
	import { login_form_schema } from "./login-form";

	await redirect_if_authenticated();
</script>

<Seo
	title="Admin Login"
	description="Acceso administrativo de OMEC para revisar inscripciones, gestionar contenidos y operar el panel interno."
/>

<PageSectionStack class="py-10 lg:py-16">
	<ContentSection>
		<div
			class="grid gap-6 rounded-3xl border border-primary/40 bg-background/70 p-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-8 lg:p-6"
		>
			<section class="rounded-3xl bg-primary px-6 py-7 text-white lg:px-8 lg:py-8">
				<p class="text-xs font-semibold tracking-widest text-white/70 uppercase">OMEC</p>
				<h1 class="mt-4 max-w-70 text-3xl leading-tight font-semibold tracking-tight lg:text-4xl">
					Acceso administrativo
				</h1>
				<p class="mt-4 max-w-92 text-sm leading-7 text-white/78">
					Ingresa con tu cuenta institucional para revisar inscripciones, gestionar contenidos y
					continuar con la operación interna del sitio.
				</p>

				<div class="mt-8 space-y-3 text-sm text-white/82">
					<div class="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
						<p class="font-medium">Acceso restringido</p>
						<p class="mt-1 text-white/72">Solo para administradores autorizados de OMEC.</p>
					</div>
					<div class="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
						<p class="font-medium">Inicio seguro</p>
						<p class="mt-1 text-white/72">
							Usa tu correo registrado y tu contraseña actual para continuar.
						</p>
					</div>
				</div>
			</section>

			<div
				class="rounded-3xl border border-primary bg-white/92 p-5 shadow-[4px_4px_0_0_var(--color-primary)] lg:p-7"
			>
				<div class="max-w-110">
					<p class="text-sm font-medium tracking-widest text-primary uppercase">Iniciar sesión</p>
					<h2 class="mt-3 text-2xl leading-tight font-semibold text-copy">Panel administrativo</h2>
					<p class="mt-3 text-sm leading-6 text-copy/68">
						Completa tus credenciales para ingresar al área privada.
					</p>
				</div>

				{#if login_admin.fields.allIssues()?.length}
					<div
						class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
						role="alert"
					>
						Credenciales inválidas o formulario incompleto.
					</div>
				{/if}

				<form {...login_admin.preflight(login_form_schema)} class="mt-6 space-y-4">
					<div>
						<label for="email" class="text-sm font-medium text-copy/82">Correo electrónico</label>
						<input
							id="email"
							autocomplete="username"
							placeholder="admin@omec-mat.org"
							{...login_admin.fields.email.as("email")}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/40 bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
						/>
						{#each login_admin.fields.email.issues() ?? [] as issue (issue.message)}
							<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
						{/each}
					</div>

					<div>
						<label for="password" class="text-sm font-medium text-copy/82">Contraseña</label>
						<input
							id="password"
							autocomplete="current-password"
							placeholder="Tu contraseña"
							{...login_admin.fields._password.as("password")}
							class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/40 bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
						/>
						{#each login_admin.fields._password.issues() ?? [] as issue (issue.message)}
							<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
						{/each}
					</div>

					<button
						type="submit"
						disabled={login_admin.pending > 0}
						class="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{login_admin.pending > 0 ? "Ingresando..." : "Ingresar"}
					</button>
				</form>
			</div>
		</div>
	</ContentSection>
</PageSectionStack>
