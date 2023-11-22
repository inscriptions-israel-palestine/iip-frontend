<script lang="ts">
	import WordListRow from '$lib/components/WordListRow.svelte';

	export let data;

	$: allWords = data.words;
	$: words = allWords.lemmas;
	$: doubletree_data: JSON.stringify(allWords.db_list);

	function filterByPos() {
		console.log('filtering');
	}
</script>

<div class="container mx-auto">
	<div id="posfilter" class="flex justify-center">
		<!-- FIXME: For accessibility and development ease, this should be a proper form. -->
		<div class="form-group">
			<h5>Part of Speech Filter:</h5>
			<div class="form-check">
				<input class="form-check-input pos-filter" type="checkbox" value="N" id="nouncheck" />
				<label class="form-check-label" for="nouncheck"> Noun </label>
			</div>
			<div class="form-check">
				<input class="form-check-input pos-filter" type="checkbox" value="V" id="verbcheck" />
				<label class="form-check-label" for="verbcheck"> Verb </label>
			</div>
			<div class="form-check">
				<input class="form-check-input pos-filter" type="checkbox" value="ADJ" id="adjcheck" />
				<label class="form-check-label" for="adjcheck"> Adjective </label>
			</div>
			<div class="form-check">
				<input class="form-check-input pos-filter" type="checkbox" value="ADV" id="advcheck" />
				<label class="form-check-label" for="advcheck"> Adverb </label>
			</div>
			<div class="form-check">
				<input class="form-check-input pos-filter" type="checkbox" value="PREP" id="prepcheck" />
				<label class="form-check-label" for="prepcheck"> Preposition </label>
			</div>
			<div class="form-check">
				<input class="form-check-input pos-filter" type="checkbox" value="CC" id="cccheck" />
				<label class="form-check-label" for="cccheck"> Conjunction </label>
			</div>
			<button type="submit" on:click={filterByPos} class="btn btn-primary mb-2">Submit</button>
		</div>
	</div>

	<table id="latin-pos-table" class="table-auto">
		{#each words as word}
			<WordListRow {word} />
		{/each}
	</table>
</div>
