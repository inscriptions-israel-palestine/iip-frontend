<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';

	import RenderedEdition from './RenderedEdition.svelte';
	import SearchResultImage from './SearchResultImage.svelte';

	export let inscription: Inscription;

	$: transcription = inscription?.editions?.find(
		(edition) => edition.edition_type === 'transcription'
	);
	$: translation = inscription?.editions?.find((edition) => edition.edition_type === 'translation');
	$: inscriptionId = inscription?.filename?.replace('.xml', '');

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

<tr>
	<td class="hidden sm:table-cell sm:w-24 sm:h-24"><SearchResultImage {inscription} /></td>
	<td
		><a href={`/inscriptions/${inscriptionId}`}>
			{inscription.title}
		</a>
	</td>
	<td>{inscriptionId}</td>
	<td>{(inscription.languages || []).map((language) => language.label).join(', ')}</td>
	<td>{formatDate(inscription)}</td>
	<td class="hidden sm:table-cell prose prose-stone">
		{#if transcription && transcription.text}
			<RenderedEdition edition={transcription} />
		{:else}
			[no transcription]
		{/if}
	</td>
	<td class="hidden sm:table-cell prose prose-stone">
		{#if translation && translation.text}
			<RenderedEdition edition={translation} />
		{:else}
			[no translation]
		{/if}
	</td>
</tr>
