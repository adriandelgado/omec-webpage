import type { Handle } from "@sveltejs/kit/hooks";

export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		preload: ({ type }) => type === "js" || type === "css" || type === "font",
	});
