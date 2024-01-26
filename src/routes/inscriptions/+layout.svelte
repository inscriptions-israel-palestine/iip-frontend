<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import debounce from 'lodash.debounce';

	export let data;

	const TEXT_INPUT_FACETS = new Set(['figures', 'description_place_id', 'text_search']);
	const TOGGLES = new Set([
		'not_after_era',
		'not_before_era',
		'languages_boolean',
		'materials_boolean',
		'physical_types_boolean'
	]);
	const searchParams = $page.url.searchParams;

	$: inscriptionsCount = $page.data.total;

	// we need to shadow the searchParams reactively in order
	// to properly show changes in the faces without yet applying
	// the faceted filters to the results
	$: facetParams = new URLSearchParams(searchParams);

	$: facets = data.facets;
	$: fixedSearchPanel = $page.url.pathname.includes('/map');
	$: cities = searchParams.getAll('cities');
	$: descriptionPlaceId = searchParams.get('description_place_id');
	$: figures = searchParams.get('figures');
	$: genres = searchParams.getAll('genres');
	$: languages = searchParams.getAll('languages');
	$: languagesBoolean = searchParams.get('languages_boolean') || 'and';
	$: materials = searchParams.getAll('materials');
	$: materialsBoolean = searchParams.get('materials_boolean') || 'and';
	$: notAfter = searchParams.get('not_after');
	$: notAfterEra = searchParams.get('not_after_era') || 'bce';
	$: notBefore = searchParams.get('not_before');
	$: notBeforeEra = searchParams.get('not_before_era') || 'bce';
	$: physicalTypes = searchParams.getAll('physical_types');
	$: physicalTypesBoolean = searchParams.get('physical_types_boolean') || 'and';
	$: regions = searchParams.getAll('regions');
	$: religions = searchParams.getAll('religions');
	$: textSearch = searchParams.get('text_search');

	function _getTuples(facetName: string, ids: any[]) {
		if (typeof facets !== 'undefined') {
			return facets[facetName].filter((t: [any, number]) => ids.includes(t[0].id.toString())) || [];
		}

		return [];
	}

	function listSelectedCities() {
		const selectedTuples = _getTuples('cities', cities);

		return selectedTuples.map((t: [any, number]) => t[0].placename.trim());
	}

	function listSelectedGenres() {
		const selectedTuples = _getTuples('genres', genres);

		return selectedTuples.map((t: [any, number]) => t[0].description || t[0].xml_id);
	}

	function listSelectedLanguages() {
		const selectedTuples = _getTuples('languages', languages);

		return selectedTuples.map((t: [any, number]) => t[0].label || t[0].short_form);
	}

	function listSelectedMaterials() {
		const selectedTuples = _getTuples('materials', materials);

		return selectedTuples.map((t: [any, number]) => t[0].description || t[0].xml_id);
	}

	function listSelectedPhysicalTypes() {
		const selectedTuples = _getTuples('physical_types', physicalTypes);

		return selectedTuples.map((t: [any, number]) => t[0].description || t[0].xml_id);
	}

	function listSelectedReligions() {
		const selectedTuples = _getTuples('religions', religions);

		return selectedTuples.map((t: [any, number]) => t[0].description || t[0].xml_id);
	}

	let selectedCities = listSelectedCities();
	let selectedGenres = listSelectedGenres();
	let selectedLanguages = listSelectedLanguages();
	let selectedMaterials = listSelectedMaterials();
	let selectedPhysicalTypes = listSelectedPhysicalTypes();
	let selectedReligions = listSelectedReligions();

	const facetUpdateFunctions = {
		cities: () => {
			selectedCities = listSelectedCities();
		},
		genres: () => {
			selectedGenres = listSelectedGenres();
		},
		languages: () => {
			selectedLanguages = listSelectedLanguages();
		},
		materials: () => {
			selectedMaterials = listSelectedMaterials();
		},
		physical_types: () => {
			selectedPhysicalTypes = listSelectedPhysicalTypes();
		},
		religions: () => {
			selectedReligions = listSelectedReligions();
		}
	};

	async function reset(_e: Event) {
		facetParams = new URLSearchParams(searchParams.toString());
		cities = [];
		descriptionPlaceId = '';
		figures = '';
		genres = [];
		languages = [];
		languagesBoolean = 'and';
		materials = [];
		materialsBoolean = 'and';
		notAfter = null;
		notAfterEra = 'bce';
		notBefore = null;
		notBeforeEra = 'bce';
		physicalTypes = [];
		physicalTypesBoolean = 'and';
		regions = [];
		religions = [];
		textSearch = '';

		await goto($page.url.pathname);

		const response = await fetch(`/facets?${facetParams.toString()}`);
		const data = await response.json();

		facets = data.facets;
		selectedCities = [];
		selectedGenres = [];
		selectedLanguages = [];
		selectedMaterials = [];
		selectedPhysicalTypes = [];
		selectedReligions = [];
	}

	function toggleFacet(facetCategory: string, facetValue: string) {
		// hopefully eventually, URLSearchParams.delete() will support a `value` attribute.
		// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/delete
		// until then:
		const currentValues = facetParams.getAll(facetCategory);
		const newValues = currentValues.filter((v) => v.toString() != facetValue.toString());

		if (newValues.length === 0) {
			facetParams.delete(facetCategory);
		} else {
			for (let i = 0, l = newValues.length; i < l; i++) {
				facetParams.set(facetCategory, newValues[i]);
			}
		}
	}

	const updateFacets = async (e: Event) => {
		if (e?.target instanceof HTMLInputElement) {
			const facetCategory = e.target.name;
			const facetValue = e.target.value;

			if (TEXT_INPUT_FACETS.has(facetCategory) || TOGGLES.has(facetCategory)) {
				toggleFacet(facetCategory, facetValue);
			} else {
				const isChecked = e.target.checked;

				if (isChecked) {
					const isFacetApplied = facetParams.getAll(facetCategory).includes(facetValue);

					if (!isFacetApplied) {
						facetParams.append(facetCategory, facetValue);
					}
				} else {
					toggleFacet(facetCategory, facetValue);
				}
			}

			const response = await fetch(`/facets?${facetParams.toString()}`);
			const data = await response.json();

			facets = data.facets;

			try {
				// @ts-expect-error
				facetUpdateFunctions[facetCategory]();
			} catch (_error) {}

			goto(`${$page.url.pathname}?${facetParams.toString()}`, { keepFocus: true, noScroll: true });
		}
	};

	const debouncedUpdateFacets = debounce(updateFacets, 300);

	// After a client-side navigation event, we need to update
	// the shadowed searchParams in `facetParams` in order to
	// keep the facet counts in sync. Otherwise, for example,
	// the facet counts will suddenly jump to a much larger
	// count because the query passed to the server differs
	// from the query reflected by the facet selection state.
	afterNavigate(() => {
		facetParams = new URLSearchParams($page.url.searchParams);
	});
