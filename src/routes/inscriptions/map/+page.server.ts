import { env } from '$env/dynamic/public'

export async function load({ url }: { url: URL }) {
    const inscriptionResponse = await fetch(`${env.PUBLIC_API_URL}/inscriptions/map${url.search}`);
    const inscriptions = await inscriptionResponse.json();

    return { inscriptions, total: inscriptions.length };
}