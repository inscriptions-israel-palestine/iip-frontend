<script lang="ts">
	import type { ZoteroItem } from "$lib/types/zotero.type";

    export let item: ZoteroItem;
</script>

<div class="flex-auto text-sm prose prose-stone prose-p">
    <div class="flex prose prose-stone">
        {@html item.bib}
        <a class="text-xs" href={item.links.alternate.href}>Zotero</a>
    </div>
</div>