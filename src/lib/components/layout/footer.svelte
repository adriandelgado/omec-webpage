<script lang="ts">
	import { resolve } from "$app/paths";
	import logo_omec from "$lib/assets/logo-omec.svg";
	import { ROUTES } from "$lib/constants";

	const resource_links = [
		{ text: "Problemas de Práctica", href: "#" },
		{ text: "Exámenes Anteriores", href: "#" },
		{ text: "Resultados", href: "#" },
		{ text: "Calendario de Eventos", href: "#" },
		{ text: "Preguntas Frecuentes", href: "#" },
	] as const;

	// TODO: consolidate the info in a constants.ts file
	const contact_links = [
		{
			text: "info@omec-mat.org",
			href: "mailto:info@omec-mat.org",
			label: "Correo electrónico",
		},
		{
			text: "+593 2 234-5678",
			href: "tel:+59322345678",
			label: "Teléfono",
		},
		{
			text: "Guayaquil, Ecuador",
			href: "https://maps.google.com/?q=Guayaquil,Ecuador",
			label: "Ubicación",
		},
	] as const;

	const legal_links = [
		{ text: "Política de Privacidad", href: "#" },
		{ text: "Términos de Uso", href: "#" },
	] as const;

	type footer_href =
		| (typeof ROUTES)[number]["href"]
		| (typeof resource_links)[number]["href"]
		| (typeof contact_links)[number]["href"]
		| (typeof legal_links)[number]["href"];

	function get_href(href: footer_href) {
		return href.startsWith("/") ? resolve(href as (typeof ROUTES)[number]["href"]) : href;
	}

	const icon_paths = {
		"Correo electrónico":
			"M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909A2.25 2.25 0 0 1 2.25 6.993V6.75",
		Teléfono:
			"M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h2.636c.966 0 1.8.662 2.02 1.603l.746 3.198a2.25 2.25 0 0 1-.542 2.06l-1.22 1.22a16.536 16.536 0 0 0 6.53 6.53l1.22-1.22a2.25 2.25 0 0 1 2.06-.542l3.198.746a2.25 2.25 0 0 1 1.603 2.02V19.5a2.25 2.25 0 0 1-2.25 2.25h-1.5C9.56 21.75 2.25 14.44 2.25 5.25V4.5Z",
		Ubicación:
			"M12 2.25a7.5 7.5 0 0 1 7.5 7.5c0 5.25-7.5 12-7.5 12S4.5 15 4.5 9.75A7.5 7.5 0 0 1 12 2.25Zm0 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
	} as const;
</script>

<footer class="border-t border-line bg-sheet text-primary">
	<div class="px-4 lg:px-6">
		<div class="mx-auto max-w-270 py-8">
			<div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.85fr_0.9fr] lg:gap-8">
				<div class="max-w-xs">
					<a href={resolve("/")} class="inline-flex items-start gap-3">
						<img src={logo_omec} alt="OMEC" class="h-14 w-auto shrink-0" />
						<div class="pt-1">
							<p class="text-base font-semibold">OMEC</p>
							<p class="mt-1 text-sm leading-tight">
								Desarrollando el talento matemático de los estudiantes ecuatorianos.
							</p>
						</div>
					</a>
				</div>

				<div>
					<h2 class="text-base font-semibold">Enlaces Rápidos</h2>
					<ul class="mt-3 space-y-2 text-sm leading-relaxed">
						{#each ROUTES as link (link.href)}
							<li>
								<a class="transition-opacity hover:opacity-70" href={resolve(link.href)}
									>{link.text}</a
								>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h2 class="text-base font-semibold">Recursos</h2>
					<ul class="mt-3 space-y-2 text-sm leading-relaxed">
						{#each resource_links as link (link.text)}
							<li>
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a class="transition-opacity hover:opacity-70" href={get_href(link.href)}
									>{link.text}</a
								>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h2 class="text-base font-semibold">Contacto</h2>
					<ul class="mt-3 space-y-3 text-sm leading-relaxed">
						{#each contact_links as link (link.text)}
							<li>
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a
									class="inline-flex items-center gap-4 transition-opacity hover:opacity-70"
									href={get_href(link.href)}
									target={link.label === "Ubicación" ? "_blank" : undefined}
									rel={link.label === "Ubicación" ? "noreferrer" : undefined}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										class="size-4 shrink-0"
										aria-hidden="true"
									>
										<path
											d={icon_paths[link.label]}
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<span>{link.text}</span>
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="mt-8 border-t border-line pt-4">
				<div class="flex flex-col gap-3 text-xs leading-relaxed md:flex-row md:justify-between">
					<p class="max-w-2xl">
						© 2026 Olimpiada Matemática Ecuatoriana. Todos los derechos reservados.
					</p>
					<div class="flex flex-wrap gap-4">
						{#each legal_links as link (link.text)}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a class="transition-opacity hover:opacity-70" href={get_href(link.href)}
								>{link.text}</a
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>
