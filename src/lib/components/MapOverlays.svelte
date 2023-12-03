<script lang="ts">
	import type { Map } from 'mapbox-gl';

	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';

	export let map: Map;
	let highlightedFeatureId: number | null = null;
	let popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false
	});

	const OVERLAYS: { [k: string]: any } = {
		king_herod: {
			isChecked: false,
			layerType: 'fill',
			name: 'King Herod Boundaries 37BCE',
			paint: {
				'fill-color': 'brown',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.4]
			},
			popupTitle: (featureName: string) =>
				`<h1 class="font-bold text-sm prose prose-stone">King Herod Boundary</h1>
				<p class="text-sm prose prose-stone">${featureName}</p>`,
			url: '/geojson/king_herod_boundaries_37BCE.geojson.gz'
		},
		roman_provinces: {
			isChecked: false,
			layerType: 'fill',
			name: 'Roman Empire Provinces 200CE',
			paint: {
				'fill-color': 'olive',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.4]
			},
			popupTitle: (featureName: string) =>
				`<h1 class="font-bold text-sm prose prose-stone">Roman Province</h1>
				<p class="text-sm prose prose-stone">${featureName}</p>`,
			url: '/geojson/roman_provinces.geojson.gz'
		},
		roman_roads: {
			name: 'Roman Roads',
			isChecked: false,
			layerType: 'line',
			paint: {
				'line-color': 'maroon',
				'line-dasharray': [
					'case',
					['==', '1', ['get', 'Known_or_a']],
					['literal', [1, 0]],
					['literal', [1, 1]]
				],
				'line-opacity': 0.5,
				'line-width': ['case', ['==', '0', ['get', 'Major_or_M']], 2, 3]
			},
			url: '/geojson/roman_roads.geojson.gz'
		},
		byzantine_provinces: {
			isChecked: false,
			layerType: 'fill',
			name: 'Byzantine Provinces 400CE',
			paint: {
				'fill-color': 'gray',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.4]
			},
			popupTitle: (featureName: string) =>
				`<h1 class="font-bold text-sm prose prose-stone">Byzantine Province</h1>
				<p class="text-sm prose prose-stone">${featureName}</p>`,
			url: '/geojson/byzantine_provinces_400CE.geojson.gz'
		},
		iip_regions: {
			isChecked: false,
			layerType: 'fill',
			name: 'IIP Regions',
			paint: {
				'fill-color': 'navy',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.4]
			},
			popupTitle: (featureName: string) =>
				`<h1 class="font-bold text-sm prose prose-stone">IIP Region</h1>
				<p class="text-sm prose prose-stone">${featureName}</p>`,
			url: '/geojson/IIP_regions.geojson.gz'
		}
	};
	const OVERLAY_IDS = Object.keys(OVERLAYS);

	onMount(() => {
		map.on('load', () => {
			OVERLAY_IDS.forEach((key) => {
				const overlay = OVERLAYS[key];
				map.addSource(key, {
					type: 'geojson',
					data: overlay.url
				});
			});
		});
	});

	function toggleOverlay(e: Event) {
		const target = e.target as HTMLInputElement;
		const key = target.id;
		const overlay = OVERLAYS[key];

		if (overlay.isChecked) {
			map.addLayer({
				id: key,
				source: key,
				type: overlay.layerType,
				paint: overlay.paint
			});

			map.on('mousemove', key, (e) => {
				const features = e.features || ([] as Array<any>);

				if (features.length > 0) {
					const feature = features[0];
					const id = feature.id;

					if (highlightedFeatureId !== null) {
						map.setFeatureState({ source: key, id: highlightedFeatureId }, { hover: false });
					}
					highlightedFeatureId = id;

					map.setFeatureState({ source: key, id }, { hover: true });

					if (typeof overlay.popupTitle === 'function') {
						const description = overlay.popupTitle(
							feature.properties.province || feature.properties.Name
						);

						popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
					}
				}
			});

			map.on('mouseleave', key, (_e) => {
				if (highlightedFeatureId !== null) {
					map.setFeatureState({ source: key, id: highlightedFeatureId }, { hover: false });

					popup.remove();
				}
			});
		} else {
			map.removeLayer(key);
		}
	}
</script>

<div class="fixed right-6 bottom-10 bg-opacity-60 opacity-95 bg-stone-700 p-4 rounded-md">
	<form>
		{#each OVERLAY_IDS as key}
			<div class="form-control">
				<label class="label justify-start">
					<input
						class="checkbox rounded-none h-4 w-4 text-white bg-white"
						id={key}
						type="checkbox"
						name={key}
						bind:checked={OVERLAYS[key].isChecked}
						on:change|stopPropagation={toggleOverlay}
					/>
					<span class="label-text text-white ml-4">{OVERLAYS[key].name}</span>
				</label>
			</div>
		{/each}
	</form>
</div>
