<script lang="ts">
	import type { Edition } from '$lib/types/inscription.type';
    
	// @ts-expect-error
	import CETEI from 'CETEIcean';
	import { onMount } from 'svelte';

	const teiTransformer = new CETEI();

    export let edition: Edition;

    let editionElement: HTMLElement;


	async function transformTei(raw: string | undefined | null) {
		if (!raw) {
			return Promise.resolve('');
		}

		return new Promise((resolve, _reject) =>
			teiTransformer.makeHTML5(raw, (data: any) => resolve(data))
		);
	}

    onMount(async () => {
        const html = await transformTei(edition.raw_xml);

        // @ts-expect-error
        editionElement.replaceChildren(html);
    });
</script>

<div class="prose prose-stone" bind:this={editionElement}>
    {edition.text}
</div>
