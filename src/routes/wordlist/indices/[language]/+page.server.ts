import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

const AVAILABLE_LANGUAGES = ['latin', 'greek', 'hebrew', 'aramaic'];

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

export async function load({ params }) {
	const language = params.language.toLowerCase();

	if (!AVAILABLE_LANGUAGES.includes(language)) {
		throw error(
			404,
			`Language ${language} is not supported. Please try one of the supported languages: ${AVAILABLE_LANGUAGES.join(
				', '
			)}`
		);
	}

	
	const response = await fetch(`${env.PUBLIC_API_URL}/wordlist/indices/${language}`);
	const wordlist = await response.json();

	return { AVAILABLE_LANGUAGES, language, indices: wordlist };
}
