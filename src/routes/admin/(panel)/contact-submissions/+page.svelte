<script lang="ts">
	// TODO: made with vibecoding. please clean up
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import {
		get_contact_submissions,
		update_contact_submission_read_at,
	} from "./contact-submissions.remote";

	const contact_submissions_query = get_contact_submissions();
	const contact_submissions = $derived(await contact_submissions_query);

	const selected_submission_id = $derived(page.url.searchParams.get("submission"));
	const selected_submission = $derived.by(() => {
		if (selected_submission_id) {
			return (
				contact_submissions.find(
					(submission_row) => String(submission_row.id) === selected_submission_id,
				) ?? null
			);
		}

		return contact_submissions[0] ?? null;
	});

	function format_date(date_value: Date) {
		return new Intl.DateTimeFormat("es-EC", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(date_value);
	}

	function to_datetime_local_value(date_value: Date | null) {
		if (!date_value) {
			return "";
		}

		const year = date_value.getFullYear();
		const month = String(date_value.getMonth() + 1).padStart(2, "0");
		const day = String(date_value.getDate()).padStart(2, "0");
		const hours = String(date_value.getHours()).padStart(2, "0");
		const minutes = String(date_value.getMinutes()).padStart(2, "0");

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Mensajes</p>
		<h2 class="mt-2 text-2xl font-semibold tracking-tight text-copy">Formulario de contacto</h2>
		<p class="mt-2 text-sm leading-6 text-copy/68">
			Revisa consultas recibidas y registra cuándo fueron atendidas.
		</p>

		<div class="mt-5 overflow-x-auto rounded-2xl border border-primary/18">
			<table class="min-w-full divide-y divide-primary/15 text-left text-sm">
				<thead class="bg-primary/6 text-copy/74">
					<tr>
						<th class="px-4 py-3 font-semibold">Remitente</th>
						<th class="px-4 py-3 font-semibold">Asunto</th>
						<th class="px-4 py-3 font-semibold">Estado</th>
						<th class="px-4 py-3 font-semibold">Recibido</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-primary/10 bg-white">
					{#each contact_submissions as submission_row (submission_row.id)}
						<tr class={selected_submission?.id === submission_row.id ? "bg-primary/6" : ""}>
							<td class="px-4 py-3 align-top">
								<a
									href={resolve(`/admin/contact-submissions?submission=${submission_row.id}`)}
									class="block font-medium text-primary"
								>
									{submission_row.full_name}
								</a>
								<p class="mt-1 text-copy/62">{submission_row.email}</p>
							</td>
							<td class="px-4 py-3 align-top text-copy/72">{submission_row.subject}</td>
							<td class="px-4 py-3 align-top">
								{#if submission_row.read_at}
									<span
										class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800"
									>
										Leído
									</span>
								{:else}
									<span
										class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800"
									>
										Pendiente
									</span>
								{/if}
							</td>
							<td class="px-4 py-3 align-top text-copy/62"
								>{format_date(submission_row.created_at)}</td
							>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="px-4 py-6 text-center text-copy/60">
								No hay mensajes de contacto disponibles.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="rounded-3xl border border-primary/30 bg-white/90 p-5 lg:p-6">
		<p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Detalle</p>
		<h3 class="mt-2 text-xl font-semibold tracking-tight text-copy">
			{selected_submission ? selected_submission.subject : "Selecciona un mensaje"}
		</h3>

		{#if selected_submission}
			{#if update_contact_submission_read_at.result?.success}
				<div
					class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
				>
					{update_contact_submission_read_at.result.message}
				</div>
			{/if}

			<div class="mt-5 space-y-4 text-sm leading-6 text-copy/72">
				<div>
					<p class="font-medium text-copy">Nombre</p>
					<p>{selected_submission.full_name}</p>
				</div>
				<div>
					<p class="font-medium text-copy">Correo</p>
					<p>{selected_submission.email}</p>
				</div>
				<div>
					<p class="font-medium text-copy">Institución</p>
					<p>{selected_submission.institution}</p>
				</div>
				<div>
					<p class="font-medium text-copy">Recibido</p>
					<p>{format_date(selected_submission.created_at)}</p>
				</div>
				<div>
					<p class="font-medium text-copy">Mensaje</p>
					<div
						class="mt-2 rounded-2xl border border-primary/18 bg-primary/5 px-4 py-4 whitespace-pre-wrap"
					>
						{selected_submission.message}
					</div>
				</div>
			</div>

			<form
				{...update_contact_submission_read_at.enhance(async ({ submit }) => {
					await submit().updates(contact_submissions_query);
				})}
				class="mt-6 space-y-4 rounded-2xl border border-primary/20 bg-white p-4"
			>
				<input
					{...update_contact_submission_read_at.fields.submission_id.as(
						"hidden",
						String(selected_submission.id),
					)}
				/>

				<div>
					<label for="read_at" class="text-sm font-medium text-copy/82">Fecha de lectura</label>
					<input
						id="read_at"
						type="datetime-local"
						name={update_contact_submission_read_at.fields.read_at.as("text").name}
						value={to_datetime_local_value(selected_submission.read_at)}
						class="mt-2 form-input block h-11 w-full rounded-xl border border-primary/35 bg-white px-3.5 text-sm"
					/>
				</div>

				<div class="flex flex-wrap gap-3">
					<button
						type="submit"
						disabled={update_contact_submission_read_at.pending > 0}
						class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{update_contact_submission_read_at.pending > 0
							? "Guardando..."
							: "Guardar estado de lectura"}
					</button>
				</div>
			</form>
		{:else}
			<p class="mt-5 text-sm leading-6 text-copy/66">
				Selecciona un mensaje de la tabla para revisar el contenido completo.
			</p>
		{/if}
	</section>
</div>
