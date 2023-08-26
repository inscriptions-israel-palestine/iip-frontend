import { env } from '$env/dynamic/public';

export async function PATCH({ request, params }) {
	const response = await fetch(`${env.PUBLIC_API_URL}/inscriptions/${params.slug}`, {
		method: 'PATCH',
		duplex: 'half',
		headers: request.headers,
		body: request.body
	});

	return response;
}
