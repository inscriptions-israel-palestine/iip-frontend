<script lang="ts">
	import WordListRow from '$lib/components/NameRow.svelte';
	import WordListFilters from '$lib/components/NameFilters.svelte';

	export let data;

	$: languages = data.AVAILABLE_LANGUAGES;
	$: language = data.language;
	$: allWords = data.words;
	$: words = allWords.lemmas;
	$: allForms = words.forms;

	function initialCaps(s: string) {
		return `${s[0].toUpperCase()}${s.slice(1)}`;
	}
</script>

<WordListFilters {words} />

<p id="lang-select" style="padding-left: 200px; padding-right: 80px;">
	<span class="italic">Select language:</span>
	{#each languages as l}
		<a href="/wordlist/under_construction/names/{l}" class="px-1" class:font-bold={l === language}
			>{initialCaps(l)}</a
		>
	{/each}
</p>
<h2
	class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl"
	style="padding: 20px; padding-left: 200px"
>
	Index of Names in {initialCaps(language)}
</h2>

<p style="padding-left: 200px; padding-right: 80px;">
	UNDER CONSTRUCTION
	<br /><br />
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mollis lorem ligula, id volutpat
	tortor condimentum id. Ut bibendum tincidunt neque. Proin eu augue ut urna viverra fringilla. Praesent
	bibendum finibus elementum. Suspendisse augue sapien, eleifend ut est et, ultricies dignissim nisi.
	Sed bibendum luctus ligula, quis tempor elit eleifend eget. Cras sed pretium nisi. Donec imperdiet
	enim in vestibulum dictum. Vivamus ultrices euismod urna a convallis. Maecenas fringilla tortor non
	tempus ultrices.<br /><br />
</p>

<div class="container text-left" style="padding-left: 200px;">
	<table id="latin-pos-table" class="table-auto" width="100%">
		{#each words as word, index}
			<WordListRow {word} treeData="" id={(index + 1).toString()} language="latin" />
		{/each}
	</table>
</div>
