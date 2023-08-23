<script>
	import '../app.css';
</script>

<div class="min-h-full">
	<div class="top-0 z-50 flex h-24 min-w-full shrink-0 items-center bg-primary">
		<div class="flex h-24 shrink-0 items-center p-4">
			<img
				class="h-16 w-auto"
				src="/img/iip_logo.jpg"
				alt="Inscriptions from Israel and Palestine"
			/>
		</div>
		<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
			<span class="sr-only">Open sidebar</span>
			<svg
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>

		<!-- Separator -->
		<div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

		<div class="absolute right-0 flex space-x-10 pr-4 text-white">
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/about">About</a
			>
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/about">Stories</a
			>
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/about">Resources</a
			>
			<a
				class="cursor-pointer hover:text-base-300 hover:underline"
				href="//inscriptionsisraelpalestine.org/about">Contact</a
			>
		</div>
	</div>

	<slot />
</div>
