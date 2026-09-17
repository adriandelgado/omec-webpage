const MIME_EXTENSIONS: Record<string, string[]> = {
	"image/jpeg": ["jpg", "jpeg"],
	"image/png": ["png"],
	"image/webp": ["webp"],
	"image/avif": ["avif"],
	"image/gif": ["gif"],
	"image/svg+xml": ["svg"],
	"application/pdf": ["pdf"],
};
export function validate_file(filename: string, mime: string, bytes: Uint8Array) {
	const extension = filename.split(".").pop()?.toLowerCase() ?? "";
	if (!MIME_EXTENSIONS[mime]?.includes(extension))
		throw new Error("El tipo y la extensión del archivo no coinciden.");
	const limit = mime === "application/pdf" ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
	if (!bytes.length || bytes.length > limit)
		throw new Error("El archivo supera el límite de tamaño permitido.");
	const text = new TextDecoder().decode(bytes);
	const ascii = (offset: number, length: number) =>
		String.fromCharCode(...bytes.slice(offset, offset + length));
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let width: number | null = null,
		height: number | null = null,
		valid = false;
	if (mime === "image/png") {
		valid =
			bytes.length >= 24 &&
			bytes[0] === 137 &&
			ascii(1, 7) === "PNG\r\n\x1a\n" &&
			ascii(12, 4) === "IHDR";
		if (valid) {
			width = view.getUint32(16);
			height = view.getUint32(20);
		}
	} else if (mime === "image/gif") {
		valid = bytes.length >= 10 && ["GIF87a", "GIF89a"].includes(ascii(0, 6));
		if (valid) {
			width = view.getUint16(6, true);
			height = view.getUint16(8, true);
		}
	} else if (mime === "image/jpeg") {
		valid = bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
		let offset = 2;
		while (valid && offset + 9 < bytes.length) {
			if (bytes[offset] !== 255) break;
			const marker = bytes[offset + 1];
			if (
				[0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
					marker,
				)
			) {
				height = view.getUint16(offset + 5);
				width = view.getUint16(offset + 7);
				break;
			}
			const length = view.getUint16(offset + 2);
			if (length < 2) break;
			offset += 2 + length;
		}
		valid = valid && width !== null;
	} else if (mime === "image/webp") {
		valid = bytes.length >= 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP";
		if (valid && ascii(12, 4) === "VP8X") {
			width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
			height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
		} else if (
			valid &&
			ascii(12, 4) === "VP8 " &&
			bytes[23] === 157 &&
			bytes[24] === 1 &&
			bytes[25] === 42
		) {
			width = view.getUint16(26, true) & 16383;
			height = view.getUint16(28, true) & 16383;
		} else if (valid && ascii(12, 4) === "VP8L" && bytes[20] === 47) {
			width = 1 + bytes[21] + ((bytes[22] & 63) << 8);
			height = 1 + (bytes[22] >> 6) + (bytes[23] << 2) + ((bytes[24] & 15) << 10);
		} else valid = false;
	} else if (mime === "image/avif") {
		valid =
			bytes.length >= 32 &&
			ascii(4, 4) === "ftyp" &&
			/avif|avis/.test(ascii(8, Math.min(view.getUint32(0), 128) - 8));
		for (let i = 4; valid && i + 16 <= bytes.length; i++) {
			if (ascii(i, 4) === "ispe" && view.getUint32(i - 4) === 20) {
				width = view.getUint32(i + 8);
				height = view.getUint32(i + 12);
				break;
			}
		}
		valid = valid && width !== null;
	} else if (mime === "image/svg+xml") {
		// Conservative SVG subset: reject active content, references, CSS and entities entirely.
		valid =
			/^\s*(?:<\?xml[^?]*\?>\s*)?<svg[\s>]/i.test(text) &&
			/<\/svg>\s*$/i.test(text) &&
			!/<!|<\?|\bon[a-z]+\s*=|(?:href|src|style)\s*=|url\s*\(|&|<\s*\/?\s*(?:script|foreignObject|style|animate\w*|set|use|image|a|iframe|object|embed|audio|video)\b/i.test(
				text.replace(/^\s*<\?xml[^?]*\?>/, ""),
			);
		const tags = Array.from(text.matchAll(/<\/?([\w:-]+)/g), (m) => m[1]);
		valid =
			valid &&
			tags.every((tag) =>
				[
					"svg",
					"g",
					"path",
					"rect",
					"circle",
					"ellipse",
					"line",
					"polyline",
					"polygon",
					"text",
					"tspan",
					"title",
					"desc",
					"defs",
					"linearGradient",
					"radialGradient",
					"stop",
					"clipPath",
					"mask",
				].includes(tag),
			);
		const root = text.match(/<svg\b[^>]*>/)?.[0] ?? "";
		const box = root.match(/viewBox\s*=\s*["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/);
		width = Number(root.match(/\bwidth\s*=\s*["']([\d.]+)(?:px)?["']/)?.[1] ?? box?.[1]) || null;
		height = Number(root.match(/\bheight\s*=\s*["']([\d.]+)(?:px)?["']/)?.[1] ?? box?.[2]) || null;
	} else if (mime === "application/pdf") {
		valid = ascii(0, 5) === "%PDF-" && /%%EOF\s*$/.test(text);
	}
	if (
		!valid ||
		(mime.startsWith("image/") && (!width || !height || width > 100_000 || height > 100_000))
	)
		throw new Error(
			"Firma o dimensiones inválidas. El SVG debe ser estático y no contener referencias externas.",
		);
	return { width, height };
}
export function media_url(id: string, filename: string) {
	return "/media/" + encodeURIComponent(id) + "/" + encodeURIComponent(filename);
}
