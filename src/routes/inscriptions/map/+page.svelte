<script lang="ts">
	import { page } from '$app/stores';
	import SearchMap from '$lib/components/SearchMap.svelte';
	import { onMount } from 'svelte';

	$: inscriptions = [];

	onMount(async () => {
		const response = await fetch($page.url.toString());
		const json = await response.json();

		inscriptions = json.inscriptions;
	});
</script>

<main class="py-10">
	<div class="px-4 sm:px-6 max-h-full">
		<div class="fixed top-32 right-4 z-50">
			<a
				href={`/inscriptions${$page.url.search}`}
				class="relative bg-stone-200 inline-flex h-12 w-12 flex-shrink-0 cursor-pointer rounded-md border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-600"
			>
				<span
					class="ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity p-1"
					aria-hidden="true"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
						/>
					</svg>
				</span>
			</a>
		</div>

		<SearchMap {inscriptions} />
	</div>
</main>
