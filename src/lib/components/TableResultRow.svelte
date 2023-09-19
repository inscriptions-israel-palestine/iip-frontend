<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';

	import RenderedEdition from './RenderedEdition.svelte';
	import SearchResultImage from './SearchResultImage.svelte';

	export let inscription: Inscription;

	$: transcription = inscription?.editions?.find(
		(edition) => edition.edition_type === 'transcription'
	);

	function formatDate(inscription: Inscription) {
		if (inscription.not_before === inscription.not_after) {
			return parseDate(inscription.not_before);
		}

		return `Between ${parseDate(inscription.not_before)} and ${parseDate(inscription.not_after)}`;
	}

	function parseDate(s: string | undefined) {
		if (s === undefined || s === null) {
			return 'Unknown';
		}

		const n = parseInt(s, 10);

		if (isNaN(n)) {
			console.warn(`Got an invalid date: ${s}.`);
			return 'Unknown';
		}

		if (n < 0) {
			return `${Math.abs(n)} BCE`;
		}

		return `${n} CE`;
	}
</script>

<div
	class="group relative bg-white p-6"
>
	<div class="inline-flex p-3">
        <SearchResultImage {inscription} />
	</div>
	<div class="mt-8">
		<h3 class="text-base font-semibold leading-6 text-stone-800">
            <a href={`/inscriptions/${inscription.filename.replace('.xml', '')}`}>
                {inscription.title}
            </a>
		</h3>
        <h4 class="text-base leading-6 text-stone-800">
            {(inscription.languages || []).map((language) => language.label).join(', ')}
        </h4>
        <h5 class="text-base leading-6 text-stone-800">
            {formatDate(inscription)}
        </h5>
		<p class="mt-2 prose prose-p prose-sm prose-stone">
			{#if transcription && transcription.text}
				<RenderedEdition edition={transcription} />
			{:else}
				[no transcription]
			{/if}
		</p>
	</div>
</div>
