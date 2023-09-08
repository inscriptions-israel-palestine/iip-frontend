import { env } from '$env/dynamic/public'
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const inscriptionResponse = await fetch(`${env.PUBLIC_API_URL}/inscriptions/map${url.search}`);
    const inscriptions = await inscriptionResponse.json();

    return json({ inscriptions });
}