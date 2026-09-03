<script lang="ts">
	import { Mail } from "@lucide/svelte";
	import { resolve } from "$app/paths";
	import logo_foec from "#lib/assets/logos/foec.svg";
	import logo_omec from "#lib/assets/logos/omec.svg";
	import logo_ucsg from "#lib/assets/logos/ucsg.svg";
	import { ROUTES } from "#lib/constants.js";

	type Contact = {
		email: string;
		email_href: string;
	};

	type SocialLink = {
		id: string;
		label: string;
		href: string;
	};

	interface Props {
		contact: Contact;
		social_links: readonly SocialLink[];
	}

	let { contact, social_links }: Props = $props();
</script>

<footer class="border-t border-primary px-4 text-primary xl:px-0">
	<div class="py-8">
		<div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.85fr_0.9fr]">
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

				<div class="mt-6 border-t border-primary/30 pt-4">
					<a
						href="https://www.foec.edu.ec/"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-block transition-opacity hover:opacity-70"
					>
						<img
							src={logo_foec}
							alt="Logotipo de la Fundación Olimpiadas Ecuatorianas de Ciencias"
							class="h-18 w-auto object-contain"
						/>
					</a>
					<p class="mt-3 text-sm leading-relaxed">
						Somos un departamento de la Fundación Olimpiadas Ecuatorianas de Ciencias (FOEC),
						organismo sin fines de lucro que fomenta el estudio de las matemáticas y la ciencia en
						el Ecuador.
					</p>
				</div>
			</div>

			<section>
				<h2 class="text-base font-semibold">Enlaces Rápidos</h2>
				<ul class="mt-3 space-y-2 text-sm leading-relaxed">
					{#each ROUTES as link (link.href)}
						<li>
							<a class="transition-opacity hover:opacity-70" href={resolve(link.href)}>
								{link.text}
							</a>
						</li>
					{/each}
				</ul>
			</section>

			<section>
				<h2 class="text-base font-semibold">Auspicia</h2>
				<img
					src={logo_ucsg}
					alt="Logo de la Escuela de Graduados en Ciencias de la Salud de la Universidad Católica de Santiago de Guayaquil"
					class="mt-4 h-auto w-full max-w-40 object-contain"
				/>
			</section>

			<section>
				<h2 class="text-base font-semibold">Contacto</h2>
				<ul class="mt-3 space-y-3 text-sm leading-relaxed">
					<li>
						<a
							class="inline-flex items-center gap-4 transition-opacity hover:opacity-70"
							href={contact.email_href}
						>
							<Mail class="size-4 shrink-0" aria-hidden="true" strokeWidth={1.8} />
							<span>{contact.email}</span>
						</a>
					</li>
				</ul>
				<nav aria-label="Redes sociales" class="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
					{#each social_links as social_link (social_link.id)}
						<a
							class="transition-opacity hover:opacity-70"
							href={social_link.href}
							target="_blank"
							rel="noopener noreferrer"
						>
							{social_link.label}
						</a>
					{/each}
				</nav>
			</section>
		</div>

		<div class="mt-8 border-t border-primary pt-4 text-xs leading-relaxed">
			<p>© 2026 Olimpiada Matemática Ecuatoriana. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>
