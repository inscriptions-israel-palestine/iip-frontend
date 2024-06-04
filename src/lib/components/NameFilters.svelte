<script lang="ts">
	import type { WordListWord } from '$lib/types/word_list_name.type';
	export let words: WordListWord[];

	function nameGenderFilter() {
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
				const ind = rowHTML.indexOf('),');
				const pos = rowHTML.substring(ind + 3, rowHTML.indexOf(' ', ind + 4));
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
		function nameTypeFilter() {
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
				const ind = rowHTML.indexOf(': ');
				const pos = rowHTML.substring(ind + 2, rowHTML.indexOf('</span>', ind + 3));
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
				const lowerCaseChar = firstLetter;
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
				{#if words.some((word) => word.lemma.startsWith(letter))}
					{#if index !== 0}&nbsp;|{/if}
					<a href="#{letter}">{letter}</a>
				{/if}
			{/each}
		</p>

		<div id="posfilter" class="flex justify-center">
			<!-- FIXME: For accessibility and development ease, this should be a proper form. -->
			<div class="form-group">
				<h5>Gender Filter:</h5>
				<div class="form-check">
					<input class="form-check-input pos-filter" type="checkbox" value="♂" id="malecheck" />
					<label class="form-check-label" for="malecheck"> Male </label>
				</div>
				<div class="form-check">
					<input class="form-check-input pos-filter" type="checkbox" value="♀" id="femalecheck" />
					<label class="form-check-label" for="femalecheck"> Female </label>
				</div>
				<button type="submit" on:click={nameGenderFilter} class="btn btn-primary mb-2">Submit</button>
			</div>
		</div>
		
		<div id="posfilter" class="flex justify-center">
			<!-- FIXME: For accessibility and development ease, this should be a proper form. -->
			<div class="form-group">
				<h5>Name type Filter:</h5>
				<div class="form-check">
					<input class="form-check-input pos-filter" type="checkbox" value="Christian" id="christiancheck" />
					<label class="form-check-label" for="christiancheck"> Christian </label>
				</div>
				<div class="form-check">
					<input class="form-check-input pos-filter" type="checkbox" value="Jewish" id="jewishcheck" />
					<label class="form-check-label" for="jewishcheck"> Jewish </label>
				</div>
				<div class="form-check">
					<input class="form-check-input pos-filter" type="checkbox" value="other" id="othercheck" />
					<label class="form-check-label" for="othercheck"> Other </label>
				</div>
				<button type="submit" on:click={nameTypeFilter} class="btn btn-primary mb-2">Submit</button>
			</div>
		</div>
	</div>
</div>
