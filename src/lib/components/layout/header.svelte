<script lang="ts">
	import { Menu, X } from "@lucide/svelte";
	import { resolve } from "$app/paths";
	import logo_omec from "$lib/assets/logo-omec.svg";
	import { ROUTES } from "$lib/constants";

	const home_href = resolve("/");
</script>

<header class="sticky top-0 z-50 border-b border-line bg-sheet/95 px-4 backdrop-blur-sm lg:px-6">
	<nav
		aria-label="Global"
		class="mx-auto flex max-w-270 items-center justify-between py-3 lg:grid lg:grid-cols-[1fr_auto_1fr]"
	>
		<a href={home_href} class="-m-1 flex flex-1 p-1 lg:justify-self-start">
			<span class="sr-only">OMEC</span>
			<img src={logo_omec} alt="" class="h-9 w-auto" />
		</a>
		<button
			type="button"
			command="show-modal"
			commandfor="mobile-menu"
			class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 lg:hidden"
		>
			<span class="sr-only">Open main menu</span>
			<Menu aria-hidden="true" class="size-6" strokeWidth={1.5} />
		</button>
		<div class="hidden items-center gap-x-8 lg:col-start-2 lg:flex">
			{#each ROUTES as link (link.href)}
				<a
					href={resolve(link.href)}
					class="text-sm font-medium text-copy transition-colors hover:text-primary">{link.text}</a
				>
			{/each}
		</div>
	</nav>

	<dialog
		id="mobile-menu"
		class="fixed inset-0 m-0 max-h-none max-w-none bg-transparent p-0 backdrop:bg-transparent lg:hidden"
	>
		<div
			class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 focus:outline-0 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
		>
			<div class="flex items-center justify-between">
				<a href={home_href} class="-m-1 p-1">
					<span class="sr-only">OMEC</span>
					<img src={logo_omec} alt="" class="h-9 w-auto" />
				</a>
				<button
					type="button"
					command="close"
					commandfor="mobile-menu"
					class="-m-2.5 rounded-md p-2.5 text-gray-700"
				>
					<span class="sr-only">Close menu</span>
					<X aria-hidden="true" class="size-6" strokeWidth={1.5} />
				</button>
			</div>

			<div class="mt-6 space-y-2 py-6">
				{#each ROUTES as link (link.href)}
					<a
						href={resolve(link.href)}
						class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
						>{link.text}</a
					>
				{/each}
			</div>
		</div>
	</dialog>
</header>
