import { env } from "$env/dynamic/public";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
	const response = await fetch(`${env.PUBLIC_API_URL}/facets${url.search}`);
	const facets = await response.json();

	return json({ facets });
};
