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
	};
	
	function lexicon(s: string) {
		switch (s) {
			case 'aramaic':
				return 'Comprehensive Aramaic Lexicon';
			case 'greek':
				return 'Perseus Greek dictionary';
			case 'hebrew':
				return 'Morfix Hebrew dictionary';
			case 'latin':
				return 'Perseus Latin dictionary';
			default:
				return s;
		}
	};
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
	{#if language != 'aramaic'}
	The following is list of personal names in {initialCaps(language)} in the Inscriptions of Israel/Palestine. 
	The list presents each headword for the name, the number of times that name appears in the corpus, the
	gender of the name, and whether the name has been categorized as a Christian one, a Jewish one, or other.
	{:else}
	The following is list of personal names in {initialCaps(language)} in the Inscriptions of Israel/Palestine. 
	The list presents each headword for the name and the number of times that name appears in the corpus. 
	<span style="text-decoration: underline;">Data for the gender of the name and the categorization for the name is not yet available for Aramaic.</span>
	{/if}
	<br/><br/>
	To see each of the specific morphological forms, click on the brown button next to the
	headword. You will be presented with a list of forms, their morphological data, and counts of
	their appearances in the IIP corpus. This display will also show keyword-in-context views,
	presenting the contexts in which these names appear.
	<br/><br/>
	For the other indices for {initialCaps(language)}, <a href="/wordlist/under_construction/indices/{language}" style="color: grey">click here</a>. For the general {initialCaps(language)} wordlist, <a href="/wordlist/{language}" style="color: grey">click here</a>.
	<br /><br />
</p>

<div class="container text-left" style="padding-left: 200px;">
	<table id="latin-pos-table" class="table-auto" width="100%">
		{#each words as word, index}
			<WordListRow {word} treeData="" id={(index + 1).toString()} language="latin" />
		{/each}
	</table>
</div>
