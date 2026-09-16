import { query } from "$app/server";
import { content_repository } from "#lib/server/content-repository-instance.js";

export const get_content = query(() => content_repository.get_contact_content());
