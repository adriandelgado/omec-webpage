<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import { login } from "../auth.remote";
	let form_error = $state("");
</script>

<fieldset disabled={!ready} class="min-w-0">
	{#if form_error}<p role="alert" class="mb-4 rounded border border-red-300 bg-red-50 p-3">
			{form_error}
		</p>{/if}

	<section class="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
		<h1 class="mb-6 text-2xl font-bold">Iniciar sesión</h1>
		<form
			{...login.enhance(async (form) => {
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
				>Correo electrónico<input
					class="rounded border p-2"
					{...login.fields.email.as("email")}
					autocomplete="username"
					required
				/></label
			>
			<label class="grid gap-1"
				>Contraseña<input
					class="rounded border p-2"
					{...login.fields.password.as("password")}
					maxlength="128"
					autocomplete="current-password"
					required
				/></label
			>
			{#each login.fields.allIssues() as issue, i (i)}<p role="alert">{issue.message}</p>{/each}
			{#if login.result}<p role="alert">{login.result.message}</p>{/if}
			<button
				class="rounded bg-blue-800 px-4 py-3 text-white disabled:opacity-50"
				disabled={!!login.pending}>{login.pending ? "Verificando…" : "Entrar"}</button
			>
		</form>
	</section>
</fieldset>
