<script lang="ts">
	import { Mail, MapPin, Phone } from "@lucide/svelte";
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
			icon: Mail,
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

	const footer_sections = [
		{ title: "Enlaces Rápidos", links: ROUTES },
		{ title: "Recursos", links: resource_links },
	] as const;
</script>

<footer class="border-t border-primary px-4 text-primary lg:px-6">
	<div class="mx-auto max-w-270 py-8">
		<div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.85fr_0.9fr] lg:gap-8">
			<a href={resolve("/")} class="inline-flex max-w-xs items-start gap-3">
				<img src={logo_omec} alt="OMEC" class="h-14 w-auto shrink-0" />
				<div class="pt-1">
					<p class="text-base font-semibold">OMEC</p>
					<p class="mt-1 text-sm leading-tight">
						Desarrollando el talento matemático de los estudiantes ecuatorianos.
					</p>
				</div>
			</a>

			{#each footer_sections as section (section.title)}
				<section>
					<h2 class="text-base font-semibold">{section.title}</h2>
					<ul class="mt-3 space-y-2 text-sm leading-relaxed">
						{#each section.links as link (link.text)}
							<li>
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a class="transition-opacity hover:opacity-70" href={get_href(link.href)}
									>{link.text}</a
								>
							</li>
						{/each}
					</ul>
				</section>
			{/each}

			<section>
				<h2 class="text-base font-semibold">Contacto</h2>
				<ul class="mt-3 space-y-3 text-sm leading-relaxed">
					{#each contact_links as link (link.text)}
						<li>
							<!-- eslint-disable svelte/no-navigation-without-resolve -->
							<a
								class="inline-flex items-center gap-4 transition-opacity hover:opacity-70"
								href={get_href(link.href)}
							>
								<link.icon class="size-4 shrink-0" aria-hidden="true" strokeWidth={1.8} />
								<span>{link.text}</span>
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						</li>
					{/each}
				</ul>
			</section>
		</div>

		<div
			class="mt-8 flex flex-col gap-3 border-t border-primary pt-4 text-xs leading-relaxed md:flex-row md:justify-between"
		>
			<p class="max-w-2xl">
				© 2026 Olimpiada Matemática Ecuatoriana. Todos los derechos reservados.
			</p>
			<nav aria-label="Enlaces legales" class="flex flex-wrap gap-4">
				{#each legal_links as link (link.text)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="transition-opacity hover:opacity-70" href={get_href(link.href)}>{link.text}</a>
				{/each}
			</nav>
		</div>
	</div>
</footer>
