<script>
	import '../app.css';

	import { page } from '$app/stores';

	$: fixedHeader = $page.url.pathname.includes("/map")
</script>

<div class="min-h-full">
	<div class="top-0 z-50 flex h-24 min-w-full shrink-0 items-center bg-primary" class:fixed={fixedHeader}>
		<div class="flex h-24 shrink-0 items-center p-4">
			<a href="/">
				<img
					class="h-16 w-auto"
					src="/img/iip_logo.jpg"
					alt="Inscriptions from Israel and Palestine"
				/>
			</a>
		</div>

		<!-- Separator -->
		<div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

		<div class="absolute right-0 flex space-x-10 pr-4 text-white">
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/about">About</a
			>
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/story">Stories</a
			>
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/resources-2">Resources</a
			>
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/contact">Contact</a
			>
		</div>
	</div>

	<slot />
</div>
