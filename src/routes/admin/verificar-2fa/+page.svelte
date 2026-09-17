<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import { verify_login } from "../auth.remote";
	let form_error = $state("");
</script>

<fieldset disabled={!ready} class="min-w-0">
	{#if form_error}<p role="alert" class="mb-4 rounded border border-red-300 bg-red-50 p-3">
			{form_error}
		</p>{/if}

	<section class="mx-auto max-w-md rounded-xl border bg-white p-6">
		<h1 class="mb-4 text-2xl font-bold">Verificar identidad</h1>
		<p class="mb-4">
			Escribe el código de tu aplicación o un código de recuperación. La solicitud vence en cinco
			minutos.
		</p>
		<form
			{...verify_login.enhance(async (form) => {
				form_error = "";
				try {
					await form.submit();
				} catch (cause) {
					form_error = admin_error_message(cause, "No se pudo completar la operación.");
				}
			})}
			class="grid gap-4"
		>
			<label class="grid gap-1"
				>Código<input
					class="rounded border p-2"
					{...verify_login.fields.code.as("text")}
					autocomplete="one-time-code"
					required
					maxlength="64"
				/></label
			>
			{#if verify_login.result}<p role="alert">{verify_login.result.message}</p>{/if}
			<button class="rounded bg-blue-800 p-3 text-white" disabled={!!verify_login.pending}
				>Verificar</button
			>
		</form>
		<a class="mt-4 block underline" href="/admin/iniciar-sesion">Volver a iniciar sesión</a>
	</section>
</fieldset>
