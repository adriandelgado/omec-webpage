import { create_content_repository } from "./content-repository";
import { CONTENT_ASSETS } from "./content-assets";
import { db } from "./db";

export const content_repository = create_content_repository(db, CONTENT_ASSETS);
