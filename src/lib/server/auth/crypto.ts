export const PASSWORD_ITERATIONS = 100_000;
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
const ENCODER = new TextEncoder();
export type Keyring = { current: string; keys: Record<string, string> };

export function hex(bytes: Uint8Array): string {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function unhex(value: string): Uint8Array<ArrayBuffer> {
	if (!/^(?:[0-9a-f]{2})+$/.test(value)) throw new Error("Codificación inválida.");
	return Uint8Array.from(value.match(/../g)!, (byte) => parseInt(byte, 16));
}
export function random_token(): string {
	return hex(crypto.getRandomValues(new Uint8Array(32)));
}
export async function digest_token(token: string): Promise<string> {
	return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", ENCODER.encode(token))));
}
export function parse_keyring(raw: string | undefined): Keyring {
	if (!raw) throw new Error("Falta configurar las claves de autenticación.");
	const parsed = JSON.parse(raw) as Keyring;
	if (
		!parsed ||
		!/^[a-zA-Z0-9_-]{1,32}$/.test(parsed.current) ||
		!parsed.keys ||
		!Object.hasOwn(parsed.keys, parsed.current)
	)
		throw new Error("Configuración de claves inválida.");
	for (const [version, key] of Object.entries(parsed.keys)) {
		if (
			!/^[a-zA-Z0-9_-]{1,32}$/.test(version) ||
			typeof key !== "string" ||
			!/^[0-9a-f]{64}$/.test(key)
		)
			throw new Error("Cada clave debe contener 32 bytes hexadecimales.");
	}
	return parsed;
}
export function validate_password(password: string): void {
	if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH)
		throw new Error("La contraseña debe tener entre 12 y 128 caracteres.");
}
export function constant_time_equal(a: Uint8Array, b: Uint8Array): boolean {
	let difference = a.length ^ b.length;
	for (let i = 0; i < Math.max(a.length, b.length); i++) difference |= (a[i] ?? 0) ^ (b[i] ?? 0);
	return difference === 0;
}
async function derive(
	password: string,
	pepper: string,
	salt: Uint8Array<ArrayBuffer>,
	iterations: number,
) {
	const hmac_key = await crypto.subtle.importKey(
		"raw",
		unhex(pepper),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const prehash = await crypto.subtle.sign("HMAC", hmac_key, ENCODER.encode(password));
	const key = await crypto.subtle.importKey("raw", prehash, "PBKDF2", false, ["deriveBits"]);
	return new Uint8Array(
		await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256),
	);
}
export function parse_password_hash(encoded: string) {
	const match =
		/^omec\$1\$pbkdf2-sha256\$(\d{1,6})\$([a-zA-Z0-9_-]{1,32})\$([0-9a-f]{32})\$([0-9a-f]{64})$/.exec(
			encoded,
		);
	if (!match) return null;
	const iterations = Number(match[1]);
	if (iterations < 1 || iterations > PASSWORD_ITERATIONS) return null;
	return { iterations, pepper_version: match[2], salt: unhex(match[3]), key: unhex(match[4]) };
}
export async function hash_password(password: string, keyring: Keyring): Promise<string> {
	validate_password(password);
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await derive(password, keyring.keys[keyring.current], salt, PASSWORD_ITERATIONS);
	return [
		"omec",
		"1",
		"pbkdf2-sha256",
		PASSWORD_ITERATIONS,
		keyring.current,
		hex(salt),
		hex(key),
	].join("$");
}
export async function verify_password(password: string, encoded: string, keyring: Keyring) {
	const parsed = parse_password_hash(encoded);
	if (
		!parsed ||
		password.length > PASSWORD_MAX_LENGTH ||
		!Object.hasOwn(keyring.keys, parsed.pepper_version)
	)
		return { valid: false, needs_rehash: false };
	const actual = await derive(
		password,
		keyring.keys[parsed.pepper_version],
		parsed.salt,
		parsed.iterations,
	);
	const valid = constant_time_equal(actual, parsed.key);
	return {
		valid,
		needs_rehash:
			valid &&
			(parsed.iterations !== PASSWORD_ITERATIONS || parsed.pepper_version !== keyring.current),
	};
}
export async function encrypt_secret(secret: string, keyring: Keyring): Promise<string> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const key = await crypto.subtle.importKey(
		"raw",
		unhex(keyring.keys[keyring.current]),
		"AES-GCM",
		false,
		["encrypt"],
	);
	const ciphertext = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv, additionalData: ENCODER.encode(keyring.current) },
		key,
		ENCODER.encode(secret),
	);
	return [keyring.current, hex(iv), hex(new Uint8Array(ciphertext))].join(".");
}
export async function decrypt_secret(encoded: string, keyring: Keyring): Promise<string> {
	const [version, iv, ciphertext, extra] = encoded.split(".");
	if (extra || !Object.hasOwn(keyring.keys, version))
		throw new Error("Clave de cifrado desconocida.");
	const key = await crypto.subtle.importKey("raw", unhex(keyring.keys[version]), "AES-GCM", false, [
		"decrypt",
	]);
	return new TextDecoder().decode(
		await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: unhex(iv), additionalData: ENCODER.encode(version) },
			key,
			unhex(ciphertext),
		),
	);
}
