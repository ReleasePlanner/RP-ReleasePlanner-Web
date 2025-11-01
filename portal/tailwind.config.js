/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f7f3',
					100: '#d9ece2',
					200: '#b4d9c5',
					300: '#8cc6a7',
					400: '#4fa676',
					500: '#217346', // Excel green
					600: '#1b5c39',
					700: '#15472c',
					800: '#0f3421',
					900: '#0a2518',
				},
			},
		},
	},
	plugins: [],
};


