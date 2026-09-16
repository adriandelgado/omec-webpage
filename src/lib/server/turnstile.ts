import { TURNSTILE_SECRET_KEY } from "$app/env/private";

const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerificationResponse = {
	success: boolean;
};

export async function verify_turnstile_token(token: string): Promise<boolean> {
	if (!TURNSTILE_SECRET_KEY) return false;

	try {
		const verification_response = await fetch(TURNSTILE_SITEVERIFY_URL, {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token }),
		});

		if (!verification_response.ok) return false;

		const verification = (await verification_response.json()) as TurnstileVerificationResponse;
		return verification.success;
	} catch {
		return false;
	}
}
