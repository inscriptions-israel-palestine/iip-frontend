<script>
	import '../app.css';

	import { page } from '$app/stores';

	const IIP_ROOT_URL = 'https://www.inscriptionsisraelpalestine.org';

	$: fixedHeader = $page.url.pathname.includes('/map');
</script>

<div class="min-h-full">
	<div
		class="top-0 z-50 flex h-24 min-w-full shrink-0 items-center bg-primary"
		class:fixed={fixedHeader}
	>
		<div class="flex h-24 shrink-0 items-center p-4">
			<a href={IIP_ROOT_URL}>
				<img
					class="h-16 w-auto"
					src="/img/iip_logo.png"
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

	<footer class="bg-theme-200 flex flex-wrap md:flex-nowrap p-8" aria-labelledby="footer-heading">
		<div class=" w-full md:w-1/2">
			<div class="flex justify-start my-2 text-left text-base">
				<p class="text-gray-500 text-base">
					Version 3.0 | December 2023 |
					<a
						class="underline hover:no-underline font-thin"
						href="https://doi.org/10.26300/pz1d-st89">10.26300/pz1d-st89</a
					>
					|
					<a
						class="underline hover:no-underline font-thin"
						href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a
					>
				</p>
			</div>
			<div class="flex justify-start my-2 text-left text-base">
				<p class="text-gray-500 text-base">
					© <a
						class="underline hover:no-underline font-thin"
						href="https://inscriptionsisraelpalestine.org"
					>
						Inscriptions from Israel / Palestine,
					</a>
					{new Date().getFullYear()}. All rights reserved.
				</p>
			</div>

			<div class="flex justify-start my-2 text-left text-base">
				<p class="text-gray-500 text-base">
					We welcome your
					<a class="underline hover:no-underline font-thin" href="mailto:iip@brown.edu">feedback</a>
					on this web site
				</p>
			</div>

			<div class="flex justify-start my-2 text-left text-base">
				<a
					class="underline hover:no-underline mr-2 text-gray-500 font-thin"
					href="https://github.com/Brown-University-Library/iip-texts">Data</a
				>
				<a
					class="underline hover:no-underline mr-2 text-gray-500 font-thin"
					href="https://github.com/Brown-University-Library/iip-production">Code</a
				>
			</div>

			<div class="flex flex-wrap justify-start mt-2 footerLegal text-base">
				<a
					class="underline hover:no-underline mr-2 text-gray-500 font-thin"
					href="https://inscriptionsisraelpalestine.org/sitemap">Sitemap</a
				>
				<a
					class="underline hover:no-underline mr-2 text-gray-500 font-thin"
					href="https://inscriptionsisraelpalestine.org/copyright">Copyright and Citation Guide</a
				>
				<a
					class="underline hover:no-underline mr-2 text-gray-500 font-thin"
					href="https://inscriptionsisraelpalestine.org/guide-to-searching">Guide to Searching</a
				>
			</div>
		</div>
		<div class="w-full pt-8 md:pt-0">
			<div class="flex justify-start md:justify-end items-center">
				<a href="https://library.brown.edu/create/cds/" class="pb-4">
					<span class="text-lg font-thin serif w-40 ml-0 md:ml-4 whitespace-nowrap"
						>Center for Digital Scholarship</span
					>
				</a>
				<a href="https://www.brown.edu/">
					<img class="logo w-20 mb-4 ml-6" src="/img/brown_logo.png" alt="Brown University Logo" />
				</a>
				<a href="https://inscriptionsisraelpalestine.org/">
					<img class="logo w-20 md:w-32 mb-4 ml-4" src="/img/iip_logo.png" alt="IIP Logo" />
				</a>
			</div>
		</div>
	</footer>
</div>
