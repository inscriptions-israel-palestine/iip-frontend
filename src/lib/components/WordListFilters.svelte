<script lang="ts">
	import type { WordListWord } from '$lib/types/word_list_word.type';
	export let words: WordListWord[];

	function posFilter() {
		const checked = new Set();
		const posFilterCheckboxes = document.querySelectorAll('.pos-filter');
		const latinPosTable = document.getElementById('latin-pos-table');

		posFilterCheckboxes.forEach((obj) => {
			if (obj.checked) {
				checked.add(obj.value);
			}
		});
		const noCheck = checked.size == 0;
		var table = document.getElementById('latin-pos-table');
		var hiding = false;
		for (var r = 0, row; (row = table.rows[r]); r++) {
			if (row.classList.contains('level0')) {
				const rowHTML = row.innerHTML;
				const ind = rowHTML.indexOf('</span>');
				const pos = rowHTML.substring(ind + 8, rowHTML.indexOf(' ', ind + 9));
				if (noCheck || checked.has(pos)) {
					row.style.display = '';
					hiding = false;
				} else {
					row.style.display = 'none';
					hiding = true;
				}
			} else if (row.classList.contains('alpha_link')) {
			} else if (hiding) {
				row.style.display = 'none';
			}
		}
	}
	// Function to extract unique starting letters from words
	function getUniqueStartingLetters() {
		const startingLetters = new Set();
		words.forEach((word) => {
			const firstLetter = word.lemma.normalize('NFD')[0];
			if (typeof firstLetter !== 'undefined') {
				const lowerCaseChar = firstLetter.toLowerCase();
				startingLetters.add(lowerCaseChar);
			}
		});
		return Array.from(startingLetters).sort();
	}

	function alphaClick(event) {
		const letter = event.target.innerHTML;
		findAndScroll(letter);
	}

	function findAndScroll(letter) {
		var table = document.getElementById('latin-pos-table');
		var scrollTop = window.scrollY;
		let offset = 0;
		for (var r = 0, row; (row = table.rows[r]); r++) {
			if (row.classList.contains('level0')) {
				const textContent = row.querySelector('span').textContent.trim();
				const normalizedText = textContent.normalize('NFD');
				if (normalizedText[0] == letter) {
					offset = row.getBoundingClientRect().top + scrollTop - 100;
					window.scrollTo({
						top: offset
					});
					return;
				}
			}
		}
	}
</script>

<div class="container text-left">
	<div class="floating-menu">
		<p align="center" id="atoz">
			{#each getUniqueStartingLetters() as letter, index}
				{#if words.some((word) => word.lemma.toLowerCase().startsWith(letter))}
					{#if index !== 0}&nbsp;|{/if}
					<a href="#{letter}">{letter}</a>
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
</div>
