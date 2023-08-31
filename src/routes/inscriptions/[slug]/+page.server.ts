import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

const ZOTERO_GROUP_ID = 180188;

export async function load({ params }) {
	const response = await fetch(`${env.PUBLIC_API_URL}/inscriptions/${params.slug}`);
	const inscription = await response.json();
	
	if (!inscription || inscription.detail === 'Not authenticated') {
		throw error(404, 'Inscription not found');
	}

	let zoteroItems = [];
	if (inscription.bibliographic_entries && inscription.bibliographic_entries.length > 0) {
		const zoteroTags = inscription.bibliographic_entries
			// @ts-expect-error
			?.map((entry) => (entry?.ptr_target || '').replace('.xml', ''))
			.join('&tag=');
		const zoteroUrl = `https://api.zotero.org/groups/${ZOTERO_GROUP_ID}/items?tag=${zoteroTags}&include=bib&style=chicago-note-bibliography`;
		const zoteroResponse = await fetch(zoteroUrl, {
			// @ts-expect-error
			Accept: 'application/json',
			'Zotero-API-Version': 3
		});
		zoteroItems = await zoteroResponse.json();
	}

	return { inscription, zoteroItems };
}
