<script lang="ts">
	import WordListRow from '$lib/components/WordListRow.svelte';
	import WordListFilters from '$lib/components/WordListFilters.svelte';

	export let data;

	$: allWords = data.words;
	$: words = allWords.lemmas;
	$: allForms = words.forms;
</script>

<WordListFilters {words} />
	
	<p id="lang-select" align="justify" style="padding-left: 200px; padding-right: 80px;">
<span class="italic">Select language:</span> <a href="/wordlist/latin">Latin</a> | <a href="/wordlist/greek">Greek</a> | <a href="/wordlist/hebrew">Hebrew</a> | <span class="font-bold">Aramaic</span>
    </p>
    <h2 class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl" style="padding: 20px; padding-left: 200px">Aramaic Wordlist</h2>
    
    <p align="justify" style="padding-left: 200px; padding-right: 80px;">The following is the wordlist of Aramaic in the Inscriptions of Israel/Palestine. The list presents each headword, its part of speech, and the number of times that word appears in the corpus. To see each of the specific morphological forms, click on the brown button next to the headword. You will be presented with a list of word forms, their morphological data, and counts of their appearances in the IIP corpus. This display will also show keyword-in-context views, presenting the contexts in which these words appear.
    <br><br>
This wordlist provides links to the Comprehensive Aramaic Lexicon, indicated with the dictionary icon (<img class="sample-icons" alt="dictionary icon" src="/img/dictionary.png"/>). 
<!--In addition, it presents <a href="http://linguistics.chrisculy.net/lx/software/DoubleTreeJS/" style="color: grey">Double Tree</a> KWIC visualizations as another lens into the contexts in which these words appear. To view the Double Tree visualization for any word, click the tree icon (<img class="sample-icons" alt="tree icon" src="/img/tree-icon.png"/>)-->
<a href="http://linguistics.chrisculy.net/lx/software/DoubleTreeJS/" style="color: grey">Double Tree</a> KWIC visualization functionality (<img class="sample-icons" alt="tree icon" src="/img/tree-icon.png"/>) is still in progress for Aramaic and will be available soon.<br><br></p>

<div class="container text-left" style="padding-left: 200px;">

	<table id="latin-pos-table" class="table-auto" width="100%">
		{#each words as word, index}
			<!--WordListRow {word} treeData={allWords.db_list} id={index+1} language='aramaic' /-->
			<WordListRow {word} treeData='' id={index+1} language='aramaic' />
		{/each}
	</table>
</div>
