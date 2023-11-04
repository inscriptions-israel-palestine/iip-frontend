import { env } from '$env/dynamic/public'
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
    const inscriptionResponse = await fetch(`${env.PUBLIC_API_URL}/inscriptions${url.search}`);
    const json = await inscriptionResponse.json();
    const { items: inscriptions, page, pages, total } = json;

    if (pages > 0 && page > pages) {
        const searchParams = new URLSearchParams(url.search);

        searchParams.delete('page');

        throw redirect(303, `${url.pathname}?${searchParams.toString()}`);
    }

    return { inscriptions, page, pages, total };
}