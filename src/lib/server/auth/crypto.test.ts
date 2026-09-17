import { describe, expect, it } from "vitest";
import {
	PASSWORD_ITERATIONS,
	hash_password,
	verify_password,
	parse_password_hash,
	parse_keyring,
	constant_time_equal,
	random_token,
	digest_token,
	encrypt_secret,
	decrypt_secret,
} from "./crypto";

const KEYS = { current: "v1", keys: { v1: "11".repeat(32), v2: "22".repeat(32) } };
describe("password cryptography", () => {
	it("uses exactly the Workers iteration ceiling", () => expect(PASSWORD_ITERATIONS).toBe(100_000));
	it("encodes unique 128-bit salts and 256-bit keys and verifies passwords", async () => {
		const first = await hash_password("una contraseña larga", KEYS);
		const second = await hash_password("una contraseña larga", KEYS);
		expect(first).not.toBe(second);
		expect(parse_password_hash(first)?.salt.length).toBe(16);
		expect(parse_password_hash(first)?.key.length).toBe(32);
		expect(await verify_password("una contraseña larga", first, KEYS)).toEqual({
			valid: true,
			needs_rehash: false,
		});
		expect((await verify_password("incorrecta", first, KEYS)).valid).toBe(false);
		expect(
			await verify_password("una contraseña larga", first, { ...KEYS, current: "v2" }),
		).toEqual({ valid: true, needs_rehash: true });
		expect(
			(
				await verify_password("una contraseña larga", first, {
					current: "v2",
					keys: { v2: KEYS.keys.v2 },
				})
			).valid,
		).toBe(false);
	});
	it("rejects malformed hashes, unsupported work factors and weak key configuration", async () => {
		for (const hash of [
			"",
			"omec$2$pbkdf2-sha256$100000$v1$00$00",
			"omec$1$pbkdf2-sha256$999999$v1$" + "00".repeat(16) + "$" + "00".repeat(32),
		]) {
			expect(parse_password_hash(hash)).toBeNull();
			expect((await verify_password("long password", hash, KEYS)).valid).toBe(false);
		}
		expect(() => parse_keyring('{"current":"v1","keys":{"v1":"short"}}')).toThrow();
		expect(() => parse_keyring(undefined)).toThrow();
		expect(parse_keyring(JSON.stringify(KEYS))).toEqual(KEYS);
		await expect(hash_password("short", KEYS)).rejects.toThrow();
		await expect(hash_password("x".repeat(129), KEYS)).rejects.toThrow();
	});
	it("compares equal-length values without early mismatched-byte returns", () => {
		expect(constant_time_equal(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
		expect(constant_time_equal(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
		expect(constant_time_equal(new Uint8Array([1]), new Uint8Array([1, 0]))).toBe(false);
	});
	it("hashes opaque 256-bit tokens and authenticates encrypted secrets", async () => {
		const token = random_token();
		expect(token).toMatch(/^[0-9a-f]{64}$/);
		expect(await digest_token(token)).not.toBe(token);
		const encrypted = await encrypt_secret("TOTP SECRET", KEYS);
		expect(encrypted).not.toContain("TOTP SECRET");
		expect(await decrypt_secret(encrypted, KEYS)).toBe("TOTP SECRET");
		await expect(decrypt_secret(encrypted.slice(0, -2) + "ff", KEYS)).rejects.toThrow();
	});
});
