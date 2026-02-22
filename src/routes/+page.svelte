<script lang="ts">
	import { resolve } from "$app/paths";
	import logo_omec from "$lib/assets/logo-omec.png";

	const links = [
		{
			text: "Acerca de",
			href: "/acerca",
		},
		{
			text: "Entrenamiento",
			href: "/entrenamiento",
		},
		{
			text: "Informacion",
			href: "/informacion",
		},
		{
			text: "Olimpiadas Anteriores",
			href: "/olimpiadas-anteriores",
		},
		{
			text: "Contacto",
			href: "/contacto",
		},
	] as const;
</script>

<header class="absolute inset-x-0 top-0 z-50">
	<nav aria-label="Global" class="flex items-center justify-between p-6 lg:px-8">
		<div class="flex lg:flex-1">
			<a href={resolve("/")} class="-m-1.5 p-1.5">
				<span class="sr-only">OMEC</span>
				<img src={logo_omec} alt="" class="h-8 w-auto" />
			</a>
		</div>
		<div class="flex lg:hidden">
			<button
				type="button"
				command="show-modal"
				commandfor="mobile-menu"
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					data-slot="icon"
					aria-hidden="true"
					class="size-6"
				>
					<path
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			{#each links as link (link.href)}
				<a href={resolve(link.href)} class="text-sm/6 font-semibold text-gray-900">{link.text}</a>
			{/each}
		</div>
		<!-- TODO: quitar esto -->
		<div class="hidden lg:flex lg:flex-1 lg:justify-end"></div>
	</nav>
	<div>
		<dialog id="mobile-menu" class="m-0 p-0 backdrop:bg-transparent lg:hidden">
			<div class="fixed inset-0 focus:outline-0">
				<div
					class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
				>
					<div class="flex items-center justify-between">
						<a href={resolve("/")} class="-m-1.5 p-1.5">
							<span class="sr-only">OMEC</span>
							<img src={logo_omec} alt="" class="h-8 w-auto" />
						</a>
						<button
							type="button"
							command="close"
							commandfor="mobile-menu"
							class="-m-2.5 rounded-md p-2.5 text-gray-700"
						>
							<span class="sr-only">Close menu</span>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								data-slot="icon"
								aria-hidden="true"
								class="size-6"
							>
								<path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</button>
					</div>
					<div class="mt-6 flow-root">
						<div class="-my-6 divide-y divide-gray-500/10">
							<div class="space-y-2 py-6">
								{#each links as link (link.href)}
									<a
										href={resolve(link.href)}
										class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
										>{link.text}</a
									>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</dialog>
	</div>
</header>

<main></main>
<!-- Footer -->
<footer class="relative mx-auto mt-32 max-w-7xl px-6 lg:px-8">
	<div class="border-t border-gray-900/10 py-16 sm:py-24 lg:py-32">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<img
				src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
				alt="Company name"
				class="h-9"
			/>
			<div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<div>
						<h3 class="text-sm/6 font-semibold text-gray-900">Solutions</h3>
						<ul role="list" class="mt-6 space-y-4">
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Hosting</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Data services</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Uptime monitoring</a
								>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900"
									>Enterprise services</a
								>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Analytics</a>
							</li>
						</ul>
					</div>
					<div class="mt-10 md:mt-0">
						<h3 class="text-sm/6 font-semibold text-gray-900">Support</h3>
						<ul role="list" class="mt-6 space-y-4">
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Submit ticket</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Documentation</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Guides</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<div>
						<h3 class="text-sm/6 font-semibold text-gray-900">Company</h3>
						<ul role="list" class="mt-6 space-y-4">
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">About</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Blog</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Jobs</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Press</a>
							</li>
						</ul>
					</div>
					<div class="mt-10 md:mt-0">
						<h3 class="text-sm/6 font-semibold text-gray-900">Legal</h3>
						<ul role="list" class="mt-6 space-y-4">
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Terms of service</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">Privacy policy</a>
							</li>
							<li>
								<a href="#" class="text-sm/6 text-gray-600 hover:text-gray-900">License</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>
