import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

import type { BibliographicEntry } from '$lib/types/inscription.type.js';

const ZOTERO_GROUP_ID = 180188;

export async function load({ params }) {
	const response = await fetch(`${env.PUBLIC_API_URL}/inscriptions/${params.slug}`);
	const inscription = await response.json();

	if (!inscription || inscription.detail === 'Not authenticated') {
		throw error(404, 'Inscription not found');
	}

	const zoteroItems = await Promise.all(inscription.bibliographic_entries?.map(async (entry: BibliographicEntry) => {
		const zoteroTag = entry.ptr_target?.replace('.xml', '');
		const zoteroUrl = `https://api.zotero.org/groups/${ZOTERO_GROUP_ID}/items?tag=${zoteroTag}&include=bib&style=chicago-note-bibliography`;
		const zoteroResponse = await fetch(zoteroUrl, {
			// @ts-expect-error
			Accept: 'application/json',
			'Zotero-API-Version': 3
		});
		const zoteroJson = await zoteroResponse.json();
		const zoteroItem = zoteroJson[0];

		return {
			...zoteroItem,
			...entry,
		};
	}));

	return { inscription, zoteroItems };
}
