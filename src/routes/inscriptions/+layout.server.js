import { PUBLIC_API_URL } from '$env/static/public'

export async function load() {
    const response = await fetch(`${PUBLIC_API_URL}/facets`);
    const facets = await response.json();

    return { facets };
}