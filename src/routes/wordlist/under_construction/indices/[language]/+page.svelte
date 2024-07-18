<script lang="ts">
	import WordListRow from '$lib/components/IndexRow.svelte';
	import NameRow from '$lib/components/NameRow.svelte';
	import WordListFilters from '$lib/components/NameFilters.svelte';

	export let data;

	$: languages = data.AVAILABLE_LANGUAGES;
	$: language = data.language;
	$: indices = data.indices;

    let keys = [];
    let count = 0;
    $: if (indices) {
        keys = Object.keys(indices);
    };

    import { onMount } from 'svelte';

    onMount(() => {
	    var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
              panel.style.display = "none";
            } else {
              panel.style.display = "block";
            }
          });
        }
    });

	function initialCaps(s: string) {
		return `${s[0].toUpperCase()}${s.slice(1)}`;
	}
	
	function headings(s: string) {
		switch (s) {
			case 'title':
				return 'Titles';
			case 'military':
				return 'Military Terms';
			case 'ethnicon':
				return 'Ethnicons';
			case 'relationship':
				return 'Relationship Terms';
			case 'location':
				return 'Locations';
			case 'date':
				return 'Date Terms';
			case 'occupation':
				return 'Occupations';
			case 'measure':
				return 'Measures';
			case 'object':
				return 'Objects';
			case 'religious':
				return 'Religious Terms';
			case 'other':
				return 'Other Terms';
			default:
				return s;
		}
	};
	
	function getUniqueTypes(key) {
		const indexTypes = new Set();
		indices[key].lemmas.forEach((word) => {
			const indexType = word.type;
			if (typeof indexType !== 'undefined') {
			    const types = indexType.split(',').map(type => type.trim());
			    types.forEach(type => indexTypes.add(type));
			}
		});
		return Array.from(indexTypes).sort();
	};
	
		function lexicon(s: string) {
		switch (s) {
			case 'aramaic':
				return 'Comprehensive Aramaic Lexicon';
			case 'greek':
				return 'Perseus Greek dictionary';
			case 'hebrew':
				return 'Morfix Hebrew dictionary';
			case 'latin':
				return 'Perseus Latin dictionary';
			default:
				return s;
		}
	};
	
</script>

<!--WordListFilters {words} /-->

<div style="padding-left: 80px; padding-right: 80px; padding-bottom: 80px">
<p id="lang-select">
	<span class="italic">Select language:</span>
	{#each languages as l}
		<a href="/wordlist/under_construction/indices/{l}" class="px-1" class:font-bold={l === language}
			>{initialCaps(l)}</a
		>
	{/each}
</p>
<h2
	class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl"
	style="padding-top: 20px; padding-bottom: 20px"
>
	Assorted Indices in {initialCaps(language)}
</h2>

<p>
	UNDER CONSTRUCTION
	<br /><br />
{#if language != 'aramaic'}
	The following are a set of word indices for {initialCaps(language)} across various different categories in the Inscriptions of Israel/Palestine. Each index header includes a count of how many unique word lemmas are contained in that index. Click on a header to expand the index and view the contents.
	<br/><br/>
	Each index
	presents each headword, its part of speech, and the number of times that word appears in the
	corpus. To see each of the specific morphological forms, click on the brown button next to the
	headword. You will be presented with a list of word forms, their morphological data, and counts of
	their appearances in the IIP corpus. This display will also show keyword-in-context views,
	presenting the contexts in which these words appear.
	<br /><br />
	Each word in the different indices provides links to the {lexicon(language)}, indicated with the dictionary icon
	(<img class="sample-icons" alt="dictionary icon" src="/img/dictionary.png" />). 
{:else}
    The general indices for Aramaic are not yet available.
{/if}
    <br/><br/>
	For the index of Personal Names in {initialCaps(language)}, <a href="/wordlist/under_construction/names/{language}" style="color: grey">click here</a>. For the general {initialCaps(language)} wordlist, <a href="/wordlist/{language}" style="color: grey">click here</a>.
	<br/><br/>
</p>

{#each keys as key}
    {#if indices[key].lemmas.length > 0}
        <button class="accordion"><span class="font-semibold leading-6 prose prose-h2 prose-stone prose-xl">Index of {headings(key)}</span>
        ({indices[key].lemmas.length} term{#if indices[key].lemmas.length > 1}s{/if})</button>
        <div class="panel">
            <p style="padding-left: 20px;">
                <span class="font-bold">Categories:</span>
                <br/>
            	{#each getUniqueTypes(key) as t}
	                <button style="background-color: #e3e0d8; padding: 5px; border-radius: 13px; border: 5px solid white;"> {t} </button>
	            {/each}
	        </p>
            <!--p>
	            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mollis lorem ligula, id volutpat
	            tortor condimentum id. Ut bibendum tincidunt neque. Proin eu augue ut urna viverra fringilla. Praesent
	            bibendum finibus elementum. Suspendisse augue sapien, eleifend ut est et, ultricies dignissim nisi.
	            Sed bibendum luctus ligula, quis tempor elit eleifend eget. Cras sed pretium nisi. Donec imperdiet
	            enim in vestibulum dictum. Vivamus ultrices euismod urna a convallis. Maecenas fringilla tortor non
	            tempus ultrices.<br /><br />
            </p-->

            <div class="container text-left">
	            <table id="latin-pos-table" class="table-auto" width="100%">
		            {#each indices[key].lemmas as word, index}
			            <WordListRow {word} treeData="" id={(index + 1).toString()} language={language} wordType="true" />
		            {/each}
	            </table>
            </div>
        </div>
    {/if}
{/each}

</div>
