<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import blocks from "$lib/assets/blocks.svg";
	import sine from "$lib/assets/sine.svg";
	import ContentSection from "$lib/components/content-section.svelte";
	import PageSectionStack from "$lib/components/page-section-stack.svelte";
	import Seo from "$lib/components/seo.svelte";

	interface Props {
		error: App.Error;
	}

	let { error }: Props = $props();

	let status = $derived(page.status);
	let title = $derived(
		status === 404
			? "Página no encontrada"
			: status >= 500
				? "Algo salió mal"
				: "La solicitud falló",
	);
	let description = $derived(
		error.message ||
			(status === 404
				? "La ruta que intentaste abrir no existe o fue movida dentro del sitio."
				: "Un error inesperado impidió mostrar esta página correctamente."),
	);
	let status_label = $derived(status === 404 ? "Ruta no disponible" : "Error de navegación");
</script>

<Seo {title} {description} />

<PageSectionStack class="justify-center py-8 lg:py-10">
	<ContentSection>
		<div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
			<div class="max-w-140">
				<p class="font-mono text-xs tracking-widest text-primary uppercase">{status_label}</p>
				<div class="mt-4 flex items-end gap-4">
					<p class="text-6xl leading-none font-semibold tracking-tighter text-primary lg:text-8xl">
						{status}
					</p>
					<div class="mb-2 h-px flex-1 bg-primary/35"></div>
				</div>

				<h1 class="mt-4 max-w-110 text-4xl leading-none font-semibold tracking-tighter lg:text-5xl">
					{title}
				</h1>

				<p class="mt-4 max-w-95 text-sm leading-6 text-copy/75 lg:text-base lg:leading-7">
					{description}
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a
						href={resolve("/")}
						class="inline-flex h-11 items-center justify-center rounded-sm bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
					>
						Volver al inicio
					</a>
					<a
						href={resolve("/contacto")}
						class="inline-flex h-11 items-center justify-center rounded-sm border border-primary px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/8"
					>
						Contactar a OMEC
					</a>
				</div>
			</div>

			<div class="overflow-hidden rounded-3xl border border-primary/25 bg-background">
				<div
					class="relative min-h-82 bg-[linear-gradient(to_right,rgba(61,120,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(61,120,255,0.14)_1px,transparent_1px)] bg-size-[40px_40px] p-6 lg:min-h-96 lg:p-8"
				>
					<img src={blocks} alt="" class="w-18 opacity-85" />
					<div
						class="mt-8 rounded-sm border border-primary bg-foreground p-5 shadow-[8px_8px_0_var(--color-primary)]"
					>
						<p class="font-mono text-xs tracking-widest text-primary uppercase">Sistema OMEC</p>
						<p class="mt-4 text-sm leading-6 text-copy/80">
							Verifica la dirección, regresa al inicio o intenta nuevamente en unos minutos.
						</p>
						<div class="mt-6 grid grid-cols-2 gap-3 text-xs text-copy/65">
							<div class="rounded-sm border border-primary/20 bg-background px-3 py-2">
								<p class="font-mono text-xs tracking-wider text-primary uppercase">Estado</p>
								<p class="mt-2 text-2xl font-semibold text-copy">{status}</p>
							</div>
							<div class="rounded-sm border border-primary/20 bg-background px-3 py-2">
								<p class="font-mono text-xs tracking-wider text-primary uppercase">Tipo</p>
								<p class="mt-2 text-sm leading-5 font-medium text-copy">{status_label}</p>
							</div>
						</div>
					</div>

					<img
						src={sine}
						alt=""
						class="pointer-events-none absolute top-1/2 right-8 hidden w-36 -translate-y-1/2 opacity-45 lg:block"
					/>
				</div>
			</div>
		</div>
	</ContentSection>
</PageSectionStack>
