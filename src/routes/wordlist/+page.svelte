<script lang="ts">
	import { onMount } from 'svelte';

	export let data;

	$: words = data.words;

	function filterByPos() {
		console.log('filtering');
	}

	onMount(async () => {
		console.log(words);
	});
</script>

<div id="posfilter">
	<h5>Part of Speech Filter:</h5>
	<div class="form-group">
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
