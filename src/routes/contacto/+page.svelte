<script lang="ts">
	import { Mail, MapPin, Phone, Send } from "@lucide/svelte";
	import { contact_form_schema } from "./contact-form";
	import { send_contact_message } from "./contacto.remote";

	// TODO: consolidate the info in a constants.ts file
	const contact_cards = [
		{
			title: "Correo Electrónico",
			icon: Mail,
			lines: ["info@omec-mat.org"],
			links: ["mailto:info@omec-mat.org"],
		},
		{
			title: "Teléfono",
			icon: Phone,
			lines: ["+593 2 234-5678", "+593 98 765-4321"],
			links: ["tel:+59322345678", "tel:+593987654321"],
		},
	] as const;

	const social_links = [
		{
			label: "Facebook",
			href: "https://facebook.com",
			class_name: "bg-primary text-white",
			path: "M14 8h-2c-.7 0-1 .3-1 1v2H9v3h2v6h3v-6h2.3l.7-3H14V9c0-.2.1-.3.3-.3H17V6h-2.6C11.9 6 11 7.1 11 8.7V8z",
		},
		{
			label: "Instagram",
			href: "https://instagram.com",
			class_name: "bg-pink-500 text-white",
			path: "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm0 2.2A1.8 1.8 0 0 0 6.2 8v8A1.8 1.8 0 0 0 8 17.8h8a1.8 1.8 0 0 0 1.8-1.8V8A1.8 1.8 0 0 0 16 6.2H8zm8.5 1.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.2A1.8 1.8 0 1 0 12 13.8a1.8 1.8 0 0 0 0-3.6z",
		},
		{
			label: "Twitter",
			href: "https://twitter.com",
			class_name: "bg-sky-400 text-white",
			path: "M18.2 7.2c.8-.1 1.5-.4 2.1-.8-.3.8-.8 1.4-1.5 1.9v.5c0 4.8-3.6 10.3-10.3 10.3-2 0-3.9-.6-5.5-1.6h.8c1.7 0 3.3-.6 4.5-1.6-1.6 0-2.9-1.1-3.4-2.5.2 0 .5.1.8.1.4 0 .8-.1 1.1-.2-1.7-.3-3-1.8-3-3.6v-.1c.5.3 1.1.5 1.7.5-1-.7-1.7-1.8-1.7-3.1 0-.7.2-1.3.5-1.8 1.9 2.4 4.8 4 8 4.1-.1-.3-.1-.6-.1-.9 0-2.1 1.7-3.8 3.8-3.8 1.1 0 2 .4 2.7 1.1z",
		},
	] as const;
</script>

<svelte:head>
	<title>Contacto | OMEC</title>
</svelte:head>

