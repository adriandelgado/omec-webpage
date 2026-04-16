<script lang="ts">
	import { Dialog } from "bits-ui";
	import { Menu, X } from "@lucide/svelte";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import logo_omec from "$lib/assets/logo-omec.svg";
	import { ROUTES } from "$lib/constants";

	const home_href = resolve("/");

	function is_active_route(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	let is_mobile_menu_open = $state(false);
</script>

<header
	class="sticky top-0 z-50 border-x border-b border-primary bg-foreground/90 px-4 backdrop-blur-sm lg:px-6"
>
	<Dialog.Root bind:open={is_mobile_menu_open}>
		<nav
			aria-label="Global"
			class="mx-auto flex max-w-270 items-center justify-between py-3 lg:grid lg:grid-cols-[1fr_auto_1fr]"
		>
			<a href={home_href} class="-m-1 flex flex-1 p-1 lg:justify-self-start">
				<span class="sr-only">OMEC</span>
				<img src={logo_omec} alt="" class="h-9 w-auto" />
			</a>
			<Dialog.Trigger
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-colors hover:text-primary lg:hidden"
			>
				<span class="sr-only">Open main menu</span>
				<Menu aria-hidden="true" class="size-6" strokeWidth={1.5} />
			</Dialog.Trigger>
			<div class="hidden items-center gap-x-8 lg:col-start-2 lg:flex">
				{#each ROUTES as link (link.href)}
					{@const is_active = is_active_route(link.href)}
					<a
						href={resolve(link.href)}
						aria-current={is_active ? "page" : undefined}
						class={[
							"text-sm font-medium transition-colors before:text-primary before:content-['['] after:text-primary after:content-[']'] hover:text-primary hover:before:visible hover:after:visible",
							is_active ? "before:visible after:visible" : "before:invisible after:invisible",
						]}
					>
						{link.text}
					</a>
				{/each}
			</div>
		</nav>

		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 z-60 bg-copy/20 backdrop-blur-xs lg:hidden" />
			<Dialog.Content
				preventScroll={false}
				class="fixed inset-y-0 right-0 z-70 flex w-full max-w-sm flex-col overflow-y-auto border-l border-primary bg-foreground p-6 shadow-2xl focus:outline-none lg:hidden"
			>
				<Dialog.Title class="sr-only">Main menu</Dialog.Title>
				<div class="flex items-center justify-between">
					<a href={home_href} class="-m-1 p-1" onclick={() => (is_mobile_menu_open = false)}>
						<span class="sr-only">OMEC</span>
						<img src={logo_omec} alt="" class="h-9 w-auto" />
					</a>
					<Dialog.Close class="-m-2.5 rounded-md p-2.5 transition-colors hover:text-primary">
						<span class="sr-only">Close menu</span>
						<X aria-hidden="true" class="size-6" strokeWidth={1.5} />
					</Dialog.Close>
				</div>

				<div class="mt-6 space-y-2 py-6">
					{#each ROUTES as link (link.href)}
						{@const is_active = is_active_route(link.href)}
						<a
							href={resolve(link.href)}
							aria-current={is_active ? "page" : undefined}
							onclick={() => (is_mobile_menu_open = false)}
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold transition-colors hover:bg-background hover:text-primary"
						>
							<span class="inline-flex items-center">
								<span class={["text-primary", !is_active && "invisible"]}>[</span>
								<span>{link.text}</span>
								<span class={["text-primary", !is_active && "invisible"]}>]</span>
							</span>
						</a>
					{/each}
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</header>
