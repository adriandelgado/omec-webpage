const SOCIAL_BRAND_CLASSES = {
	facebook: "bg-primary text-white",
	instagram: "bg-pink-500 text-white",
	tiktok: "bg-copy text-white",
} as const;

export function social_brand_class(brand_key: string): string {
	return Object.hasOwn(SOCIAL_BRAND_CLASSES, brand_key)
		? SOCIAL_BRAND_CLASSES[brand_key as keyof typeof SOCIAL_BRAND_CLASSES]
		: "bg-primary text-white";
}

export function content_asset<T>(
	assets: Readonly<Record<string, T>>,
	asset_key: string | null,
): T | undefined {
	return asset_key && Object.hasOwn(assets, asset_key) ? assets[asset_key] : undefined;
}
