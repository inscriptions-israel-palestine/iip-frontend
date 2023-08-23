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
</script>

<a href={`/inscriptions/${inscription.filename.replace('.xml', '')}`}>
	<img src={getFirstImageUrl(inscription)} alt={inscription.title} />
</a>
