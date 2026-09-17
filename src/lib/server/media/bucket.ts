import { env } from "cloudflare:workers";
export function media_bucket(): R2Bucket {
	return env.MEDIA_BUCKET;
}
