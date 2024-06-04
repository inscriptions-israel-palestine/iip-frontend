<script lang="ts">
	import WordListRow from '$lib/components/NameRow.svelte';
	import WordListFilters from '$lib/components/NameFilters.svelte';

	export let data;

	$: allWords = data.words;
	$: words = allWords.lemmas;
	$: allForms = words.forms;
</script>

<WordListFilters {words} />

	<p id="lang-select" align="justify" style="padding-left: 200px; padding-right: 80px;">
<span class="italic">Select language:</span> <a href="/wordlist/under_construction/names/latin">Latin</a> | <a href="/wordlist/under_construction/names/greek">Greek</a> | <span class="font-bold">Hebrew</span> | <a href="/wordlist/under_construction/names/aramaic">Aramaic</a>
    </p>
<h2
	class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl"
	style="padding: 20px; padding-left: 200px"
>
	Index of Names in Hebrew
</h2>

<p align="justify" style="padding-left: 200px; padding-right: 80px;">
UNDER CONSTRUCTION
<br><br>
	 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mollis lorem ligula, id volutpat tortor condimentum id. Ut bibendum tincidunt neque. Proin eu augue ut urna viverra fringilla. Praesent bibendum finibus elementum. Suspendisse augue sapien, eleifend ut est et, ultricies dignissim nisi. Sed bibendum luctus ligula, quis tempor elit eleifend eget. Cras sed pretium nisi. Donec imperdiet enim in vestibulum dictum. Vivamus ultrices euismod urna a convallis. Maecenas fringilla tortor non tempus ultrices.<br /><br />
</p>

<div class="container text-left" style="padding-left: 200px;">
	<table id="latin-pos-table" class="table-auto" width="100%">
		{#each words as word, index}
			<WordListRow {word} treeData='' id={index + 1} language="latin" />
		{/each}
	</table>
</div>
