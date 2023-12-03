<script lang="ts">
	import type { Auth0Client } from '@auth0/auth0-spa-js';

	import { beforeUpdate, onMount } from 'svelte';

	import {
		createAuth0Client,
		isAuthenticated,
		logIn as auth0LogIn,
		logOut as auth0LogOut
	} from '$lib/services/authentication';

	const REDIRECT_URL = `${window.location.protocol}//${window.location.host}/inscriptions`;

	let authed = false;
	let auth0Client: Auth0Client;

	isAuthenticated.subscribe(async (value) => {
		authed = value;
	});

	function logIn(_e: Event) {
		auth0LogIn(auth0Client);
	}

	function logOut(_e: Event) {
		auth0LogOut(auth0Client);
	}

	beforeUpdate(async () => {
		if (!auth0Client) {
			auth0Client = await createAuth0Client(REDIRECT_URL);
		}
	});

	onMount(async () => {
		auth0Client = await createAuth0Client(REDIRECT_URL);
	});
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
	<div class="mx-auto max-w-4xl">
		{#if authed}
			<a class="btn btn-default w-full" href="#/logout" on:click|preventDefault={logOut}>Log out</a>
		{:else}
			<a class="btn btn-default w-full" href="#/login" on:click|preventDefault={logIn}>Log in</a>
		{/if}
	</div>
</div>