</script>

<svelte:head>
	<title>Inscriptions of Israel/Palestine</title>
</svelte:head>

<div class="flex">
	<div
		class="hidden md:flex md:flex-col md:w-80 lg:w-96 max-w-96 h-full z-40 overflow-y-auto"
		class:fixed={fixedSearchPanel}
		class:pt-24={fixedSearchPanel}
	>
		<div class="gap-y-5 bg-secondary px-6 py-4">
			<form data-sveltekit-keepfocus>
				<div class="border-gray-900/10 pb-6">
					<h2 class="font-semibold underline leading-7 hover:text-neutral-500">
						<a href="//www.inscriptionsisraelpalestine.org/guide-to-searching/"
							>Guide to Searching</a
						>
					</h2>

					<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div class="col-span-full">
							<p class="prose prose-p">
								{inscriptionsCount} inscriptions<span class:hidden={!textSearch}
									>; text="{textSearch}"</span
								><span class:hidden={!descriptionPlaceId}
									>; description search="{descriptionPlaceId}"</span
								><span class:hidden={!figures}>; figures search="{figures}"</span><span
									class:hidden={selectedCities.length === 0}
									>; cities="{selectedCities.join(', ')}"</span
								><span class:hidden={selectedGenres.length === 0}
									>; genres="{selectedGenres.join(', ')}"</span
								><span class:hidden={selectedPhysicalTypes.length === 0}
									>; physical types="{selectedPhysicalTypes.join(', ')}"</span
								><span class:hidden={selectedLanguages.length === 0}
									>; languages="{selectedLanguages.join(', ')}"</span
								><span class:hidden={selectedReligions.length === 0}
									>; religions="{selectedReligions.join(', ')}"</span
								><span class:hidden={selectedMaterials.length === 0}
									>; materials="{selectedMaterials.join(', ')}"</span
								>
							</p>
						</div>

						<div class="col-span-full">
							<label for="text_search" class="label">
								<span class="label-text">Text or translation</span>
							</label>
							<input
								type="text"
								name="text_search"
								id="text_search"
								class="input input-bordered input-primary bg-white w-full max-w-xs rounded-none"
								bind:value={textSearch}
								on:input={debouncedUpdateFacets}
							/>
						</div>

						<div class="col-span-full">
							<label for="description_place_id" class="label">
								<span class="label-text">Description/Place/ID</span>
							</label>
							<input
								type="text"
								name="description_place_id"
								id="description_place_id"
								class="input input-bordered input-primary bg-white w-full max-w-xs rounded-none"
								bind:value={descriptionPlaceId}
								on:input={debouncedUpdateFacets}
							/>
						</div>

						<div class="col-span-full">
							<label for="figures" class="label">
								<span class="label-text">Figures</span>
							</label>

							<input
								type="text"
								name="figures"
								id="figures"
								class="input input-bordered input-primary bg-white w-full max-w-xs rounded-none"
								bind:value={figures}
								on:input={debouncedUpdateFacets}
							/>
						</div>

						<div class="col-span-full grid-cols-3">
							<label for="not_before" class="label"><span class="label-text">From</span></label>
							<div class="flex">
								<input
									type="number"
									name="not_before"
									min="-2000"
									max="2023"
									step="1"
									id="not_before"
									class="input input-bordered input-primary bg-white w-24 rounded-none"
									bind:value={notBefore}
									on:input={debouncedUpdateFacets}
								/>
								<div class="form-control">
									<label class="label" for="not_before_era_0"
										><input
											type="radio"
											class="radio h-4 w-4 mr-1"
											name="not_before_era"
											value="bce"
											id="not_before_era_0"
											bind:group={notBeforeEra}
											on:change={updateFacets}
										/>
										<span class="label-text cursor-pointer">BCE</span></label
									>
								</div>
								<div>
									<label class="label" for="not_before_era_1"
										><input
											type="radio"
											class="radio h-4 w-4 mr-1"
											name="not_before_era"
											value="ce"
											id="not_before_era_1"
											bind:group={notBeforeEra}
											on:change={updateFacets}
										/>
										<span class="label-text cursor-pointer">CE</span></label
									>
								</div>
							</div>
						</div>

						<div class="col-span-full grid-cols-3">
							<label for="not_after" class="label"><span class="label-text">To</span></label>
							<div class="flex">
								<input
									type="number"
									name="not_after"
									min="-2000"
									max="2023"
									step="1"
									id="not_after"
									class="input input-bordered input-primary bg-white w-24 rounded-none"
									bind:value={notAfter}
									on:input={debouncedUpdateFacets}
								/>
								<div class="form-control">
									<label class="label" for="not_after_era_0"
										><input
											type="radio"
											class="radio h-4 w-4 mr-1"
											name="not_after_era"
											value="bce"
											id="not_after_era_0"
											bind:group={notAfterEra}
											on:change={updateFacets}
										/>
										<span class="label-text cursor-pointer">BCE</span></label
									>
								</div>
								<div>
									<label class="label" for="not_after_era_1"
										><input
											type="radio"
											class="radio h-4 w-4 mr-1"
											name="not_after_era"
											value="ce"
											id="not_after_era_1"
											bind:group={notAfterEra}
											on:change={updateFacets}
										/>
										<span class="label-text cursor-pointer">CE</span></label
									>
								</div>
							</div>
						</div>
					</div>

					<div class="divider" />

					<div class="font-small collapse collapse-arrow" class:collapse-open={cities.length > 0}>
						<input type="checkbox" />
						<div class="collapse-title font-medium">Location</div>
						<div class="collapse-content">
							<div class="border border-stone-300 p-4 rounded mb-2">
								<h2 class="mb-2 font-semibold">City</h2>
								<div class="h-48 overflow-y-auto">
									{#each facets.cities as [city, inscriptionsCount]}
										{#if city.placename.trim() !== ''}
											<div class="form-control">
												<label class="label justify-start">
													<input
														class="checkbox rounded-none h-4 w-4"
														id={`city-${city.id}`}
														type="checkbox"
														name="cities"
														value={city.id.toString()}
														bind:group={cities}
														on:change={updateFacets}
														disabled={inscriptionsCount === 0}
													/>
													<span class="label-text ml-4">{city.placename}</span>
													<span class="label-text ml-2 text-stone-400">({inscriptionsCount})</span>
													{#if city.pleiades_ref}
														<a
															class="cursor-pointer ml-4 text-stone-400 text-sm hover:underline"
															target="_blank"
															href={city.pleiades_ref}>More info</a
														>
													{/if}
												</label>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					</div>

					<div class="divider" />

					<div class="font-small collapse collapse-arrow" class:collapse-open={genres.length > 0}>
						<input type="checkbox" />
						<div class="collapse-title font-medium">Type of Inscription</div>
						<div class="collapse-content">
							<div class="border border-stone-300 p-4 rounded h-48 overflow-y-auto">
								{#each facets.genres as [genre, inscriptionsCount]}
									<div class="form-control">
										<label class="label justify-start">
											<input
												class="checkbox rounded-none h-4 w-4"
												id={`genre-${genre.id}`}
												type="checkbox"
												name="genres"
												value={genre.id.toString()}
												bind:group={genres}
												on:change={updateFacets}
												disabled={inscriptionsCount === 0}
											/>
											<span class="label-text ml-4">{genre.description || genre.xml_id}</span>
											<span class="label-text ml-2 text-stone-400">({inscriptionsCount})</span>
										</label>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="divider" />

					<div
						class="font-small collapse collapse-arrow"
						class:collapse-open={physicalTypes.length > 0}
					>
						<input type="checkbox" />
						<div class="collapse-title font-medium">Physical Type</div>
						<div class="collapse-content">
							<div class="form-control hidden">
								<label class="label" for="physical_types_boolean_0"
									><input
										type="radio"
										class="radio h-4 w-4 mr-1"
										name="physical_types_boolean"
										value="and"
										id="physical_types_boolean_0"
										bind:group={physicalTypesBoolean}
										on:change={updateFacets}
									/>
									<span class="label-text cursor-pointer">AND</span></label
								>
							</div>
							<div class="hidden">
								<label class="label" for="physical_types_boolean_1"
									><input
										type="radio"
										class="radio h-4 w-4 mr-1"
										name="physical_types_boolean"
										value="or"
										id="physical_types_boolean_1"
										bind:group={physicalTypesBoolean}
										on:change={updateFacets}
									/>
									<span class="label-text cursor-pointer">OR</span></label
								>
							</div>
							<div class="border border-stone-300 p-4 rounded h-48 overflow-y-auto">
								{#each facets.physical_types as [physicalType, inscriptionsCount]}
									<div class="form-control">
										<label class="label justify-start">
											<input
												class="checkbox rounded-none h-4 w-4"
												id={`physical_type-${physicalType.id}`}
												type="checkbox"
												name="physical_types"
												value={physicalType.id.toString()}
												bind:group={physicalTypes}
												on:change={updateFacets}
												disabled={inscriptionsCount === 0}
											/>
											<span class="label-text ml-4"
												>{physicalType.description || physicalType.xml_id}</span
											>
											<span class="label-text ml-2 text-stone-400">({inscriptionsCount})</span>
										</label>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="divider" />

					<div
						class="font-small collapse collapse-arrow"
						class:collapse-open={languages.length > 0}
					>
						<input type="checkbox" />
						<div class="collapse-title font-medium">Language</div>
						<div class="collapse-content">
							<div class="border border-stone-300 p-4 rounded max-h-48 overflow-y-auto">
								{#each facets.languages as [language, inscriptionsCount]}
									<div class="form-control">
										<label class="label justify-start">
											<input
												class="checkbox rounded-none h-4 w-4"
												id={`language-${language.id}`}
												type="checkbox"
												name="languages"
												value={language.id.toString()}
												bind:group={languages}
												on:change={updateFacets}
												disabled={inscriptionsCount === 0}
											/>
											<span class="label-text ml-4">{language.label || language.short_form}</span>
											<span class="label-text ml-2 text-stone-400">({inscriptionsCount})</span>
										</label>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="divider" />

					<div
						class="font-small collapse collapse-arrow"
						class:collapse-open={religions.length > 0}
					>
						<input type="checkbox" />
						<div class="collapse-title font-medium">Religion</div>
						<div class="collapse-content">
							<div class="border border-stone-300 p-4 rounded max-h-48 overflow-y-auto">
								{#each facets.religions as [religion, inscriptionsCount]}
									<div class="form-control">
										<label class="label justify-start">
											<input
												class="checkbox rounded-none h-4 w-4"
												id={`religion-${religion.id}`}
												type="checkbox"
												name="religions"
												value={religion.id.toString()}
												bind:group={religions}
												on:change={updateFacets}
												disabled={inscriptionsCount === 0}
											/>
											<span class="label-text ml-4">{religion.description || religion.xml_id}</span>
											<span class="label-text ml-2 text-stone-400">({inscriptionsCount})</span>
										</label>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="divider" />

					<div
						class="font-small collapse collapse-arrow"
						class:collapse-open={materials.length > 0}
					>
						<input type="checkbox" />
						<div class="collapse-title font-medium">Material</div>
						<div class="collapse-content">
							<div class="border border-stone-300 p-4 rounded max-h-48 overflow-y-auto">
								{#each facets.materials as [material, inscriptionsCount]}
									<div class="form-control">
										<label class="label justify-start">
											<input
												class="checkbox rounded-none h-4 w-4"
												id={`material-${material.id}`}
												type="checkbox"
												name="materials"
												value={material.id.toString()}
												bind:group={materials}
												on:change={updateFacets}
												disabled={inscriptionsCount === 0}
											/>
											<span class="label-text ml-4">{material.description || material.xml_id}</span>
											<span class="label-text ml-2 text-stone-400">({inscriptionsCount})</span>
										</label>
									</div>
								{/each}
							</div>
						</div>
					</div>
					<div class="flex justify-between">
						<button class="btn btn-primary mt-8 rounded-none w-1/2" type="submit"
							>Apply filters</button
						>
						<button
							class="btn btn-secondary mt-8 rounded-none w-1/2"
							type="reset"
							on:click|preventDefault={reset}>Reset</button
						>
					</div>
				</div>
			</form>
		</div>
	</div>

	<div>
		<slot />
	</div>
</div>
