export function constant_time_equal(a: Uint8Array, b: Uint8Array) {
	if (a.length !== b.length) {
		return false;
	}

	let diff = 0;
	for (let i = 0; i < a.length; i++) {
		diff |= a[i] ^ b[i];
	}

	return diff === 0;
}
