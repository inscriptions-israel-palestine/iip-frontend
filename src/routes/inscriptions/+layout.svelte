<script lang="ts">
	import { page } from '$app/stores';

	export let data;

	const searchParams = $page.url.searchParams;

	$: facets = data.facets;
	$: cities = searchParams.getAll('cities');
	$: descriptionPlaceId = searchParams.get('description_place_id');
	$: figures = searchParams.get('figures');
	$: genres = searchParams.getAll('genres');
	$: languages = searchParams.getAll('languages');
	$: materials = searchParams.getAll('materials');
	$: notAfter = searchParams.get('not_after');
	$: notAfterEra = searchParams.get('not_after_era') || 'bce';
	$: notBefore = searchParams.get('not_before');
	$: notBeforeEra = searchParams.get('not_before_era') || 'bce';
	$: physicalTypes = searchParams.getAll('physical_types');
	$: regions = searchParams.getAll('regions');
	$: religions = searchParams.getAll('religions');
	$: textSearch = searchParams.get('text_search');

	function reset(_e: Event) {
		cities = [];
		descriptionPlaceId = '';
		figures = '';
		genres = [];
		languages = [];
		materials = [];
		notAfter = null;
		notAfterEra = 'bce';
		notBefore = null;
		notBeforeEra = 'bce';
		physicalTypes = [];
		regions = [];
		religions = [];
		textSearch = '';
	}
</script>

