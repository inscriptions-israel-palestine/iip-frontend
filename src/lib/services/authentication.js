// @ts-check

import { Auth0Client } from '@auth0/auth0-spa-js';
import { env } from '$env/dynamic/public';
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable();
export const token = writable();

function redirectUrl() {
	return `${window.location.protocol}//${window.location.hostname}:${window.location.port}/inscriptions`;
}

export async function createAuth0Client() {
	const client = new Auth0Client({
		authorizationParams: {
			audience: env.PUBLIC_AUTH0_AUDIENCE,
			redirect_uri: redirectUrl(),
			scope: 'inscriptions:all'
		},
		cacheLocation: 'localstorage',
		clientId: env.PUBLIC_AUTH0_CLIENT_ID,
		domain: env.PUBLIC_AUTH0_DOMAIN
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
	return client.logout({
		logoutParams: {
			returnTo: redirectUrl()
		}
	});
}
