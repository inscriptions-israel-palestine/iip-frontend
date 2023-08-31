import { env } from '$env/dynamic/public'

export async function load({ url }) {
    const response = await fetch(`${env.PUBLIC_API_URL}/facets${url.search}`);
    const facets = await response.json();

    return { facets };
}