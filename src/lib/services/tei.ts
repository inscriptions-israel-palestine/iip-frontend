import type { Edition } from '$lib/types/inscription.type';

// @ts-expect-error
import CETEI from 'CETEIcean';

const teiTransformer = new CETEI();

export function getEdition(editions: Edition[] = [], editionType: string) {
	const edition = editions.find((edition) => edition.edition_type === editionType);

	if (!edition?.text) {
		return { text: `[no ${editionType}]` };
	}

    return edition;
}

export function transformTei(raw: string | undefined | null) {
	if (!raw) {
		return Promise.reject(false);
	}

	return new Promise((resolve, _reject) =>
		teiTransformer.makeHTML5(raw, (data: any) => resolve(data))
	);
}
