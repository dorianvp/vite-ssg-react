import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		vike()
	],
	server: {
		port: 3000
	},
	define: {
		global: "window"
	}
})