<div class="flex">
	<div class="flex w-96 flex-col h-full z-50">
		<div class="flex grow flex-col gap-y-5 bg-secondary px-6 py-4">
			<form class="min-w-full" data-sveltekit-keepfocus>
				<div>
					<div class="border-gray-900/10 pb-6">
						<h2 class="font-semibold underline leading-7 hover:text-neutral-500">
							<a href="//www.inscriptionsisraelpalestine.org/guide-to-searching/"
								>Guide to Searching</a
							>
						</h2>

						<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
							<div class="col-span-full">
								<label for="text_search" class="label">
									<span class="label-text">Text or translation</span>
								</label>
								<input
									type="text"
									name="text_search"
									id="text_search"
									class="input input-bordered input-primary bg-white w-full max-w-xs rounded-none"
									placeholder="λόγος καὶ ἔργα"
									bind:value={textSearch}
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
									placeholder="Egypt"
									bind:value={descriptionPlaceId}
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
									placeholder="grapevine"
									bind:value={figures}
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
										placeholder="323"
										bind:value={notBefore}
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
										placeholder="200"
										bind:value={notAfter}
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
											/>
											<span class="label-text cursor-pointer">CE</span></label
										>
									</div>
								</div>
							</div>
						</div>
						
						<div class="divider" />

						<div
							class={`font-small collapse collapse-arrow ${
								cities.length > 0 ? 'collapse-open' : ''
							}`}
						>
							<input type="checkbox" />
							<div class="collapse-title font-medium">Location</div>
							<div class="collapse-content">
								<div class="border border-stone-300 p-4 rounded mb-2">
									<h2 class="mb-2 font-semibold">City</h2>
									<div class="h-48 overflow-y-auto">
										{#each facets.cities as city}
											{#if city.placename.trim() !== ""}
												<div class="form-control">
													<label class="label justify-start">
														<input
															class="checkbox rounded-none h-4 w-4"
															id={`city-${city.id}`}
															type="checkbox"
															name="cities"
															value={city.id.toString()}
															bind:group={cities}
														/>
														<span class="label-text ml-4">{city.placename}</span>
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
						
						<div
							class={`font-small collapse collapse-arrow ${
								genres.length > 0 ? 'collapse-open' : ''
							}`}
						>
							<input type="checkbox" />
							<div class="collapse-title font-medium">Type of Inscription</div>
							<div class="collapse-content">
								<div class="border border-stone-300 p-4 rounded h-48 overflow-y-auto">
									{#each facets.genres as genre}
										<div class="form-control">
											<label class="label justify-start">
												<input
													class="checkbox rounded-none h-4 w-4"
													id={`genre-${genre.id}`}
													type="checkbox"
													name="genres"
													value={genre.id.toString()}
													bind:group={genres}
												/>
												<span class="label-text ml-4">{genre.description || genre.xml_id}</span>
											</label>
										</div>
									{/each}
								</div>
							</div>
						</div>
						
						<div class="divider" />

						<div
							class={`font-small collapse collapse-arrow ${
								physicalTypes.length > 0 ? 'collapse-open' : ''
							}`}
						>
							<input type="checkbox" />
							<div class="collapse-title font-medium">Physical Type</div>
							<div class="collapse-content">
								<div class="border border-stone-300 p-4 rounded h-48 overflow-y-auto">
									{#each facets.physical_types as physicalType}
										<div class="form-control">
											<label class="label justify-start">
												<input
													class="checkbox rounded-none h-4 w-4"
													id={`physical_type-${physicalType.id}`}
													type="checkbox"
													name="physicalTypes"
													value={physicalType.id.toString()}
													bind:group={physicalTypes}
												/>
												<span class="label-text ml-4"
													>{physicalType.description || physicalType.xml_id}</span
												>
											</label>
										</div>
									{/each}
								</div>
							</div>
						</div>
						
						<div class="divider" />

						<div
							class={`font-small collapse collapse-arrow ${
								languages.length > 0 ? 'collapse-open' : ''
							}`}
						>
							<input type="checkbox" />
							<div class="collapse-title font-medium">Language</div>
							<div class="collapse-content">
								<div class="border border-stone-300 p-4 rounded max-h-48 overflow-y-auto">
									{#each facets.languages as language}
										<div class="form-control">
											<label class="label justify-start">
												<input
													class="checkbox rounded-none h-4 w-4"
													id={`language-${language.id}`}
													type="checkbox"
													name="languages"
													value={language.id.toString()}
													bind:group={languages}
												/>
												<span class="label-text ml-4">{language.label || language.short_form}</span>
											</label>
										</div>
									{/each}
								</div>
							</div>
						</div>
						
						<div class="divider" />

						<div
							class={`font-small collapse collapse-arrow ${
								religions.length > 0 ? 'collapse-open' : ''
							}`}
						>
							<input type="checkbox" />
							<div class="collapse-title font-medium">Religion</div>
							<div class="collapse-content">
								<div class="border border-stone-300 p-4 rounded max-h-48 overflow-y-auto">
									{#each facets.religions as religion}
										<div class="form-control">
											<label class="label justify-start">
												<input
													class="checkbox rounded-none h-4 w-4"
													id={`religion-${religion.id}`}
													type="checkbox"
													name="religions"
													value={religion.id.toString()}
													bind:group={religions}
												/>
												<span class="label-text ml-4"
													>{religion.description || religion.xml_id}</span
												>
											</label>
										</div>
									{/each}
								</div>
							</div>
						</div>
						
						<div class="divider" />

						<div
							class={`font-small collapse collapse-arrow ${
								materials.length > 0 ? 'collapse-open' : ''
							}`}
						>
							<input type="checkbox" />
							<div class="collapse-title font-medium">Material</div>
							<div class="collapse-content">
								<div class="border border-stone-300 p-4 rounded max-h-48 overflow-y-auto">
									{#each facets.materials as material}
										<div class="form-control">
											<label class="label justify-start">
												<input
													class="checkbox rounded-none h-4 w-4"
													id={`material-${material.id}`}
													type="checkbox"
													name="materials"
													value={material.id.toString()}
													bind:group={materials}
												/>
												<span class="label-text ml-4"
													>{material.description || material.xml_id}</span
												>
											</label>
										</div>
									{/each}
								</div>
							</div>
						</div>
						<div class="flex justify-between">
							<button class="btn btn-primary mt-8 rounded-none w-1/2" type="submit">Search</button>
							<button
								class="btn btn-secondary mt-8 rounded-none w-1/2"
								type="reset"
								on:click|preventDefault={reset}>Reset</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>

	<slot />
</div>
