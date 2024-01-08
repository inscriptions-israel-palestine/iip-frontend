<script lang="ts">
	import type { WordListWord } from '$lib/types/word_list_word.type';
	import BookIcon from './BookIcon.svelte';
	import TreeIcon from './TreeIcon.svelte';

	export let word: WordListWord;
	export let language;
	export let id;

	$: isExpanded = false;
	$: isTreeShown = false;

	function toggleIsExpanded(_e: Event) {
		isExpanded = !isExpanded;
		const button = document.getElementById(`button${id}`);
        button.textContent = isExpanded ? "-" : "+";
	}

	function toggleIsTreeShown(_e: Event) {
		isTreeShown = !isTreeShown;
	}
	
  function getDictionary(language, lemma) {
    switch (language) {
      case 'latin':
        return `http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=${lemma}&lang=la`;
      case 'greek':
        return `https://www.perseus.tufts.edu/hopper/morph?l=${lemma}&la=greek`;
      case 'hebrew':
        return `https://www.morfix.co.il/en/${lemma}`;
      case 'aramaic':
        return `https://cal.huc.edu/browseSKEYheaders.php?tools=on&first3=${lemma.slice(0, 3)}`;
    }
  }
</script>

<tr class="alpha_link"><a id="{word.lemma.normalize('NFD')[0]}"/></tr>
<tr class={`level0 pos${word.pos}`}>
	<td colspan="2">&nbsp;<br>
	    <table><tr><td rowspan="2" style="vertical-align:center;">
		<button type="button" id="button{id}" class="btn btn-primary" on:click={toggleIsExpanded}>+</button></td><td>
		<span class="font-bold">{word.lemma}</span>
		{word.pos} ({word.count})</td></tr><tr>
		<td>
		<a href={getDictionary(language, word.lemma)} target="_blank">
		    <img class="dictionary-icon" src="/img/dictionary.png" alt="Dictionary icon"/>
		</a> 
		<img class="tree-icon" src="/img/tree-icon.png"/></td></tr></table>
	</td>
</tr>

{#if isExpanded}
    {#each Object.values(word.forms) as form}
        {#each form.kwics as kwic, index}
        {#if (index == 0)}
            <tr class="level1 tog">
            <td rowspan={form.count} class="formentry" style="vertical-align:top;">
                {form.form}
                <br>
                            ↳ {form.pos} ({form.count})
            </td>
            <td style="vertical-align:top">
                {kwic[0][0]} <b>{kwic[0][1]}</b> {kwic[0][2]} (<a href="/inscriptions/{kwic[1]}" style="color: grey">{kwic[1]}</a>)
            </td>
            </tr>
        {:else}
            <tr class="level1 tog">
            <td>
                {kwic[0][0]} <b>{kwic[0][1]}</b> {kwic[0][2]} (<a href="/inscriptions/{kwic[1]}" style="color: grey">{kwic[1]}</a>)
            </td>
            </tr>
        {/if}
        {/each}
        <tr>&nbsp;</tr>
    {/each}
{/if}

