<script lang="ts">
	import type { Inscription } from '$lib/types/inscription.type';

	export let inscription: Inscription;

	function getFirstImageUrl(inscription: Inscription) {
		if (inscription.images && inscription.images.length > 0) {
			return inscription.images[0].graphic_url;
		} else {
			return '/img/iip_placeholder.png';
		}
	}

	function getAltText(inscription: Inscription) {
		if (inscription.images && inscription.images.length > 0) {
			return `Image of inscription ${inscription.filename.replace('.xml', '').toUpperCase()}`;
		} else {
			return 'Image not yet available.'
		}
	}
</script>

<a href={`/inscriptions/${inscription.filename.replace('.xml', '')}`}>
	<img
		class="h-24 w-24 sm:h-48 sm:w-48"
		src={getFirstImageUrl(inscription)}
		alt={getAltText(inscription)}
	/>
</a>
