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
    };
    // Function to extract unique starting letters from words
    function getUniqueStartingLetters() {
        const startingLetters = new Set();
        words.forEach(word => {
        const firstLetter = word.lemma.normalize('NFD')[0]
        if (typeof firstLetter !== "undefined") {
            const lowerCaseChar = firstLetter.toLowerCase();
            startingLetters.add(lowerCaseChar);
        }
        });
        return Array.from(startingLetters).sort();
    };
</script>

<div class="container text-left">

    <div class="floating-menu">
    
    <p align="center" id="atoz">
      {#each getUniqueStartingLetters() as letter, index}
        {#if words.some(word => word.lemma.toLowerCase().startsWith(letter))}
          {#if index !== 0}&nbsp;|{/if}
          <a class="alphalink" on:click={(e) => alphaClick(e, letter)}>{letter}</a>
        {/if}
      {/each}
    </p>
    
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
	</div>
	
	
	
    <p id="lang-select" align="justify" style="padding-left: 200px; padding-right: 80px;">
<span class="italic">Select language:</span> <span class="font-bold">Latin</span> | <a href="/wordlist/greek">Greek</a> | <a href="/wordlist/hebrew">Hebrew</a> | <a href="/wordlist/aramaic">Aramaic</a>
    </p>
    <h2 class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl" style="padding: 20px; padding-left: 200px">Wordlists</h2>
    
    <p align="justify" style="padding-left: 200px; padding-right: 80px;">
The following is the wordlist of Latin in the Inscriptions of Israel/Palestine. The list presents each headword, its part of speech, and the number of times that word appears in the corpus. To see each of the specific morphological forms, click on the blue button next to the headword. You will be presented with a list of word forms, their morphological data, and counts of their appearances in the IIP corpus. This display will also show keyword-in-context views, presenting the contexts in which these words appear.
    <br><br>
This wordlist provides links to the Perseus Latin dictionary, indicated with the dictionary (<img class="sample-icons" src="/img/dictionary.png"/>) icon. In addition, it presents Double Tree KWIC visualizations as another lens into the contexts in which these words appear. To view the Double Tree visualization for any word, click the tree (<img class="sample-icons" src="/img/tree-icon.png"/>) icon.<br><br></p>

<div class="container text-left" style="padding-left: 200px;">

	<table id="latin-pos-table" class="table-auto" width="100%">
		{#each words as word, index}
			<WordListRow {word} id={index+1} language='latin' />
		{/each}
	</table>
</div>
</div>
