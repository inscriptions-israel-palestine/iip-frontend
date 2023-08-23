import { env } from '$env/dynamic/public'

export async function load({ params }) {
    const response = await fetch(`${env.PUBLIC_API_URL}/inscriptions/${params.slug}`);
    const inscription = await response.json();

    return { inscription };
}