<script lang="ts">
	import WordListRow from '$lib/components/WordListRow.svelte';
	import WordListFilters from '$lib/components/WordListFilters.svelte';

	export let data;

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
	}

	$: currentLanguage = data.language;
	$: languages = data.AVAILABLE_LANGUAGES;
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
		<a
			href="/wordlist/{l}"
			class="px-1"
			class:font-bold={l === currentLanguage}>{initialCaps(l)}</a
		>
	{/each}
</p>
<h2
	class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl"
	style="padding: 20px; padding-left: 200px"
>
	{initialCaps(currentLanguage)} Wordlist
</h2>

<p style="padding-left: 200px; padding-right: 80px;">
	The following is the wordlist of Aramaic in the Inscriptions of Israel/Palestine. The list
	presents each headword, its part of speech, and the number of times that word appears in the
	corpus. To see each of the specific morphological forms, click on the brown button next to the
	headword. You will be presented with a list of word forms, their morphological data, and counts of
	their appearances in the IIP corpus. This display will also show keyword-in-context views,
	presenting the contexts in which these words appear.
	<br /><br />
	This wordlist provides links to the {lexicon(currentLanguage)}, indicated with the dictionary icon
	(<img class="sample-icons" alt="dictionary icon" src="/img/dictionary.png" />).
	{#if currentLanguage === 'latin'}
		In addition, it presents <a
			href="http://linguistics.chrisculy.net/lx/software/DoubleTreeJS/"
			style="color: grey">Double Tree</a
		>
		KWIC visualizations as another lens into the contexts in which these words appear. To view the
		Double Tree visualization for any word, click the tree icon (<img
			class="sample-icons"
			alt="tree icon"
			src="/img/tree-icon.png"
		/>)
	{:else}
		<a href="http://linguistics.chrisculy.net/lx/software/DoubleTreeJS/" style="color: grey"
			>Double Tree</a
		>
		KWIC visualization functionality (<img
			class="sample-icons"
			alt="tree icon"
			src="/img/tree-icon.png"
		/>) is still in progress for {initialCaps(currentLanguage)} and will be available soon.<br /><br
		/>
	{/if}
</p>

<div class="container text-left" style="padding-left: 200px;">
	<table id="latin-pos-table" class="table-auto" width="100%">
		{#each words as word, index}
			<!--WordListRow {word} treeData={allWords.db_list} id={index+1} language='aramaic' /-->
			<WordListRow {word} treeData="" id={(index + 1).toString()} language={currentLanguage} />
		{/each}
	</table>
</div>
