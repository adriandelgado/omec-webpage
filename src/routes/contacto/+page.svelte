<script lang="ts">
	import { Mail, Send } from "@lucide/svelte";
	import ContentSection from "#lib/components/content-section.svelte";
	import PageSectionStack from "#lib/components/page-section-stack.svelte";
	import PageIntro from "#lib/components/page-intro.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, SOCIAL_LINKS } from "#lib/constants.js";
	import { contact_form_schema } from "./contact-form";
	import { get_content } from "./content.remote";
	import { send_contact_message } from "./contacto.remote";

	const content = await get_content();
</script>

<Seo title={content.seo.title} description={content.seo.description} />

<PageSectionStack class="py-8 lg:py-10">
	<ContentSection>
		<PageIntro
			title_lines={[{ text: content.intro.title }]}
			description={content.intro.description}
		/>

		<div class="mt-8 border-t border-primary/40 pt-6 lg:pt-7">
			<div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
				<div class="max-w-110">
					<h2 class="text-base font-medium">{content.contact.heading}</h2>

					<div class="mt-5 space-y-3.5">
						{#each [{ title: content.contact.card_title, lines: [CONTACT_EMAIL], links: [CONTACT_EMAIL_HREF] }] as card (card.title)}
							<div class="rounded-2xl border border-primary bg-white/80 p-4">
								<div class="flex items-start gap-3">
									<div
										class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
									>
										<Mail class="size-4" aria-hidden="true" />
									</div>

									<div class="min-w-0">
										<p class="text-sm font-semibold">{card.title}</p>

										<div class="mt-1.5 space-y-1 text-sm leading-relaxed text-copy/72">
											{#each card.lines as line, index (line)}
												<a
													href={card.links[index]}
													rel="external"
													class="block break-all transition-colors hover:text-primary">{line}</a
												>
											{/each}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-8">
						<h2 class="text-base font-medium">{content.follow.heading}</h2>

						<div class="mt-4 flex items-center gap-3">
							{#each SOCIAL_LINKS as social_link (social_link.id)}
								<a
									href={social_link.href}
									target="_blank"
									rel="external noreferrer"
									aria-label={social_link.label}
									class={`inline-flex size-10 items-center justify-center rounded-xl transition-transform hover:-translate-y-0.5 ${social_link.class_name}`}
								>
									<svg viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true">
										<path d={social_link.path}></path>
									</svg>
								</a>
							{/each}
						</div>

						<p class="mt-4 max-w-80 text-sm leading-7 text-copy/68">
							{content.follow.description}
						</p>
					</div>
				</div>

				<div class="lg:justify-self-end lg:pt-1">
					<form
						{...send_contact_message.preflight(contact_form_schema)}
						class="rounded-3xl border border-primary bg-white/88 p-5 lg:w-116 lg:p-6"
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<h2 class="text-xl leading-tight font-semibold">{content.form.title}</h2>
								<p class="mt-2 text-sm leading-relaxed text-copy/55">
									{content.form.required_notice_before}<span class="text-primary">*</span>{content
										.form.required_notice_after}
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
								<p class="font-medium">{content.form.invalid_notice}</p>
							</div>
						{/if}

						<div class="mt-5 space-y-4">
							<div>
								<label for="full_name" class="text-sm font-medium text-copy/82">
									{content.form.fields.full_name.label} <span class="text-primary">*</span>
								</label>
								<input
									id="full_name"
									placeholder={content.form.fields.full_name.placeholder}
									{...send_contact_message.fields.full_name.as("text")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/40 bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.full_name.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="email" class="text-sm font-medium text-copy/82">
									{content.form.fields.email.label} <span class="text-primary">*</span>
								</label>
								<input
									id="email"
									placeholder={content.form.fields.email.placeholder}
									{...send_contact_message.fields.email.as("email")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/40 bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.email.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="institution" class="text-sm font-medium text-copy/82">
									{content.form.fields.institution.label} <span class="text-primary">*</span>
								</label>
								<input
									id="institution"
									placeholder={content.form.fields.institution.placeholder}
									{...send_contact_message.fields.institution.as("text")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/40 bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.institution.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="subject" class="text-sm font-medium text-copy/82">
									{content.form.fields.subject.label} <span class="text-primary">*</span>
								</label>
								<input
									id="subject"
									placeholder={content.form.fields.subject.placeholder}
									{...send_contact_message.fields.subject.as("text")}
									class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/40 bg-white px-3.5 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								/>
								{#each send_contact_message.fields.subject.issues() ?? [] as issue (issue.message)}
									<p class="mt-1.5 text-sm text-red-600">{issue.message}</p>
								{/each}
							</div>

							<div>
								<label for="message" class="text-sm font-medium text-copy/82">
									{content.form.fields.message.label} <span class="text-primary">*</span>
								</label>
								<textarea
									id="message"
									rows="6"
									placeholder={content.form.fields.message.placeholder}
									{...send_contact_message.fields.message.as("text")}
									class="mt-2 block min-h-34 w-full form-textarea rounded-2xl border border-primary/40 bg-white px-3.5 py-3 text-sm text-copy placeholder:text-copy/35 focus:border-primary focus:ring-primary/20"
								></textarea>
								<div class="mt-2 flex items-center justify-between gap-4">
									{#if send_contact_message.fields.message.issues()?.[0]}
										<p class="text-sm text-red-600">
											{send_contact_message.fields.message.issues()?.[0]?.message}
										</p>
									{:else}
										<p class="text-sm text-copy/48">
											{content.form.fields.message.help}
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
							<Send class="size-4" aria-hidden="true" />
							{send_contact_message.pending > 0
								? content.form.pending_label
								: content.form.submit_label}
						</button>
					</form>
				</div>
			</div>
		</div>
	</ContentSection>
</PageSectionStack>
