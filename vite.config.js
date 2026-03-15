import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
	plugins: [
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				requery: resolve(__dirname, 'requery/index.html'),
				resourceloader: resolve(__dirname, 'resourceloader/index.html'),
				imageprocessor: resolve(__dirname, 'imageprocessor/index.html'),
			},
		},
	},
})
