<script lang="ts">
	import type { BibliographicEntry } from '$lib/types/inscription.type';
	import type { ZoteroItem } from '$lib/types/zotero.type';
	import { afterUpdate } from 'svelte';

	const ZOTERO_CSL_QUERY_SELECTOR = '.csl-entry';

	export let item: ZoteroItem & BibliographicEntry;

	let itemContainer: HTMLElement;

	afterUpdate(() => {
		// This way of inserting the biblScope is not ideal,
		// but because Zotero sends back a fully-formed HTML
		// fragment, I'm not sure there's a nicer-looking way
		// to insert this information without modifying
		// the Zotero bibliography directly.
		const { bibl_scope_unit, bibl_scope } = item;

		const el = itemContainer.querySelector(ZOTERO_CSL_QUERY_SELECTOR);

		let biblScopeUnit = bibl_scope_unit;

		if (biblScopeUnit === 'incscr') {
			biblScopeUnit = 'inscription';
		}

		const span = document.createElement('span');

		span.textContent = ` ${biblScopeUnit} ${bibl_scope}.`;

		el?.appendChild(span);
	});
</script>

<div class="flex-auto">
	<div class="flex justify-between">
		<div bind:this={itemContainer}>
			{@html item.bib}
		</div>
		<a class="hover:underline text-sm" href={item.links?.alternate?.href}>Zotero</a>
	</div>
</div>
