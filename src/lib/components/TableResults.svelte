<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';

	import { page } from '$app/stores';
	import TableResultRow from './TableResultRow.svelte';

	export let inscriptions: Inscription[] = [];
	export let currentPage: number = 1;
	export let totalPages: number = 1;

	function pageHref(n: number) {
		const searchParams = new URLSearchParams($page.url.search);

		searchParams.set('page', n.toString());

		return `${$page.url.pathname}?${searchParams.toString()}`;
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
					<TableResultRow {inscription} />
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
