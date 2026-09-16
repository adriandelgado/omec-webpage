import { query } from "$app/server";
import { content_repository } from "#lib/server/content-repository-instance.js";

export const get_site_content = query(() => content_repository.get_site_content());

export const get_national_olympiad = query(() => content_repository.get_national_olympiad());
