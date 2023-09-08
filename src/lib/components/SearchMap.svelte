<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';
	import type { MapLayerMouseEvent } from 'mapbox-gl';

	import { env } from '$env/dynamic/public';
	import mapboxgl from 'mapbox-gl';
	import { onDestroy, onMount } from 'svelte';
	import MapOverlays from './MapOverlays.svelte';

	const ATTRIBUTION =
		'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>';
	const MAX_ZOOM = 11;

	mapboxgl.accessToken = env.PUBLIC_MAPBOX_ACCESS_TOKEN;

	export let inscriptions: Inscription[] = [];

	let lng: number = 35.3;
	let lat: number = 31.3;
	let map: mapboxgl.Map;
	let mapContainer: HTMLElement;

	function initializeMap() {
		const map = new mapboxgl.Map({
			customAttribution: ATTRIBUTION,
			logoPosition: 'bottom-right',
			container: mapContainer,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [lng, lat],
			maxZoom: MAX_ZOOM,
			zoom: 5
		});

		return map;
	}

	function handleUnclusteredClick(e: MapLayerMouseEvent) {
		// @ts-expect-error
		const feature = e.features[0];
		// @ts-expect-error
		const coordinates = feature.geometry.coordinates.slice();

		const properties = feature.properties as Inscription;

		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(
				`
					<div class="prose prose-stone prose-sm max-h-64">
						<h3 class="prose prose-stone prose-h3">${properties.title}</h3>
						<div class="max-h-24 overflow-y-auto">
							<p class="text-stone text-sm">
								${properties.description || ''}
							</p>
						</div>
						<p class="text-stone text-sm">
							<a href="/inscriptions/${properties.filename.replace('.xml', '')}">View</a>
						</p>
					</div>
					`
			)
			.addTo(map);
	}

	const SOURCE_NAME = 'inscriptions';

	function addSource(map: mapboxgl.Map, inscriptions: Inscription[]) {
		map.addSource(SOURCE_NAME, {
			type: 'geojson',
			cluster: true,
			clusterMaxZoom: 11,
			clusterRadius: 50,
			// @ts-expect-error
			data: formatData(inscriptions)
		});
	}

	const CLUSTER_LAYER = 'clusters';
	const CLUSTER_COUNT_LAYER = 'cluster-count';
	const UNCLUSTERED_LAYER = 'unclustered-points';

	function addClusterLayers(map: mapboxgl.Map) {
		map.addLayer({
			id: CLUSTER_LAYER,
			type: 'circle',
			source: SOURCE_NAME,
			filter: ['has', 'point_count'],
			paint: {
				// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
				// with three steps to implement three types of circles:
				//   * #76c1e5, 20px circles when point count is less than 100
				//   * #45abdb, 30px circles when point count is between 100 and 750
				//   * #1b6a8f, 40px circles when point count is greater than or equal to 750
				'circle-color': ['step', ['get', 'point_count'], '#76c1e5', 100, '#45abdb', 750, '#1b6a8f'],
				'circle-opacity': ['step', ['get', 'point_count'], 0.85, 100, 0.90, 750, 0.95],
				'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
				'circle-stroke-color': ['step', ['get', 'point_count'], '#1b6a8f', 100, '#1b6a8f', 750, '#12465e'],
				'circle-stroke-width': 2,

			}
		});

		map.addLayer({
			id: CLUSTER_COUNT_LAYER,
			type: 'symbol',
			source: SOURCE_NAME,
			filter: ['has', 'point_count'],
			layout: {
				'text-field': ['get', 'point_count_abbreviated'],
				'text-font': ['Arial Unicode MS Bold'],
				'text-size': 12
			}
		});

		map.addLayer({
			id: UNCLUSTERED_LAYER,
			type: 'circle',
			source: SOURCE_NAME,
			filter: ['!', ['has', 'point_count']],
			paint: {
				'circle-color': '#289bd1',
				'circle-radius': 8,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#a8d8ee'
			}
		});

		// When a click event occurs on a feature in
		// the unclustered-point layer, open a popup at
		// the location of the feature, with
		// description HTML from its properties.
		map.on('click', UNCLUSTERED_LAYER, handleUnclusteredClick);

		map.on('mouseenter', CLUSTER_LAYER, () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', CLUSTER_LAYER, () => {
			map.getCanvas().style.cursor = '';
		});

		map.on('mouseenter', UNCLUSTERED_LAYER, () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', UNCLUSTERED_LAYER, () => {
			map.getCanvas().style.cursor = '';
		});
	}

	function convertToGeoJson(inscriptions: Inscription[]) {
		return inscriptions.filter(hasCoords).map((inscription) => {
			const coordinates = inscription.location_coordinates as number[];
			return {
				type: 'Feature',
				properties: inscription,
				geometry: {
					type: 'Point',
					coordinates
				}
			};
		});
	}

	function formatData(inscriptions: Inscription[]) {
		return {
			type: 'FeatureCollection',
			features: convertToGeoJson(inscriptions)
		};
	}

	function hasCoords(inscription: Inscription) {
		return Boolean(inscription.location_coordinates);
	}

	onMount(async () => {
		map = initializeMap();

		map.on('load', () => {
			addSource(map, inscriptions);
			addClusterLayers(map);
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	$: {
		if (map && map.loaded()) {
			// @ts-expect-error
			map.getSource(SOURCE_NAME).setData(formatData(inscriptions));
		}
	}
</script>

<div class="flex w-full h-full max-h-screen">
	<div class="absolute h-screen w-3/4 md:w-full right-0 bg-theme-700 text-white" bind:this={mapContainer} />
	{#if map}
		<MapOverlays map={map} />
	{/if}
	<div class="fixed h-48 text-center p-2 top-1/2 left-1/2 z-50" class:hidden={inscriptions.length > 0} title="0" id="loader">
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" width="80px" height="80px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"
            xml:space="preserve">
            <path opacity="0.2" fill="#000"
                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
            <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z">
                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20"
                    to="360 20 20" dur="0.5s" repeatCount="indefinite" />
            </path>
        </svg>
    </div>
</div>
