<script lang="ts">
    import type { Auth0Client, User } from '@auth0/auth0-spa-js';

    import { beforeUpdate, onMount } from 'svelte';

    import {
		createAuth0Client,
		isAuthenticated,
		logIn as auth0LogIn,
		logOut as auth0LogOut
	} from '$lib/services/authentication';

    let authed = false;
	let auth0Client: Auth0Client;
	let user: User;

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
			auth0Client = await createAuth0Client();
		}

		await auth0Client.getTokenSilently();
	})

	onMount(async () => {
		auth0Client = await createAuth0Client();
		
        await auth0Client.getTokenSilently();
	});
</script>

<div>
    {#if authed}
        <a href="#/logout" on:click|preventDefault={logOut}>Log out</a>
    {:else}
        <a href="#/login" on:click|preventDefault={logIn}>Log in</a>
    {/if}    
</div>
