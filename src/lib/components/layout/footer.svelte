<script lang="ts">
	import { resolve } from "$app/paths";
	import logo_omec from "$lib/assets/logo-omec.png";
	import { ROUTES } from "$lib/constants";

	const quick_links = ROUTES;

	const resource_links = [
		{ text: "Problemas de Práctica", href: "#" },
		{ text: "Exámenes Anteriores", href: "#" },
		{ text: "Resultados", href: "#" },
		{ text: "Calendario de Eventos", href: "#" },
		{ text: "Preguntas Frecuentes", href: "#" },
	] as const;

	const contact_links = [
		{
			text: "info@ome-ecuador.org",
			href: "mailto:info@ome-ecuador.org",
			label: "Correo electrónico",
		},
		{
			text: "+593 2 234-5678",
			href: "tel:+59322345678",
			label: "Teléfono",
		},
		{
			text: "Quito, Ecuador",
			href: "https://maps.google.com/?q=Quito,Ecuador",
			label: "Ubicación",
		},
	] as const;

	const legal_links = [
		{ text: "Política de Privacidad", href: "#" },
		{ text: "Términos de Uso", href: "#" },
	] as const;

	type footer_href =
		| (typeof quick_links)[number]["href"]
		| (typeof resource_links)[number]["href"]
		| (typeof contact_links)[number]["href"]
		| (typeof legal_links)[number]["href"];

	function get_href(href: footer_href) {
		return href.startsWith("/") ? resolve(href as (typeof quick_links)[number]["href"]) : href;
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

<footer class="mt-24 text-[#2460ff]">
	<div class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
		<div class="grid gap-12 lg:grid-cols-[1.35fr_0.8fr_0.95fr_1fr] lg:gap-10">
			<div class="max-w-sm">
				<a href={resolve("/")} class="inline-flex items-start gap-5">
					<img src={logo_omec} alt="OMEC" class="h-36 w-auto shrink-0 sm:h-40" />
					<div class="pt-2">
						<p class="text-[2rem] leading-none font-semibold">OMEC</p>
						<p class="mt-1 text-lg leading-tight font-semibold">Olimpiadas Matemáticas</p>
						<p class="mt-6 text-[1.9rem] leading-[1.3] text-[#2460ff]">
							Desarrollando el talento matemático de los estudiantes ecuatorianos desde hace más de
							25 años.
						</p>
					</div>
				</a>
			</div>

			<div>
				<h2 class="text-[2rem] leading-none font-medium">Enlaces Rápidos</h2>
				<ul class="mt-8 space-y-5 text-[1.9rem] leading-none">
					{#each quick_links as link (link.href)}
						<li>
							<a class="transition-opacity hover:opacity-70" href={resolve(link.href)}
								>{link.text}</a
							>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h2 class="text-[2rem] leading-none font-medium">Recursos</h2>
				<ul class="mt-8 space-y-5 text-[1.9rem] leading-none">
					{#each resource_links as link (link.text)}
						<li>
							<a class="transition-opacity hover:opacity-70" href={get_href(link.href)}
								>{link.text}</a
							>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h2 class="text-[2rem] leading-none font-medium">Contacto</h2>
				<ul class="mt-8 space-y-6 text-[1.9rem] leading-none">
					{#each contact_links as link (link.text)}
						<li>
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
									class="size-8 shrink-0"
									aria-hidden="true"
								>
									<path d={icon_paths[link.label]} stroke-linecap="round" stroke-linejoin="round" />
								</svg>
								<span>{link.text}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-14 border-t border-[#5d6e87] pt-8">
			<div
				class="flex flex-col gap-6 text-[1.75rem] leading-[1.35] md:flex-row md:items-start md:justify-between"
			>
				<p class="max-w-2xl">
					© 2026 Olimpiadas Matemáticas del Ecuador. Todos los derechos reservados.
				</p>
				<div class="flex flex-col gap-4 md:flex-row md:gap-10">
					{#each legal_links as link (link.text)}
						<a class="transition-opacity hover:opacity-70" href={get_href(link.href)}>{link.text}</a
						>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
