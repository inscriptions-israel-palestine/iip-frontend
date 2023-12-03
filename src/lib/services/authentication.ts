// @ts-check

import { Auth0Client } from '@auth0/auth0-spa-js';
import { env } from '$env/dynamic/public';
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable();
export const token = writable();

function redirectUrl() {
	const port = window.location.port ? `:${window.location.port}` : '';
	return `${window.location.protocol}//${window.location.hostname}${port}/inscriptions`;
}

export async function createAuth0Client(redirect_uri: string) {
	const client = new Auth0Client({
		authorizationParams: {
			audience: env.PUBLIC_AUTH0_AUDIENCE,
			redirect_uri,
			scope: 'inscriptions:all'
		},
		cacheLocation: 'localstorage',
		clientId: env.PUBLIC_AUTH0_CLIENT_ID,
		domain: env.PUBLIC_AUTH0_DOMAIN
	});

	console.log(client)

	try {
		const clientIsAuthenticated = await client.isAuthenticated();
		isAuthenticated.set(clientIsAuthenticated);

		if (clientIsAuthenticated) {
			user.set(await client.getUser());
			token.set(await client.getTokenSilently());
		}
	} catch (e) {
		// just ignore this error, as the user won't be logged in.
	}

	return client;
}

export async function logIn(client: Auth0Client) {
	try {
		await client.loginWithRedirect();

		user.set(await client.getUser());
		isAuthenticated.set(true);
	} catch (e) {
		console.error(e);
	}
}

export function logOut(client: Auth0Client) {
	return client.logout({
		logoutParams: {
			returnTo: redirectUrl()
		}
	});
}
