<script lang="ts">
	import { page } from '$app/stores';
	import GridIcon from '$lib/components/GridIcon.svelte';
	import ListResults from '$lib/components/ListResults.svelte';
	import MapIcon from '$lib/components/MapIcon.svelte';

	export let data;

	$: inscriptions = data.inscriptions;
	$: currentPage = data.page;
	$: totalPages = data.pages;
</script>

<main class="py-10">
	<div class="fixed top-32 right-4 z-40">
		<div class="flex space-x-2">
			<a
				href={`/inscriptions/map${$page.url.search}`}
				class="relative bg-stone-200 inline-flex h-12 w-12 flex-shrink-0 cursor-pointer rounded-md border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-600"
			>
				<MapIcon />
			</a>
		</div>
	</div>
	{#if inscriptions.length === 0}
		<h2 class="prose prose-heading prose-h2 text-center text-2xl">No inscriptions found.</h2>
	{:else}
		<ListResults {inscriptions} {currentPage} {totalPages} />
	{/if}
</main>
