import { env } from '$env/dynamic/public'

export async function load() {
    const response = await fetch(`${env.PUBLIC_API_URL}/wordlist`);
    const wordlist = await response.json();

    return { words: wordlist };
}