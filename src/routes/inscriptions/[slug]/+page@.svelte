<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// @ts-expect-error
	import CETEI from 'CETEIcean';
	import '../../../app.css';
	import Maplet from '$lib/components/Maplet.svelte';

	export let data;

	$: inscription = data.inscription;

	const teiTransformer = new CETEI();
	const EDITION_TYPES = ['diplomatic', 'transcription', 'transcription_segmented', 'translation'];

	async function getEdition(inscription: Inscription, editionType: string) {
		const edition = inscription.editions?.find((edition) => edition.edition_type === editionType);

		// it might be better just to change how this
		// editionType is stored in the database, but then
		// it would be inconsistent with how it's phrased
		// in the Epidoc XML.
		if (editionType === 'transcription_segmented') {
			editionType = 'segmented_transcription';
		}

		if (!edition?.text) {
			return `[no ${editionType.replace('_', ' ')}]`;
		}

		if (browser) {
			return transformTei(edition.raw_xml);
		} else {
			return edition.text;
		}
	}

	function transformTei(raw: string | undefined | null) {
		if (!raw) {
			return false;
		}

		return new Promise((resolve, _reject) =>
			teiTransformer.makeHTML5(raw, (data: any) => resolve(data))
		);
	}

	onMount(async () => {
		for (let editionType of EDITION_TYPES) {
			const el = document.getElementById(editionType);

			if (el) {
				const edition = await getEdition(inscription, editionType);
				// @ts-expect-error
				el.replaceChildren(edition);
			}
		}
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<div
		class="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
	>
		<!-- Maplet -->
		{#if inscription.location_coordinates}
			<div class="lg:col-start-3 lg:row-end-1">
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
			<dl class="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
				<div class="sm:pr-4">
					<dt class="inline prose prose-stone">Terminus post quem</dt>
					<dd class="inline prose prose-stone">
						<time datetime={inscription.not_before}
							>{Math.abs(inscription.not_before)} {inscription.not_before < 0 ? 'BCE' : 'CE'}</time
						>
					</dd>
				</div>
				<div class="mt-2 sm:mt-0 sm:pl-4">
					<dt class="inline prose prose-stone">Terminus ante quem</dt>
					<dd class="inline prose prose-stone">
						<time datetime={inscription.not_after}
							>{Math.abs(inscription.not_after)} {inscription.not_after < 0 ? 'BCE' : 'CE'}</time
						>
					</dd>
				</div>
				<div class="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
					<dt class="font-semibold prose prose-stone">Summary</dt>
					<dd class="mt-2 prose prose-stone">{inscription.description || ''}</dd>
				</div>

				<div class="mt-6 border-t pt-6 sm:pr-4 w-full">
					<dt class="font-semibold prose prose-stone">Images</dt>
					<dd class="mt-2">
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
													class="w-full object-contain"
													style="max-height:30vh"
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
					</dd>
				</div>
			</dl>

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
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone">
							<div class="font-medium prose prose-stone">Diplomatic</div>
							<p id="diplomatic" class="prose prose-p prose-stone font-normal whitespace-pre-line">
								Processing diplomatic &hellip;
							</p>
						</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone">
							<div class="font-medium prose prose-stone">Transcription</div>
							<p
								id="transcription"
								class="prose prose-p prose-stone whitespace-pre-line font-normal"
							>
								Processing transcription &hellip;
							</p>
						</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone">
							<div class="font-medium prose prose-stone">Segmented transcription</div>
							<p
								id="transcription_segmented"
								class="prose prose-p prose-stone font-normal whitespace-pre-line"
							>
								Processing segmented transcription &hellip;
							</p>
						</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="max-w-0 px-0 py-5 align-top font-medium prose prose-stone">
							<div class="font-medium prose prose-stone">Translation</div>
							<p id="translation" class="prose prose-p prose-stone font-normal whitespace-pre-line">
								Processing translation &hellip;
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="lg:col-start-3">
			<div class="py-3">
				<h2 class="font-semibold leading-6 prose prose-stone prose-h2 mb-3">Current location</h2>
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
				<h2 class="font-semibold leading-6 prose prose-stone prose-h2 mb-3">Figures</h2>
				{#if inscription.figures.length > 0}
					<ul role="list" class="mt-6 space-y-6">
						{#each inscription.figures as figure}
							<li class="relative flex gap-x-4">
								<p class="flex-auto py-0.5 text-xs leading-5 prose prose-stone prose-p">
									<span class="font-medium prose prose-stone">{figure.name}</span>
									{figure.locus}
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
			<div class="py-3">
				<h2 class="font-semibold leading-6 prose prose-stone prose-h2 mb-3">Bibliography</h2>
				{#if inscription.bibliographic_entries.length > 0}
					<ul role="list">
						{#each inscription.bibliographic_entries as bib}
							<li class="relative flex gap-x-4">
								<p class="flex-auto text-xs prose prose-stone prose-p">
									<span class="font-medium prose prose-stone">{bib.ptr_target}</span>
									{bib.bibl_scope_unit}
									{bib.bibl_scope}
								</p>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="flex-auto text-xs prose prose-stone prose-p">No bibliography available.</p>
				{/if}
			</div>

			<div class="py-3 space-y-3">
				<h2 class="font-semibold leading-6 prose prose-stone prose-h2 mb-3">
					Cite This Inscription
				</h2>

				<p class="prose prose-p prose-stone">
					IIP is committed to the idea that the public good is best served by keeping our data free
					for use and reuse. You can cite and use this inscription under the terms of the Creative
					Commons Attribution-NonCommercial 4.0 International License. Note also that all images are
					either in the public domain or used with permission, and unless noted we do not hold
					copyright to them. For permission to reuse the images, please contact the copyright
					holder, noted in the illustration credit.
				</p>

				<p class="prose prose-p prose-stone">The project can be cited as:</p>

				<cite class="prose prose-p prose-stone">
					Satlow, Michael L., ed. 2002 - . “Inscriptions of Israel/Palestine.” Brown University. <a
						href="https://doi.org/10.26300/PZ1D-ST89">https://doi.org/10.26300/PZ1D-ST89</a
					>
				</cite>

				<p class="prose prose-p prose-stone">This inscription can be cited as:</p>

				<cite class="prose prose-p prose-stone">
					"Inscriptions of Israel/Palestine," [inscription id],[today's date].
					https:doi.org/10.26300/pz1d-st89
				</cite>
			</div>
		</div>
	</div>
</div>
