<script lang="ts">
	import type { BibliographicEntry } from "$lib/types/inscription.type";

    export let entry: BibliographicEntry;
    let zoteroHtml: string;

    const GROUP_ID = 180188;

    $: tag = entry.ptr_target?.replace('.xml', '');

    async function getZoteroData() {
        const resp = await fetch(`https://api.zotero.org/groups/${GROUP_ID}/items?tag=${tag}&include=bib&style=chicago-note-bibliography`, {
            // @ts-expect-error
            Accept: 'application/json',
            'Zotero-API-Version': 3,
        });

        return await resp.json();
    }
</script>

<div class="flex-auto text-sm prose prose-stone prose-p">
    {#await getZoteroData()}
        <span class="font-medium prose prose-stone">{entry.ptr_target}</span>
        {entry.bibl_scope_unit}
        {entry.bibl_scope}
    {:then data}
        {#each data as item}
            <div class="flex prose prose-stone">
                {@html item.bib}
                <a class="text-xs" href={item.links.alternate.href}>Zotero</a>
            </div>
        {/each}
    {/await}
</div>