<script lang="ts">
	import type { BibliographicEntry } from '$lib/types/inscription.type';
	import type { ZoteroItem } from '$lib/types/zotero.type';

	export let item: ZoteroItem & BibliographicEntry;

	$: console.log(item);
</script>

<div class="flex-auto text-sm prose prose-stone prose-p">
	<div class="flex prose prose-stone">
		{@html item.bib}
		<a class="text-xs" href={item.links.alternate.href}>Zotero</a>
	</div>
	<div>
		{item.bibl_scope_unit}
		{item.bibl_scope}
	</div>
</div>
