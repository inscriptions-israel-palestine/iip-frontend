<script lang="ts">
	import type { WordListWord } from '$lib/types/word_list_word.type';
	import BookIcon from './BookIcon.svelte';
	import TreeIcon from './TreeIcon.svelte';

	export let word: WordListWord;

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
		<button type="button" class="btn btn-primary" on:click={toggleIsExpanded}>+</button>
		<span class="font-bold">{word.lemma}</span>
		{word.pos} ({word.count})
		<a
			href={`http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=${word.lemma}&lang=la`}
			target="_blank"><BookIcon /></a
		>
		<button class="tree-icon" on:click={toggleIsTreeShown}><TreeIcon /></button>
	</td>
</tr>
