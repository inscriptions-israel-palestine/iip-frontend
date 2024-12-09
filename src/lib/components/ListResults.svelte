<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';

	import { page } from '$app/stores';
	import ListResultRow from './ListResultRow.svelte';

	export let inscriptions: Inscription[] = [];
	export let currentPage: number = 1;
	export let totalPages: number = 1;

	$: pages = Array.from({length: totalPages}, (_, i) => i);
	$: searchParams = new URLSearchParams($page.url.search);

	function pageHref(n: number) {
		searchParams.set('page', n.toString());

		return `${$page.url.pathname}?${searchParams.toString()}`;
	}
</script>

<div class="top-24 overflow-auto md:mx-24 max-w-screen-lg">
	<table class="table table-md table-pin-rows">
		<thead>
			<tr>
				<td class="hidden sm:table-cell"><!-- image if available --></td>
				<td>Title</td>
				<td>ID</td>
				<td>Language(s)</td>
				<td>Date</td>
				<td class="hidden sm:table-cell">Transcription</td>
				<td class="hidden sm:table-cell">Translation</td>
			</tr>
		</thead>
		<tbody>
			{#if inscriptions && inscriptions.length > 0}
				{#each inscriptions as inscription (inscription.id)}
					<ListResultRow {inscription} />
				{/each}
			{/if}
		</tbody>
	</table>
	<nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
		<div class="max-w-screen-lg">
			{#each pages as i}
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
