<script lang="ts">
	import type { WordListWord } from '$lib/types/word_list_word.type';
	import BookIcon from './BookIcon.svelte';
	import TreeIcon from './TreeIcon.svelte';

	export let word: WordListWord;
	/*export let id;*/

	$: isExpanded = false;
	$: isTreeShown = false;

	function toggleIsExpanded(_e: Event) {
		isExpanded = !isExpanded;
	}

	function toggleIsTreeShown(_e: Event) {
		isTreeShown = !isTreeShown;
	}
</script>

<tr class={`level0 pos${word.pos}`}>
	<td colspan="2">
		<button type="button" id="button" class="btn btn-primary" on:click={toggleIsExpanded}>+</button>
		<span class="font-bold">{word.lemma}</span>
		{word.pos} ({word.count})
		<a
			href={`http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=${word.lemma}&lang=la`}
			target="_blank"><BookIcon />
			<!--img class="dictionary-icon" style="height: 20px; display: inline;" src='https://raw.githubusercontent.com/cmroughan/iip-production/wordlists2023/iip_smr_web_app/static/wordlist/dictionary.png'/--></a>
		<button class="tree-icon" on:click={toggleIsTreeShown}><TreeIcon /></button>
	</td>
</tr>

{#if isExpanded}
    {#each Object.values(word.forms) as form}
        {#each form.kwics as kwic, index}
        {#if (index == 0)}
            <tr class="level1 tog">
            <td rowspan={form.count} class="formentry" style="vertical-align:top">
                {form.form}
                <br>
                            ↳ {form.pos} ({form.count})
            </td>
            <td>
                {kwic[0][0]} <b>{kwic[0][1]}</b> {kwic[0][2]} (<a href="https://iip-dev.us.reclaim.cloud/inscriptions/{kwic[1]}">{kwic[1]}</a>)
            </td>
            </tr>
        {:else}
            <tr class="level1 tog">
            <td>
                {kwic[0][0]} <b>{kwic[0][1]}</b> {kwic[0][2]} (<a href="https://iip-dev.us.reclaim.cloud/inscriptions/{kwic[1]}">{kwic[1]}</a>)
            </td>
            </tr>
        {/if}
        {/each}
    {/each}
{/if}

