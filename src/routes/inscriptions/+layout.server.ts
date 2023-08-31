import { env } from '$env/dynamic/public'

export async function load() {
    const response = await fetch(`${env.PUBLIC_API_URL}/facets`);
    const facets = await response.json();

    return { facets };
}