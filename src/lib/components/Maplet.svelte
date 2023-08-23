<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';
	import type { LngLatLike } from 'mapbox-gl';

	import { env } from '$env/dynamic/public';
	import mapboxgl from 'mapbox-gl';
	import { onDestroy, onMount } from 'svelte';

	const ATTRIBUTION =
		'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>';

	mapboxgl.accessToken = env.PUBLIC_MAPBOX_ACCESS_TOKEN;

	export let inscription: Inscription;

	let map: mapboxgl.Map;
	let mapContainer: HTMLElement;

	function initializeMap() {
		const map = new mapboxgl.Map({
			customAttribution: ATTRIBUTION,
			logoPosition: 'bottom-left',
			container: mapContainer,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: inscription.location_coordinates as LngLatLike,
			zoom: 5
		});

		return map;
	}

	function addMarker(map: mapboxgl.Map, inscription: Inscription) {
		const marker = new mapboxgl.Marker().setLngLat(inscription.location_coordinates as LngLatLike);

		marker.addTo(map);
	}

	onMount(async () => {
		if (inscription.location_coordinates) {
			map = initializeMap();

			map.on('load', () => {
				addMarker(map, inscription);
			});
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="h-full w-full" bind:this={mapContainer} />
