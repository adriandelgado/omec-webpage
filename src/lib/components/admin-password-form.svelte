<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import { change_password } from "../../routes/admin/auth.remote";
	let form_error = $state("");
</script>

<fieldset disabled={!ready} class="min-w-0">
	{#if form_error}<p role="alert" class="mb-4 rounded border border-red-300 bg-red-50 p-3">
			{form_error}
		</p>{/if}

	<form
		{...change_password.enhance(async (form) => {
			form_error = "";
			try {
				await form.submit();
			} catch (cause) {
				form_error = admin_error_message(cause, "No se pudo completar la operación.");
			}
		})}
		class="grid max-w-lg gap-4"
	>
		<label class="grid gap-1"
			>Contraseña actual<input
				class="rounded border p-2"
				{...change_password.fields.current_password.as("password")}
				autocomplete="current-password"
				required
				minlength="12"
				maxlength="128"
			/></label
		>
		<label class="grid gap-1"
			>Nueva contraseña<input
				class="rounded border p-2"
				{...change_password.fields.password.as("password")}
				autocomplete="new-password"
				required
				minlength="12"
				maxlength="128"
			/></label
		>
		<p>Usa entre 12 y 128 caracteres. Se cerrarán todas las demás sesiones.</p>
		{#each change_password.fields.allIssues() as issue, i (i)}<p role="alert">
				{issue.message}
			</p>{/each}
		<button class="rounded bg-blue-800 p-3 text-white" disabled={!!change_password.pending}
			>Cambiar contraseña</button
		>
	</form>
</fieldset>
