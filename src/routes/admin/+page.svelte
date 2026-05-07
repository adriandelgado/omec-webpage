<script lang="ts">
	import { redirect_if_authenticated, login_admin } from "./admin.remote";
	import { login_form_schema } from "./login-form";

	await redirect_if_authenticated();
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<h1>Admin Login</h1>

{#if login_admin.fields.allIssues()?.length}
	<p>Credenciales inválidas o formulario incompleto.</p>
{/if}

<form {...login_admin.preflight(login_form_schema)}>
	<div>
		<label for="email">Correo electrónico</label>
		<input id="email" autocomplete="username" {...login_admin.fields.email.as("email")} />
		{#each login_admin.fields.email.issues() ?? [] as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</div>

	<div>
		<label for="password">Contraseña</label>
		<input
			id="password"
			autocomplete="current-password"
			{...login_admin.fields._password.as("password")}
		/>
		{#each login_admin.fields._password.issues() ?? [] as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</div>

	<button type="submit" disabled={login_admin.pending > 0}>
		{login_admin.pending > 0 ? "Ingresando..." : "Ingresar"}
	</button>
</form>
