// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Window {
		turnstile?: {
			render: (
				element: HTMLElement,
				options: {
					sitekey: string;
					action: string;
					theme: "light" | "dark" | "auto";
					size: "normal" | "compact" | "flexible";
					"response-field": boolean;
					callback: (token: string) => void;
					"expired-callback": () => void;
					"timeout-callback": () => void;
					"error-callback": (error_code: string | number) => boolean;
				},
			) => string;
			reset: (widget_id?: string) => void;
			remove: (widget_id?: string) => void;
		};
	}

	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		interface Locals {
			admin: import("./lib/server/auth/sessions").AdminIdentity | null;
			session_digest: string | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
