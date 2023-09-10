<script lang="ts">
	import { page } from '$app/stores';
	import TableResults from '$lib/components/TableResults.svelte';

	export let data;

	$: inscriptions = data.inscriptions;
</script>

<main class="py-10">
	<div class="fixed top-32 right-4 z-40">
		<a
			href={`/inscriptions/map${$page.url.search}`}
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
						d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
					/>
				</svg>
			</span>
		</a>
	</div>
	<TableResults {inscriptions} currentPage={data.page} totalPages={data.pages} />
</main>
