<script lang="ts">
	import type { Edition, Inscription } from '$lib/types/inscription.type';
	
	import { page } from '$app/stores';
	import SearchResultImage from './SearchResultImage.svelte';

	export let inscriptions: Inscription[] = [];
	export let currentPage: number = 1;
	export let totalPages: number = 1;

	function formatDate(inscription: Inscription) {
		if (inscription.not_before === inscription.not_after) {
			return parseDate(inscription.not_before);
		}

		return `Between ${parseDate(inscription.not_before)} and ${parseDate(inscription.not_after)}`;
	}

	function getEditionOfType(editions: Edition[], type: string) {
		if (editions.length === 0) {
			return 'Not found';
		}

		const edition = editions.find((edition) => edition.edition_type === type);

		return edition?.text || `[no ${type}]`;
	}

	function getTranscription(inscription: Inscription) {
		return getEditionOfType(inscription.editions || [], 'transcription');
	}

	function getTranslation(inscription: Inscription) {
		return getEditionOfType(inscription.editions || [], 'translation');
	}

	function pageHref(n: number) {
		$page.url.searchParams.set('page', n.toString());

		return $page.url.toString();
	}

	function parseDate(s: string | undefined) {
		if (s === undefined) {
			return 'Unknown';
		}

		const n = parseInt(s, 10);

		if (n < 0) {
			return `${Math.abs(n)} BCE`;
		}

		return `${n} CE`;
	}
</script>

<div class="absolute top-24 left-96 px-24 overflow-auto">
	<table class="table table-md table-pin-rows">
		<thead>
			<tr>
				<td><!-- image if available --></td>
				<td>Title</td>
				<td>Language(s)</td>
				<td>Date</td>
				<td>Transcription</td>
				<td>Translation</td>
			</tr>
		</thead>
		<tbody>
			{#if inscriptions && inscriptions.length > 0}
				{#each inscriptions as inscription (inscription.id)}
					<tr>
						<td class="w-24 h-24"><SearchResultImage {inscription} /></td>
						<td
							><a href={`/inscriptions/${inscription.filename.replace('.xml', '')}`}>
								{inscription.title}
							</a>
						</td>
						<td>{(inscription.languages || []).map((language) => language.label).join(', ')}</td>
						<td>{formatDate(inscription)}</td>
						<td>{getTranscription(inscription)}</td>
						<td>{getTranslation(inscription)}</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
	<nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
		<div class="max-w-screen-lg">
			{#each { length: totalPages } as _, i}
				<a
					href={pageHref(i + 1)}
					class={`${
						i + 1 === currentPage
							? 'border-stone-500 text-stone-700'
							: 'border-transparent text-gray-500 hover:text-gray-700'
					} inline-flex items-center border-2 p-2 rounded-sm text-sm font-medium hover:border-gray-300`}
					>{i + 1}</a
				>
			{/each}
		</div>
	</nav>
</div>
