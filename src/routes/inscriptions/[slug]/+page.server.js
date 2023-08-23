import { PUBLIC_API_URL } from '$env/static/public'

export async function load({ params }) {
    const response = await fetch(`${PUBLIC_API_URL}/inscriptions/${params.slug}`);
    const inscription = await response.json();

    return { inscription };
}