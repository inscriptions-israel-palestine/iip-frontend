<script lang="ts">
	import type { WordListWord } from '$lib/types/word_list_name.type';

	export let word: WordListWord;
	export let language: string;
	export let id: string;
	export let treeData
	
	let treeDataStr = JSON.stringify(treeData)
	let doubletreeContainer: HTMLElement;

	$: isExpanded = false;
	$: isTreeShown = false;

	let lemmaPOS = `${word.lemma.toLowerCase()}/${word.pos}`;

	function toggleIsExpanded(_e: Event) {
		isExpanded = !isExpanded;
	}
	
    function toggleIsTreeShown(obj, counter) {
        if (language == 'latin') {
		    isTreeShown = !isTreeShown;
		    /*let dbtreerow = doubletreeContainer;*/
		    
		    const dbtreerow = document.getElementById(`doubletree${counter}`);
		    
		    if (isTreeShown) {
	            if(obj.indexOf(" | ") > -1) {
		            obj = obj.replace(" | ", "|")
	            }
	                drawDT(treeDataStr, obj, counter);
		        } 
		    else {
		        const svg = dbtreerow.querySelector('svg');
		        if (svg) {
		            doubletreeContainer.removeChild(svg as Node);
		            }
		        }
		    }
		}
		
		function expandGender(word) {
		    if (word.gender === 'm') {
		        return '♂';
		    } else if (word.gender === 'f') {
		        return '♀';
		    }
		    return '?'; // Default case
		}
		

		/*if (isTreeShown) {
			const prefixes = [
				{ name: 'root' },
				{ parent: 'root', name: 'prefix1 prefix1 prefix1' },
				{ parent: 'root', name: 'prefix2 prefix2 prefix2' },
				{ parent: 'root', name: 'prefix3 prefix3 prefix3' }
			];

			const suffixes = [
				{ name: 'root' },
				{ parent: 'root', name: 'suffix1 suffix1 suffix1' },
				{ parent: 'root', name: 'suffix2 suffix2 suffix2' },
				{ parent: 'root', name: 'suffix3 suffix3 suffix3' }
			];
			drawTree(doubletreeContainer, 'root', prefixes, suffixes);
		} else {
			const svg = doubletreeContainer.querySelector('svg');

			doubletreeContainer.removeChild(svg as Node);
		}
	}*/

	function getDictionary(language: string, lemma: string) {
		switch (language) {
			case 'latin':
				return `http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=${lemma}&lang=la`;
			case 'greek':
				return `https://www.perseus.tufts.edu/hopper/morph?l=${lemma}&la=greek`;
			case 'hebrew':
				return `https://www.morfix.co.il/en/${lemma}`;
			case 'aramaic':
				return `https://cal.huc.edu/browseSKEYheaders.php?tools=on&first3=${lemma.slice(0, 3)}`;
		}
	}
	
</script>

<tr class="alpha_link"><a name="{word.key}"/><span id={word.lemma.normalize('NFD')[0]} /></tr>
<tr class={`level0 pos${word.pos}`}>
	<td colspan="2">
					<button type="button" id="button{id}" class="btn btn-primary" on:click={toggleIsExpanded}
						>{isExpanded ? '-' : '+'}</button>
					<span class="font-bold">{word.lemma}</span> ({word.count}), {expandGender(word)} | <span class="italic">type: {word.type}</span> 
					
				</td>
</tr>

{#if isExpanded}
    {#if word.cf.length !== 0}
    <tr class="level1 tog"><td colspan="2" class="formentry" style="vertical-align:top;">
					<span class="italic" style="background-color:#e5e7eb;">Cf.
					{#each word.cf as alt, index}
					   {#if index !== 0}
					   ,&nbsp;
					   {/if}{alt}
					{/each}</span>
	</td></tr>
    <tr>&nbsp;</tr>
	{/if}
	{#each Object.values(word.forms) as form}
		{#each form.kwics as kwic, index}
			{#if index == 0}
				<tr class="level1 tog">
					<td rowspan={form.count} class="formentry" style="vertical-align:top;">
						{form.form}
						<br />
						↳ {form.pos} ({form.count})
					</td>
					<td style="vertical-align:top">
						{kwic[0][0]} <b>{kwic[0][1]}</b>
						{kwic[0][2]} (<a href="/inscriptions/{kwic[1]}" style="color: grey">{kwic[1]}</a>)
					</td>
				</tr>
			{:else}
				<tr class="level1 tog">
					<td>
						{kwic[0][0]} <b>{kwic[0][1]}</b>
						{kwic[0][2]} (<a href="/inscriptions/{kwic[1]}" style="color: grey">{kwic[1]}</a>)
					</td>
				</tr>
			{/if}
		{/each}
		<tr>&nbsp;</tr>
	{/each}
{/if}

<div id="doubletreerow{id}">
    <div id="doubletree{id}" bind:this={doubletreeContainer} />
</div>

<!--svelte:head>
	<style>
		/*body {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: 0;
			overflow: hidden;
		}/*
		/* upstream */
		path.links-0 {
			fill: none;
			stroke: #d3d3d3;
		}
		/* downstream */
		path.links-1 {
			fill: none;
			stroke: #d3d3d3;
		}
		text {
			text-shadow: -1px -1px 3px white, -1px 1px 3px white, 1px -1px 3px white, 1px 1px 3px white;
			pointer-events: none;
			font-family: 'Playfair Display', serif;
		}
		circle {
			fill: #d3d3d3;
		}
	</style>
</svelte:head-->
