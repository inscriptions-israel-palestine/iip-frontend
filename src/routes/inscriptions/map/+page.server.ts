import { env } from '$env/dynamic/public'

export async function load({ url }) {
    const inscriptionResponse = await fetch(`${env.PUBLIC_API_URL}/map/inscriptions${url.search}`);
    const inscriptions = await inscriptionResponse.json();

    return { inscriptions };
}