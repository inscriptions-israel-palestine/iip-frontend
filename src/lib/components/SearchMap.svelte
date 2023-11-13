<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';
	import type { GeoJSONSource, MapBoxZoomEvent, MapLayerMouseEvent } from 'mapbox-gl';

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

	$: loading = true;

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

	function handleClusterLayerClck(e: MapLayerMouseEvent) {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters']
		});

		const feature = features[0];
		const clusterId = feature.properties?.cluster_id;
		const pointCount = feature.properties?.point_count;

		// @ts-expect-error
		const coordinates = feature.geometry?.coordinates.slice();
		const clusterSource = map.getSource(SOURCE_NAME) as GeoJSONSource;

		clusterSource.getClusterLeaves(clusterId, pointCount, 0, (error, features) => {
			if (error) {
				console.error(error);
			}
			const inscriptions = features
				.sort((a, b) => (a.properties?.title > b.properties?.title ? 1 : -1))
				.map(
					(feature) =>
						`<li><a class="text-stone hover:text-zinc hover:underline" href="/inscriptions/${feature.properties?.filename.replace(
							'.xml',
							''
						)}">${feature.properties?.title}</a></li>`
				);

			new mapboxgl.Popup({ closeButton: false })
				.setLngLat(coordinates)
				.setHTML(
					`
						<div class="overflow-y-auto max-h-64">
							<h3 class="prose prose-stone prose-h3">Inscriptions</h3>
							<ul class="list-disc list-inside">
								${inscriptions.join('\n')}
							</ul>
						</div>
					`
				)
				.addTo(map);
		});
	}

	function handleUnclusteredClick(e: MapLayerMouseEvent) {
		// @ts-expect-error
		const feature = e.features[0];
		// @ts-expect-error
		const coordinates = feature.geometry.coordinates.slice();

		const properties = feature.properties as Inscription;

		new mapboxgl.Popup({ closeButton: false })
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
				'circle-opacity': ['step', ['get', 'point_count'], 0.85, 100, 0.9, 750, 0.95],
				'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
				'circle-stroke-color': [
					'step',
					['get', 'point_count'],
					'#1b6a8f',
					100,
					'#1b6a8f',
					750,
					'#12465e'
				],
				'circle-stroke-width': 2
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

		map.on('click', CLUSTER_LAYER, handleClusterLayerClck);

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
			loading = false;
		});

		map.on('dataloading', () => {
			loading = true;
		});

		map.on('data', () => {
			loading = false;
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
	<div class="absolute h-screen w-3/4 md:w-full right-0 bg-theme-700" bind:this={mapContainer} />
	{#if map}
		<MapOverlays {map} />
	{/if}
	<div
		class="fixed h-48 text-center top-1/2 left-1/2 z-50"
		class:hidden={!loading}
		title="0"
		id="loader"
	>
		<span class="loading loading-spinner loading-lg" />
	</div>
</div>
