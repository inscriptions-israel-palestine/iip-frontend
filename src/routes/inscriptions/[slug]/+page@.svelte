<script lang="ts">
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import type { DisplayStatus, Edition, Language } from '$lib/types/inscription.type';

	import { createAuth0Client } from '$lib/services/authentication';

	import { beforeUpdate } from 'svelte';
	import { page } from '$app/stores';

	import '../../../app.css';
	import Maplet from '$lib/components/Maplet.svelte';
	import RenderedEdition from '$lib/components/RenderedEdition.svelte';
	import ZoteroItem from '$lib/components/ZoteroItem.svelte';

	type DimensionsData = {
		depth?: number;
		height?: number;
		type: string;
		unit?: string;
		width?: number;
	};

	export let data;

	let client: Auth0Client;
	let token: string;
	let displayStatus: DisplayStatus;

	$: inscription = data.inscription;
	$: transcription = inscription.editions?.find(
		(edition: Edition) => edition.edition_type === 'transcription'
	);
	$: translation = inscription.editions?.find(
		(edition: Edition) => edition.edition_type === 'translation'
	);
	$: diplomatic = inscription.editions?.find(
		(edition: Edition) => edition.edition_type === 'diplomatic'
	);
	$: zoteroItems = data.zoteroItems || [];

	$: diplomaticBibliography = zoteroItems.filter((item) => item.xml_id === diplomatic?.ana);
	$: transcriptionBibliography = zoteroItems.filter((item) => item.xml_id === transcription?.ana);
	$: translationBibliography = zoteroItems.filter((item) => item.xml_id === translation?.ana);
	$: miscellaneousBibliography = zoteroItems.filter((item) => {
		return (
			!diplomaticBibliography.some((i) => i.xml_id === item.xml_id) &&
			!transcriptionBibliography.some((i) => i.xml_id === item.xml_id) &&
			!translationBibliography.some((i) => i.xml_id === item.xml_id)
		);
	});

	$: dimensions = inscription.dimensions.dimensions?.find(
		(d: DimensionsData) => d.type === 'surface'
	);

	$: languagesString = inscription.languages.map((l: Language) => l.label).join(', ');

	function changeDisplayStatus(e: Event) {
		const target = e.target as HTMLSelectElement;

		displayStatus = target.value as DisplayStatus;

		fetch($page.url.toString(), {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				display_status: displayStatus
			})
		});
	}

	function getTodayString() {
		return new Date().toLocaleDateString(['en-GB', 'en-US'], {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	beforeUpdate(async () => {
		client = await createAuth0Client(`${$page.url.origin}/inscriptions`);

		try {
			token = await client.getTokenSilently();
		} catch (e) {
			// @ts-expect-error
			if (e.message !== 'Login required') {
				console.error(e);
			}
		}
	});
</script>

<svelte:head>
	<title
		>{`${inscription.filename
			.replace('.xml', '')
			.toUpperCase()} - Inscriptions of Israel/Palestine`}</title
	>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<div
		class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
	>
		<div>
			<h3 class="font-semibold prose prose-stone">Images</h3>
			<div class="mt-2">
				{#if inscription.images && inscription.images.length > 0}
					<ul role="list" class="mt-6 space-y-6">
						{#each inscription.images as image (image.id)}
							<li class="relative flex gap-x-4">
								<div
									class="relative flex h-64 w-64 flex-none items-center justify-center mt-8 bg-white"
								>
									<a
										href={image.graphic_url}
										class="block w-full cursor-zoom-in opacity-100 hover:opacity-80 transition-opacity"
										title={image.description || 'An image of the inscription.'}
									>
										<img
											class="object-contain h-72"
											src={image.graphic_url}
											alt={image.description}
											title="Click to view"
										/>
										<p class="caption-bottom prose prose-p prose-stone">
											{image.description || ''}
										</p>
									</a>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<img
						class="w-full object-contain"
						style="max-height:66vh"
						src="/img/iip_placeholder.png"
						alt="No images available"
						title="Click to view"
					/>
				{/if}
			</div>
		</div>
		{#if inscription.location_coordinates}
			<div>
				<h2 class="sr-only">Location</h2>
				<div
					class="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 min-h-64 min-w-64 h-64 min-w-64 w-full"
				>
					<Maplet {inscription} />
				</div>
			</div>
		{/if}

		<div
			class="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16"
		>
			<h2 class="font-semibold leading-6 prose prose-h2 prose-stone prose-2xl">
				{inscription.filename.replace('.xml', '').toUpperCase()}
			</h2>
			{#if inscription.title}
				<h3 class="font-semibold leading-6 prose prose-h3 prose-stone prose-xl">
					{inscription.title}
				</h3>
			{/if}
			{#if token}
				<form
					action={`/inscriptions/${inscription.filename.replace('.xml', '')}`}
					method="patch"
					class="mt-4"
				>
					<select
						class="select select-bordered"
						bind:value={inscription.display_status}
						on:change={changeDisplayStatus}
					>
						<option value="to approve">To approve</option>
						<option value="to correct">To correct</option>
						<option value="approved">Approved</option>
					</select>
				</form>
			{/if}
			<table class="mt-16 w-full whitespace-nowrap text-left prose prose-sm leading-6">
				<colgroup>
					<col class="w-full" />
				</colgroup>
				<thead class="border-b border-gray-200 prose prose-stone">
					<tr>
						<th scope="col" class="px-0 py-3 font-semibold" />
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-gray-100">
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone whitespace-normal">
							<div class="font-medium prose prose-stone">Transcription</div>
							<p id="transcription" class="prose prose-p prose-stone font-normal transcription">
								{#if transcription?.text}
									<RenderedEdition edition={transcription} />
								{:else}
									[no transcription]
								{/if}
							</p>
						</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone whitespace-normal">
							<div class="font-medium prose prose-stone">Translation</div>
							<p id="translation" class="prose prose-p prose-stone font-normal translation">
								{#if translation?.text}
									<RenderedEdition edition={translation} />
								{:else}
									[no translation]
								{/if}
							</p>
						</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone">
							<div class="font-medium prose prose-stone">Diplomatic</div>
							<p id="diplomatic" class="prose prose-p prose-stone font-normal diplomatic">
								{#if diplomatic?.text}
									<RenderedEdition edition={diplomatic} />
								{:else}
									[no diplomatic]
								{/if}
							</p>
						</td>
					</tr>
				</tbody>
			</table>
			<dl class="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
				<div class="sm:pr-4">
					<dt class="inline prose prose-stone">Terminus post quem:</dt>
					<dd class="inline prose prose-stone">
						<time datetime={inscription.not_before}
							>{Math.abs(inscription.not_before)} {inscription.not_before < 0 ? 'BCE' : 'CE'}</time
						>
					</dd>
				</div>
				<div class="mt-2 sm:mt-0 sm:pl-4">
					<dt class="inline prose prose-stone">Terminus ante quem:</dt>
					<dd class="inline prose prose-stone">
						<time datetime={inscription.not_after}
							>{Math.abs(inscription.not_after)} {inscription.not_after < 0 ? 'BCE' : 'CE'}</time
						>
					</dd>
				</div>
			</dl>
			{#if inscription.description}
				<div class="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
					<dt class="font-semibold prose prose-stone">Notes</dt>
					<dd class="mt-2 prose prose-stone">{inscription.description}</dd>
				</div>
			{/if}
		</div>
	</div>
	<div class="bg-stone-200 rounded my-4 px-8 flex justify-between">
		<div class="py-3">
			<h2 class="font-semibold prose prose-stone prose-h2 mb-3">Languages</h2>
			<p class="prose prose-stone">
				{languagesString}
			</p>
		</div>
		<div class="py-3">
			<h2 class="font-semibold prose prose-stone prose-h2 mb-3">Dimensions</h2>
			<p class="prose prose-stone">
				<span
					>H:
					{#if dimensions.height}
						{dimensions.height} {dimensions.unit};
					{:else}
						&mdash;;
					{/if}
				</span>
				<span
					>W:
					{#if dimensions.width}
						{dimensions.width} {dimensions.unit};
					{:else}
						&mdash;;
					{/if}
				</span>
				<span
					>D:
					{#if dimensions.depth}
						{dimensions.depth} {dimensions.unit}
					{:else}
						&mdash;
					{/if}
				</span>
			</p>
		</div>
		<div class="py-3">
			<h2 class="font-semibold prose prose-stone prose-h2 mb-3">Date</h2>
			<p class="prose prose-stone">
				{Math.abs(inscription.not_before)}
				{inscription.not_before < 0 ? 'BCE' : 'CE'} to {Math.abs(inscription.not_after)}
				{inscription.not_after < 0 ? 'BCE' : 'CE'}
			</p>
		</div>
	</div>
	<div class="py-3">
		<h2 class="font-semibold prose prose-stone prose-h2 mb-3">Current location</h2>
		{#if inscription.provenance?.placename}
			<p class="flex-auto py-0.5 text-xs leading-5 prose prose-stone prose-p">
				{inscription.provenance.placename}
			</p>
		{:else}
			<p class="flex-auto py-0.5 text-xs leading-5 prose prose-stone prose-p">
				No provenance provided.
			</p>
		{/if}
	</div>
	<div class="py-3">
		<h2 class="font-semibold prose prose-stone prose-h2 mb-3">Figures</h2>
		{#if inscription.figures.length > 0}
			<ul role="list" class="space-y-6">
				{#each inscription.figures as figure}
					<li class="relative flex gap-x-4">
						<p class="flex-auto py-0.5 text-xs leading-5 prose prose-stone prose-p">
							<span class="font-medium prose prose-stone"
								>{figure.name} {figure.locus.toLowerCase()}</span
							>
						</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="flex-auto py-0.5 text-xs leading-5 prose prose-stone prose-p">
				No figures described.
			</p>
		{/if}
	</div>
	<section class="py-3">
		<h1 class="text-sm font-bold uppercase">Bibliography</h1>
		<div class="py-3">
			<h2 class="font-semibold prose prose-stone prose-h2 mb-3 text-sm uppercase">
				Source of diplomatic
			</h2>
			{#if diplomaticBibliography.length > 0}
				<ul role="list">
					{#each diplomaticBibliography as item}
						<li class="relative flex gap-x-4 pb-4">
							<ZoteroItem {item} />
						</li>
					{/each}
				</ul>
			{:else}
				<p class="flex-auto text-xs prose prose-stone prose-p">
					No bibliography available for diplomatic transcription.
				</p>
			{/if}
		</div>
		<div class="py-3">
			<h2 class="font-semibold prose prose-stone prose-h2 mb-3 text-sm uppercase">
				Source of transcription
			</h2>
			{#if transcriptionBibliography.length > 0}
				<ul role="list">
					{#each transcriptionBibliography as item}
						<li class="relative flex gap-x-4 pb-4">
							<ZoteroItem {item} />
						</li>
					{/each}
				</ul>
			{:else}
				<p class="flex-auto text-xs prose prose-stone prose-p">
					No bibliography available for transcription.
				</p>
			{/if}
		</div>
		<div class="py-3">
			<h2 class="font-semibold prose prose-stone prose-h2 mb-3 text-sm uppercase">
				Source of translation
			</h2>
			{#if translationBibliography.length > 0}
				<ul role="list">
					{#each translationBibliography as item}
						<li class="relative flex gap-x-4 pb-4">
							<ZoteroItem {item} />
						</li>
					{/each}
				</ul>
			{:else}
				<p class="flex-auto text-xs prose prose-stone prose-p">
					No bibliography available for translation.
				</p>
			{/if}
		</div>

		{#if miscellaneousBibliography.length > 0}
			<div class="py-3">
				<h2 class="font-semibold prose prose-stone prose-h2 mb-3 text-sm uppercase">
					Other sources
				</h2>
				<ul role="list">
					{#each miscellaneousBibliography as item}
						<li class="relative flex gap-x-4 pb-4">
							<ZoteroItem {item} />
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<a
			href={`https://raw.githubusercontent.com/inscriptions-israel-palestine/iip-backend/main/epidoc-files/${inscription.filename}`}
			class="hover:underline text-sm uppercase">View XML</a
		>
	</section>
	<div class="py-3 space-y-3">
		<h2 class="font-semibold leading-6 prose prose-stone prose-h2 mb-3">Cite This Inscription</h2>

		<p class="text-stone-500">
			IIP is committed to the idea that the public good is best served by keeping our data free for
			use and reuse. You can cite and use this inscription under the terms of the Creative Commons
			Attribution-NonCommercial 4.0 International License. Note also that all images are either in
			the public domain or used with permission, and unless noted we do not hold copyright to them.
			For permission to reuse the images, please contact the copyright holder, noted in the
			illustration credit.
		</p>

		<p class="prose prose-p prose-stone">The project can be cited as:</p>

		<cite class="prose prose-p prose-stone">
			Satlow, Michael L., ed. 2002 - . “Inscriptions of Israel/Palestine.” Brown University. <a
				href="https://doi.org/10.26300/PZ1D-ST89">https://doi.org/10.26300/PZ1D-ST89</a
			>
		</cite>

		<p class="prose prose-p prose-stone">This inscription can be cited as:</p>

		<cite class="prose prose-p prose-stone">
			"Inscriptions of Israel/Palestine," {inscription.filename.replace('.xml', '').toUpperCase()}, {getTodayString()}.
			https:doi.org/10.26300/pz1d-st89
		</cite>
	</div>
</div>
