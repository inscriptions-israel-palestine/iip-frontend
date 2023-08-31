import { redirect } from '@sveltejs/kit';

export function load({ params }: { params: { slug: string } }) {
	throw redirect(308, `/inscriptions/${params.slug}`);
}