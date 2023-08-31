import { env } from '$env/dynamic/public';

export async function PATCH({ request, params }) {
	// @ts-expect-error
	const headers = new Headers({
		'Authorization': request.headers.get('Authorization'),
		'Content-Type': request.headers.get('Content-Type')
	});

	const response = await fetch(`${env.PUBLIC_API_URL}/inscriptions/${params.slug}`, {
		method: 'PATCH',
		// @ts-expect-error
		duplex: 'half',
		headers,
		body: request.body
	});

	return response;
}
