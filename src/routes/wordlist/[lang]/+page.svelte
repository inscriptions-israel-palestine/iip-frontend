<script lang="ts">
	import WordListRow from '$lib/components/WordListRow.svelte';

	export let data;

	$: allWords = data.words;
	$: words = allWords.lemmas;
	$: allForms = words.forms;
	$: doubletree_data: JSON.stringify(allWords.db_list);

/*	function filterByPos() {
		console.log('filtering');
	}*/
	
    function posFilter() {
      const checked = new Set();
      const posFilterCheckboxes = document.querySelectorAll('.pos-filter');
      const latinPosTable = document.getElementById('latin-pos-table');

      posFilterCheckboxes.forEach((obj) => {
        if (obj.checked) {
          checked.add(obj.value);
        }
      });
	    const noCheck = checked.size == 0
	    var table = document.getElementById("latin-pos-table")
	    var hiding = false
	    for(var r = 0, row; row = table.rows[r]; r++) {
		    if(row.classList.contains('level0')) {
			    const rowHTML = row.innerHTML
			    const ind = rowHTML.indexOf("</span>")
			    const pos = rowHTML.substring(ind + 8, rowHTML.indexOf(" ", ind + 9))
			    if(noCheck || checked.has(pos)) {
				    row.style.display = '';
				    hiding = false;
			    } else {
				    row.style.display = 'none';
				    hiding = true;
			    }
		    } else if (hiding) {
			    row.style.display = 'none';
		    }
	    }
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
			<button type="submit" on:click={posFilter} class="btn btn-primary mb-2">Submit</button>
		</div>
	</div>

	<table id="latin-pos-table" class="table-auto">
	<!-- FIXME: The page displays with ids as desired, but I'm getting an error that reads as follows: "Error: Cannot have duplicate keys in a keyed each: Keys at index 0 and 1 with value 'undefined' are duplicates" -->
		<!--{#each words as word, index (word.id)}-->
		{#each words as word, index}
			<!--WordListRow {word} id={index + 1}/-->
			<WordListRow {word} id={index+1}/>
		{/each}
	</table>
</div>
