import { decodeBase64Url, encodeBase64Url } from "@std/encoding/base64url";
import { constant_time_equal } from "./crypto";

const PASSWORD_HASH_ALGORITHM = "PBKDF2";
const PASSWORD_HASH_DIGEST = "SHA-256";
const PASSWORD_HASH_ITERATIONS = 210_000;
const PASSWORD_HASH_SALT_BYTES = 16;
const PASSWORD_HASH_BYTES = 32;
const PASSWORD_HASH_PREFIX = "pbkdf2-sha256";

async function derive_password_hash(password: string, salt: Uint8Array, iterations: number) {
	const salt_buffer = new ArrayBuffer(salt.byteLength);
	new Uint8Array(salt_buffer).set(salt);
	const password_key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		PASSWORD_HASH_ALGORITHM,
		false,
		["deriveBits"],
	);
	const hash_buffer = await crypto.subtle.deriveBits(
		{
			name: PASSWORD_HASH_ALGORITHM,
			hash: PASSWORD_HASH_DIGEST,
			salt: salt_buffer,
			iterations,
		},
		password_key,
		PASSWORD_HASH_BYTES * 8,
	);

	return new Uint8Array(hash_buffer);
}

export async function hash_password(password: string) {
	const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_HASH_SALT_BYTES));
	const hash = await derive_password_hash(password, salt, PASSWORD_HASH_ITERATIONS);

	return [
		PASSWORD_HASH_PREFIX,
		`i=${PASSWORD_HASH_ITERATIONS}`,
		`s=${encodeBase64Url(salt)}`,
		`h=${encodeBase64Url(hash)}`,
	].join("$");
}

export async function verify_password(password: string, stored_hash: string) {
	const [prefix, raw_iterations, raw_salt, raw_hash] = stored_hash.split("$");

	if (
		prefix !== PASSWORD_HASH_PREFIX ||
		!raw_iterations?.startsWith("i=") ||
		!raw_salt?.startsWith("s=") ||
		!raw_hash?.startsWith("h=")
	) {
		return false;
	}

	const iterations = Number.parseInt(raw_iterations.slice(2), 10);
	if (!Number.isSafeInteger(iterations) || iterations < 1) {
		return false;
	}

	const salt = decodeBase64Url(raw_salt.slice(2));
	const expected_hash = decodeBase64Url(raw_hash.slice(2));
	const actual_hash = await derive_password_hash(password, salt, iterations);

	return constant_time_equal(actual_hash, expected_hash);
}
