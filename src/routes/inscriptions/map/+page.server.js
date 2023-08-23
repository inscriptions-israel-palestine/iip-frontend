import { PUBLIC_API_URL } from '$env/static/public'

export async function load({ url }) {
    const inscriptionResponse = await fetch(`${PUBLIC_API_URL}/map/inscriptions${url.search}`);
    const inscriptions = await inscriptionResponse.json();

    return { inscriptions };
}