<script lang="ts">
	import { logout } from "./auth.remote";
	let { data, children } = $props();
</script>

<svelte:head>
	<title>Administración · OMEC</title>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>
<div class="min-h-screen bg-slate-50 text-slate-900">
	<a class="sr-only focus:not-sr-only" href="#admin-main">Saltar al contenido</a>
	<header class="border-b bg-white px-4 py-5 md:px-8">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
			<a href="/admin" class="text-xl font-bold">OMEC · Administración</a>
			{#if data.admin}
				<div class="flex flex-wrap items-center gap-4">
					<span>{data.admin.name}</span>
					<a class="underline" href="/admin/seguridad">Seguridad</a>
					<a class="underline" href="/">Ver sitio</a>
					<form {...logout}><button class="rounded border px-3 py-2">Cerrar sesión</button></form>
				</div>
			{/if}
		</div>
	</header>
	{#if data.admin && !data.admin.must_change_password}
		<nav
			aria-label="Administración"
			class="mx-auto flex max-w-7xl flex-wrap gap-4 px-4 py-4 md:px-8"
		>
			<a class="underline" href="/admin">Resumen</a>
			<a class="underline" href="/admin/contenido/news_article">Noticias</a>
			<a class="underline" href="/admin/medios">Medios</a>
			{#if data.admin.role !== "editor"}<a
					class="underline"
					href="/admin/contenido/contact_submission">Mensajes</a
				>{/if}
			{#if data.admin.role === "superadmin"}
				<a class="underline" href="/admin/cuentas">Cuentas</a>
				<a class="underline" href="/admin/auditoria">Auditoría</a>
			{/if}
		</nav>
	{/if}
	<main id="admin-main" tabindex="-1" class="mx-auto max-w-7xl p-4 md:p-8">
		{@render children()}
	</main>
</div>
