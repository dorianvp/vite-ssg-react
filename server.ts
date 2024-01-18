// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { ViteDevServer } from 'vite'
import { mainRouter } from './src/server/index.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isTest = process.env.VITEST

export async function createServer(
	root = process.cwd(),
	isProd = process.env.NODE_ENV === 'production',
	hmrPort,
) {
	const resolve = (p) => path.resolve(__dirname, p)

	const indexProd = isProd
		? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
		: ''

	const app = express()
	let vite: ViteDevServer
	if (!isProd) {
		vite = await (
			await import('vite')
		).createServer({
			root,
			logLevel: isTest ? 'error' : 'info',
			server: {
				middlewareMode: true,
				watch: {
					// During tests sometimes chokidar misses change events, so enforce polling for consistency
					usePolling: true,
					interval: 100,
				},
				hmr: {
					port: hmrPort,
				},
			},
			appType: 'custom',
		})
		// use vite's connect instance as middleware
		app.use(vite.middlewares)
	} else {
		app.use((await import('compression')).default())
		app.use(
			(await import('serve-static')).default(resolve('dist/client'), {
				index: false,
			}),
		)
	}

	app.use('*', async (req, res, next) => {
		try {
			const url = req.originalUrl
			if (url.includes('api')) return next()

			let template, render
			if (!isProd) {
				// always read fresh template in dev
				template = fs.readFileSync(resolve('index.html'), 'utf-8')
				template = await vite.transformIndexHtml(url, template)
				render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
			} else {
				template = indexProd
				render = (await import('./dist/server/entry-server.js')).render
			}

			const context = {} as { url: string }
			const appHtml = render(url, context)

			if (context.url) {
				// Somewhere a `<Redirect>` was rendered
				return res.redirect(301, context.url)
			}

			const html = template.replace(`<!--app-html-->`, appHtml)

			res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
		} catch (e) {
			!isProd && vite.ssrFixStacktrace(e)
			console.log(e)
			res.status(500).end(e.stack)
		}
	})
	app.use('/api', mainRouter)

	// @ts-ignore
	return { app, vite }
}

if (!isTest) {
	// @ts-ignore
	createServer().then(({ app }) =>
		app.listen(3000, () => {
			console.log('listening on http://localhost:3000')
		}),
	)
} else {
	console.warn('TODO: Tests');
}
