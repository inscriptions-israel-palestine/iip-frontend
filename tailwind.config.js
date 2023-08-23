/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		styled: true,
		themes: [
			{
				iip: {
					primary: '#666256',
					secondary: '#e4e1d9',
					accent: '#78716c',
					neutral: '#42413d',
					'base-100': '#ffffff',
					'base-content': '#353431'
				}
			},
			'light'
		]
	},
	theme: {
		extend: {
			colors: {
				theme: {
					200: 'rgba(228,225,217,1)',
					700: 'rgba(102,98,86,1)',
					800: 'rgba(53,52,49,1)'
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
