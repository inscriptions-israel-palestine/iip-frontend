<script lang="ts">
	import WordListFilters from '$lib/components/WordListFilters.svelte';
</script>

<div class="container text-left">
	<div class="floating-menu">
		<p id="atoz">
			Alphabetic links:<br><br>No language selected.
		</p>

		<div id="posfilter" class="flex justify-center">
			<!-- FIXME: For accessibility and development ease, this should be a proper form. -->
			<div>
				<h5>Part of Speech Filter:</h5>
				<br>No language selected.
			</div>
		</div>
	</div>
</div>

<p id="lang-select" align="justify" style="padding-left: 200px; padding-right: 80px;">
	<span class="italic">Select language:</span> <a href="/wordlist/latin">Latin</a> |
	<a href="/wordlist/greek">Greek</a>
	| <a href="/wordlist/hebrew">Hebrew</a> | <a href="/wordlist/aramaic">Aramaic</a>
</p>
<h2
	class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl"
	style="padding: 20px; padding-left: 200px"
>
	Inscriptions of Israel/Palestine Wordlists
</h2>

<p align="justify" style="padding-left: 200px; padding-right: 80px;">
	These pages contain wordlists for the Latin, Greek, Hebrew, and Aramaic texts in the IIP project. Please select a language above to view its corresponding wordlist.
</p>
