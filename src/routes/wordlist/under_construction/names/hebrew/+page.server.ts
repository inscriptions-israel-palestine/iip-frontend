import { env } from '$env/dynamic/public'

/*export async function load({ params }) {
    const subpageMap = {
        latin: 'latin',
        greek: 'greek',
        aramaic: 'aramaic',
        hebrew: 'hebrew',
    };
    const selectedLang = subpageMap[params.lang];
    // I'm getting a 500 internal error instead of a 404, not sure why yet
    if (!selectedLang) {
        return {
            status: 404,
            error: new Error('language error'),
        };
    }
    const response = await fetch(`${env.PUBLIC_API_URL}/wordlist/names/${selectedLang}`);
    const wordlist = await response.json();

    return { words: wordlist };
}*/

export async function load() {
    const response = await fetch(`${env.PUBLIC_API_URL}/wordlist/names/hebrew`);
    const wordlist = await response.json();

    return { words: wordlist };
}
