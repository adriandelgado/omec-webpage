<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import PasswordForm from "#lib/components/admin-password-form.svelte";
	import {
		security_info,
		revoke_sessions,
		begin_totp,
		finish_totp,
		manage_totp,
	} from "../auth.remote";
	const info = $derived(await security_info());
	let recovery_codes = $state<string[]>([]);
	let form_error = $state("");
</script>

<fieldset disabled={!ready} class="min-w-0">
	{#if form_error}<p role="alert" class="mb-4 rounded border border-red-300 bg-red-50 p-3">
			{form_error}
		</p>{/if}

	<h1 class="mb-6 text-3xl font-bold">Seguridad de la cuenta</h1>
	<section class="mb-8 rounded border bg-white p-6">
		<h2 class="mb-4 text-xl font-bold">Contraseña</h2>
		<PasswordForm />
	</section>
	<section class="mb-8 rounded border bg-white p-6">
		<h2 class="mb-4 text-xl font-bold">Sesiones</h2>
		<ul class="mb-4 space-y-2">
			{#each info.sessions as session, i (i)}<li>
					{session.current ? "Esta sesión" : "Otra sesión"} · Última actividad: {new Date(
						session.last_seen_at,
					).toLocaleString("es-EC")}
				</li>{/each}
		</ul>
		<form
			{...revoke_sessions.enhance(async (form) => {
				form_error = "";
				try {
					await form.submit();
					await security_info().refresh();
				} catch (cause) {
					form_error = admin_error_message(cause, "No se pudo completar la operación.");
				}
			})}
		>
			<button class="rounded border p-2" disabled={!!revoke_sessions.pending}
				>Cerrar las demás sesiones</button
			>
		</form>
		{#if revoke_sessions.result}<p role="status">{revoke_sessions.result.message}</p>{/if}
	</section>
	<section class="rounded border bg-white p-6">
		<h2 class="mb-4 text-xl font-bold">Verificación en dos pasos</h2>
		{#if !info.totp}
			<form
				{...begin_totp.enhance(async (form) => {
					form_error = "";
					try {
						await form.submit();
					} catch (cause) {
						form_error = admin_error_message(cause, "No se pudo completar la operación.");
					}
				})}
				class="grid max-w-lg gap-3"
			>
				<label class="grid gap-1"
					>Confirma tu contraseña<input
						class="rounded border p-2"
						{...begin_totp.fields.password.as("password")}
						autocomplete="current-password"
						required
					/></label
				>
				<button class="rounded border p-2" disabled={!!begin_totp.pending}
					>Configurar aplicación de autenticación</button
				>
			</form>
			{#if begin_totp.result}
				<!-- SVG is generated exclusively by the QR renderer from a server-generated TOTP URI. -->
				<div class="my-4 max-w-64">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html begin_totp.result.qr}
				</div>
				<p class="mb-4 break-all">Clave: {begin_totp.result.secret}</p>
				<form
					{...finish_totp.enhance(async (form) => {
						form_error = "";
						try {
							if (await form.submit()) {
								recovery_codes = finish_totp.result?.codes ?? [];
								await security_info().refresh();
							}
						} catch (cause) {
							form_error = admin_error_message(cause, "No se pudo completar la operación.");
						}
					})}
					class="grid max-w-lg gap-3"
				>
					<label class="grid gap-1"
						>Contraseña<input
							class="rounded border p-2"
							{...finish_totp.fields.password.as("password")}
							autocomplete="current-password"
							required
						/></label
					>
					<label class="grid gap-1"
						>Primer código<input
							class="rounded border p-2"
							{...finish_totp.fields.code.as("text")}
							autocomplete="one-time-code"
							inputmode="numeric"
							pattern={"[0-9]{6}"}
							required
						/></label
					>
					<button class="rounded bg-blue-800 p-3 text-white" disabled={!!finish_totp.pending}
						>Activar verificación</button
					>
				</form>
			{/if}
		{:else}
			<p class="mb-4">La verificación en dos pasos está activa.</p>
			<form
				{...manage_totp.enhance(async (form) => {
					form_error = "";
					try {
						if (await form.submit()) {
							recovery_codes = manage_totp.result?.codes ?? [];
							await security_info().refresh();
						}
					} catch (cause) {
						form_error = admin_error_message(cause, "No se pudo completar la operación.");
					}
				})}
				class="grid max-w-lg gap-3"
			>
				<label class="grid gap-1"
					>Contraseña<input
						class="rounded border p-2"
						{...manage_totp.fields.password.as("password")}
						autocomplete="current-password"
						required
					/></label
				>
				<label class="grid gap-1"
					>Código de autenticación o recuperación<input
						class="rounded border p-2"
						{...manage_totp.fields.code.as("text")}
						autocomplete="one-time-code"
						required
					/></label
				>
				<label class="grid gap-1"
					>Acción<select {...manage_totp.fields.action.as("select")} class="rounded border p-2"
						><option value="regenerate">Reemplazar códigos de recuperación</option><option
							value="disable">Desactivar verificación</option
						></select
					></label
				>
				<button class="rounded border p-2" disabled={!!manage_totp.pending}>Confirmar cambio</button
				>
			</form>
		{/if}
		{#if manage_totp.result}<p role="status">{manage_totp.result.message}</p>{/if}
		{#if recovery_codes.length}
			<div class="mt-6 rounded border border-amber-500 bg-amber-50 p-4" role="status">
				<p class="font-bold">
					Guarda estos códigos ahora. Solo se muestran una vez y cada uno sirve para un único
					acceso.
				</p>
				<ul>
					{#each recovery_codes as code (code)}<li class="font-mono break-all">
							{code}
						</li>{/each}
				</ul>
			</div>
		{/if}
	</section>
</fieldset>
