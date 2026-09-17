import { db } from "../db";
import { media_asset } from "../db/schema";
import { eq } from "drizzle-orm";
import { media_url } from "./files";

export async function resolve_media(id: string | null): Promise<string | undefined> {
	if (!id) return undefined;
	const [asset] = await db
		.select({ id: media_asset.id, filename: media_asset.original_filename })
		.from(media_asset)
		.where(eq(media_asset.id, id))
		.limit(1);
	return asset ? media_url(asset.id, asset.filename) : undefined;
}
