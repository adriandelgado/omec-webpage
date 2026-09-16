<script lang="ts" module>
	const TURNSTILE_LOAD_TIMEOUT_MS = 10_000;
	let turnstile_load_promise: Promise<void> | undefined;

	function load_turnstile(): Promise<void> {
		if (window.turnstile) return Promise.resolve();
		if (turnstile_load_promise) return turnstile_load_promise;

		const load_promise = new Promise<void>((resolve, reject) => {
			const script = document.createElement("script");
			const timeout_id = window.setTimeout(() => {
				script.remove();
				reject(new Error("Timed out loading Turnstile"));
			}, TURNSTILE_LOAD_TIMEOUT_MS);

			script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
			script.async = true;
			script.onload = () => {
				window.clearTimeout(timeout_id);
				if (window.turnstile) resolve();
				else reject(new Error("Turnstile API did not initialize"));
			};
			script.onerror = () => {
				window.clearTimeout(timeout_id);
				script.remove();
				reject(new Error("Failed to load Turnstile"));
			};
			document.head.appendChild(script);
		});

		turnstile_load_promise = load_promise;
		void load_promise.catch(() => {
			if (turnstile_load_promise === load_promise) turnstile_load_promise = undefined;
		});

		return load_promise;
	}
</script>

<script lang="ts">
	import type { Attachment } from "svelte/attachments";

	type Props = {
		sitekey: string;
		action: string;
		class?: string;
		on_token: (token: string) => void;
	};

	let { sitekey, action, class: classes, on_token }: Props = $props();
	let widget_id: string | undefined;
	let turnstile_load_failed = $state(false);
	let turnstile_error = $state("");

	function render_error(error_code: string | number): string {
		const normalized_code = String(error_code);
		if (normalized_code === "110600" || normalized_code === "110620")
			return "La verificación tardó demasiado. Inténtalo de nuevo.";
		return "No se pudo completar la verificación de seguridad. Inténtalo de nuevo.";
	}

	function handle_turnstile_token(token: string): void {
		turnstile_error = "";
		on_token(token);
	}

	function handle_turnstile_expired(): void {
		turnstile_error = "La verificación expiró. Complétala de nuevo.";
		on_token("");
	}

	function handle_turnstile_timeout(): void {
		turnstile_error = "La verificación tardó demasiado. Inténtala de nuevo.";
		on_token("");
	}

	function handle_turnstile_error(error_code: string | number): boolean {
		turnstile_error = render_error(error_code);
		on_token("");

		return false;
	}

	function retry_turnstile_load(): void {
		turnstile_load_failed = false;
	}

	const turnstile_attachment: Attachment = (element) => {
		let destroyed = false;

		async function render_widget(): Promise<void> {
			try {
				await load_turnstile();
				if (destroyed) return;

				widget_id = window.turnstile?.render(element as HTMLElement, {
					sitekey,
					action,
					theme: "light",
					size: "flexible",
					"response-field": false,
					callback: handle_turnstile_token,
					"expired-callback": handle_turnstile_expired,
					"timeout-callback": handle_turnstile_timeout,
					"error-callback": handle_turnstile_error,
				});
			} catch {
				if (!destroyed) turnstile_load_failed = true;
			}
		}

		void render_widget();

		return () => {
			destroyed = true;
			window.turnstile?.remove(widget_id);
			widget_id = undefined;
		};
	};

	export function reset(): void {
		if (widget_id) window.turnstile?.reset(widget_id);
		on_token("");
	}
</script>

{#if !sitekey}
	<div
		class="rounded-md border border-red-800/50 bg-red-900/30 p-3 text-sm text-red-300"
		role="alert"
	>
		La verificación de seguridad no está configurada. Contacta a soporte.
	</div>
{:else if turnstile_load_failed}
	<div
		class="rounded-md border border-red-800/50 bg-red-900/30 p-3 text-sm text-red-300"
		role="alert"
	>
		No se pudo cargar la verificación de seguridad.
		<button
			type="button"
			class="mt-2 block font-semibold text-white underline hover:text-gray-200"
			onclick={retry_turnstile_load}>Reintentar</button
		>
	</div>
{:else}
	<div>
		<div class={classes} {@attach turnstile_attachment}></div>
		{#if turnstile_error}
			<p
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
				class="mt-2 rounded-md border border-red-800/50 bg-red-900/30 p-3 text-sm text-red-300"
			>
				{turnstile_error}
			</p>
		{/if}
	</div>
{/if}