<section class="border-b border-line px-4 pt-9 pb-10 lg:px-6 lg:pt-11 lg:pb-12">
	<div class="mx-auto max-w-270">
		<div class="max-w-185">
			<p class="text-xs font-medium tracking-[0.22em] text-primary uppercase">Contacto</p>
			<h1 class="mt-3 text-4xl leading-none font-semibold tracking-tighter text-copy lg:text-5xl">
				Contáctanos
			</h1>
			<p class="mt-4 max-w-170 text-sm leading-7 text-copy/72">
				¿Tienes preguntas sobre las olimpiadas, el proceso de inscripción, o nuestros programas de
				entrenamiento? Estamos aquí para ayudarte.
			</p>
		</div>

		<div class="mt-8 border-t border-line pt-6 lg:pt-7">
			<div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
				<div class="max-w-110">
					<h2 class="text-base font-medium text-copy">Información de Contacto</h2>

					<div class="mt-5 space-y-3.5">
						{#each contact_cards as card (card.title)}
							<div class="rounded-2xl border border-primary/35 bg-white/80 px-4 py-4 shadow-lg">
								<div class="flex items-start gap-3">
									<div
										class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
									>
										<card.icon class="h-4 w-4" aria-hidden="true" />
									</div>

									<div class="min-w-0">
										<p class="text-sm font-semibold text-copy">{card.title}</p>

										<div class="mt-1.5 space-y-1 text-sm leading-relaxed text-copy/72">
											{#each card.lines as line, index (line)}
												<!-- eslint-disable svelte/no-navigation-without-resolve -->
												<a
													href={card.links[index]}
													class="block break-all transition-colors hover:text-primary">{line}</a
												>
												<!-- eslint-enable svelte/no-navigation-without-resolve -->
											{/each}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-8">
						<h2 class="text-base font-medium text-copy">Síguenos</h2>

						<div class="mt-4 flex items-center gap-3">
							{#each social_links as social_link (social_link.label)}
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a
									href={social_link.href}
									target="_blank"
									rel="noreferrer"
									aria-label={social_link.label}
									class={`inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-transform hover:-translate-y-0.5 ${social_link.class_name}`}
								>
									<svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
										<path d={social_link.path}></path>
									</svg>
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/each}
						</div>

						<p class="mt-4 max-w-80 text-sm leading-7 text-copy/68">
							Mantente al día con nuestras últimas noticias, eventos y logros en nuestras redes
							sociales.
						</p>

						<div
							class="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-white/70 px-4 py-4"
						>
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
							>
								<MapPin class="h-4 w-4" aria-hidden="true" />
							</div>
							<div>
								<p class="text-sm font-semibold text-copy">Ubicación</p>
								<p class="mt-1 text-sm leading-relaxed text-copy/72">Guayaquil, Ecuador</p>
							</div>
						</div>
					</div>
				</div>

				<div class="lg:justify-self-end lg:pt-1">
					<form
						{...send_contact_message.preflight(contact_form_schema)}
						class="rounded-3xl border border-primary/35 bg-white/88 px-5 py-5 shadow-xl lg:w-116 lg:px-6 lg:py-6"
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<h2 class="text-xl leading-tight font-semibold text-copy">Envíanos un Mensaje</h2>
								<p class="mt-2 text-sm leading-relaxed text-copy/55">
									Todos los campos marcados con <span class="text-primary">*</span> son obligatorios.
								</p>
							</div>
						</div>

						{#if send_contact_message.result?.success}
							<div
								class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800"
								role="status"
								aria-live="polite"
							>
								{send_contact_message.result.message}
							</div>
						{/if}

						{#if send_contact_message.fields.allIssues()?.length}
							<div
								class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
								role="alert"
							>
								<p class="font-medium">Revisa los campos marcados antes de enviar.</p>
							</div>
						{/if}

						<div class="mt-5 space-y-4">
							<div>
								<label for="full_name" class="text-sm font-medium text-copy/82">
									Nombre Completo <span class="text-primary">*</span>
								</label>
								<input
									id="full_name"
									placeholder="Tu nombre"
									{...send_contact_message.fields.full_name.as("text")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.full_name.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="email" class="text-sm font-medium text-copy/82">
									Correo Electrónico <span class="text-primary">*</span>
								</label>
								<input
									id="email"
									placeholder="tu@email.com"
									{...send_contact_message.fields.email.as("email")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.email.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="institution" class="text-sm font-medium text-copy/82">
									Institución <span class="text-primary">*</span>
								</label>
								<input
									id="institution"
									placeholder="tu colegio"
									{...send_contact_message.fields.institution.as("text")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.institution.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="subject" class="text-sm font-medium text-copy/82">
									Asunto <span class="text-primary">*</span>
								</label>
								<input
									id="subject"
									placeholder="¿Sobre qué quieres escribirnos?"
									{...send_contact_message.fields.subject.as("text")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.subject.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="message" class="text-sm font-medium text-copy/82">
									Mensaje <span class="text-primary">*</span>
								</label>
								<textarea
									id="message"
									rows="6"
									placeholder="Escribe tu mensaje aquí..."
									{...send_contact_message.fields.message.as("text")}
									class="mt-2 block min-h-34 w-full form-textarea rounded-2xl border border-line bg-white px-3.5 py-3 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								></textarea>
								<div class="mt-2 flex items-center justify-between gap-4">
									{#if send_contact_message.fields.message.issues()?.[0]}
										<p class="text-sm text-red-600">
											{send_contact_message.fields.message.issues()?.[0]?.message}
										</p>
									{:else}
										<p class="text-sm text-copy/48">
											Cuéntanos tu consulta con el mayor detalle posible.
										</p>
									{/if}

									<p class="text-sm text-copy/48">
										{send_contact_message.fields.message.value()?.length ?? 0}/2000
									</p>
								</div>
							</div>
						</div>

						<button
							type="submit"
							class="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
							disabled={send_contact_message.pending > 0}
						>
							<Send class="h-4 w-4" aria-hidden="true" />
							{send_contact_message.pending > 0 ? "Enviando..." : "Enviar Mensaje"}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
