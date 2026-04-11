import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
	redirect(307, "/olimpiadas-anteriores/nacionales");
};
