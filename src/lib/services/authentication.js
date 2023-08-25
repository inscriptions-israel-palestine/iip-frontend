// @ts-check

import { Auth0Client } from '@auth0/auth0-spa-js';
import {
	PUBLIC_AUTH0_CLIENT_ID,
	PUBLIC_AUTH0_DOMAIN
} from '$env/static/public';
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable();
export const token = writable();

export async function createAuth0Client() {
	const client = new Auth0Client({
		authorizationParams: {
			redirect_uri: 'http://localhost:5173/inscriptions',
		},
		cacheLocation: 'localstorage',
		clientId: PUBLIC_AUTH0_CLIENT_ID,
		domain: PUBLIC_AUTH0_DOMAIN,
	});

	try {
		isAuthenticated.set(await client.isAuthenticated());
		user.set(await client.getUser());
		token.set(await client.getTokenSilently());
	} catch (e) {
		// just ignore this error, as the user won't be logged in.
	}

	return client;
}

export async function logIn(client) {
	try {
		await client.loginWithRedirect();

		user.set(await client.getUser());
		isAuthenticated.set(true);
	} catch (e) {
		console.error(e);
	}
}

export function logOut(client) {
	return client.logout();
}