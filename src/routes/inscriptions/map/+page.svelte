<script lang="ts">
	import { page } from '$app/stores';
	import ListIcon from '$lib/components/ListIcon.svelte';
	import SearchMap from '$lib/components/SearchMap.svelte';

	export let data;

	$: inscriptions = data.inscriptions;
</script>

<main class="py-10">
	<div class="px-4 sm:px-6 max-h-full">
		<div class="fixed top-32 right-4 z-50">
			<div class="flex space-x-2">
				<a
					href={`/inscriptions${$page.url.search}`}
					class="relative bg-stone-200 inline-flex h-12 w-12 flex-shrink-0 cursor-pointer rounded-md border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-600"
				>
					<ListIcon />
				</a>
			</div>
		</div>

		<SearchMap {inscriptions} />
	</div>
</main>
