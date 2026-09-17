<script lang="ts">
	import { admin_error_message } from "#lib/admin-errors.js";
	import { onMount } from "svelte";
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import { list_accounts, create_account, update_account } from "../accounts.remote";
	const accounts = $derived(await list_accounts());
	let email = $state(""),
		name = $state(""),
		role = $state<"superadmin" | "admin" | "editor">("editor");
	let temporary_password = $state<string | null>(null),
		notice = $state(""),
		pending = $state(false);
	async function create() {
		pending = true;
		temporary_password = null;
		try {
			const result = await create_account({ email, name, role });
			temporary_password = result.password;
			notice = "Cuenta creada.";
			await list_accounts().refresh();
		} catch (cause) {
			notice = admin_error_message(cause, "No se pudo crear.");
		} finally {
			pending = false;
		}
	}
	async function change(
		account: (typeof accounts)[number],
		action: "role" | "suspend" | "activate" | "reset" | "delete",
		new_role = account.role,
	) {
		if (
			!confirm("¿Confirmar el cambio de la cuenta " + account.email + "? Se cerrarán sus sesiones.")
		)
			return;
		pending = true;
		temporary_password = null;
		try {
			const result = await update_account({
				id: account.id,
				updated_at: account.updated_at,
				action,
				role: new_role,
			});
			temporary_password = result.password;
			notice = result.message;
			await list_accounts().refresh();
		} catch (cause) {
			notice = admin_error_message(cause, "No se pudo actualizar.");
		} finally {
			pending = false;
		}
	}
</script>

<fieldset disabled={!ready} class="min-w-0">
	<h1 class="mb-6 text-3xl font-bold">Cuentas de administración</h1>
	{#if notice}<p role="status" class="mb-4">{notice}</p>{/if}
	{#if temporary_password}
		<div class="mb-6 rounded border border-amber-500 bg-amber-50 p-4">
			<p>Contraseña temporal: se muestra una sola vez. Entrégala de forma privada.</p>
			<code class="break-all">{temporary_password}</code>
			<button class="mt-3 block underline" onclick={() => (temporary_password = null)}
				>Ya la guardé</button
			>
		</div>
	{/if}
	<form
		class="mb-8 grid gap-3 rounded border bg-white p-5 sm:grid-cols-2"
		onsubmit={(event) => {
			event.preventDefault();
			create();
		}}
	>
		<label class="grid gap-1"
			>Nombre<input class="rounded border p-2" bind:value={name} required /></label
		>
		<label class="grid gap-1"
			>Correo electrónico<input
				class="rounded border p-2"
				type="email"
				bind:value={email}
				required
			/></label
		>
		<label class="grid gap-1"
			>Rol<select class="rounded border p-2" bind:value={role}
				><option value="editor">Editor</option><option value="admin">Administrador</option><option
					value="superadmin">Superadministrador</option
				></select
			></label
		>
		<button class="rounded bg-blue-800 p-3 text-white" disabled={pending}>Crear cuenta</button>
	</form>
	<ul class="space-y-4">
		{#each accounts as account (account.id)}
			<li class="rounded border bg-white p-4">
				<h2 class="font-bold">{account.name} · {account.email}</h2>
				<p>
					{account.suspended ? "Suspendida" : "Activa"}
					{account.temporary ? "· Contraseña temporal" : ""}
				</p>
				<div class="mt-3 flex flex-wrap items-center gap-3">
					<label
						>Rol <select
							class="rounded border p-2"
							value={account.role}
							onchange={(event) =>
								change(account, "role", event.currentTarget.value as typeof role)}
							disabled={pending}
							><option value="editor">Editor</option><option value="admin">Administrador</option
							><option value="superadmin">Superadministrador</option></select
						></label
					>
					<button
						class="underline"
						disabled={pending}
						onclick={() => change(account, account.suspended ? "activate" : "suspend")}
						>{account.suspended ? "Reactivar" : "Suspender"}</button
					>
					<button class="underline" disabled={pending} onclick={() => change(account, "reset")}
						>Restablecer contraseña</button
					>
					<button
						class="text-red-800 underline"
						disabled={pending}
						onclick={() => change(account, "delete")}>Eliminar cuenta</button
					>
				</div>
			</li>
		{/each}
	</ul>
</fieldset>
