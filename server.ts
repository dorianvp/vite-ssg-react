// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { ViteDevServer } from 'vite'
import { mainRouter } from './src/server/index.ts'
import { renderPage } from 'vike/server'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = `${__dirname}/..`

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
			let template, render, page
			if (!isProd) {
				// always read fresh template in dev
				template = fs.readFileSync(resolve('index.html'), 'utf-8')
				template = await vite.transformIndexHtml(url, template)
				try {

					if (url === '/') {
						page = await import(
							resolve(
								'./src/pages/Home.tsx'
							)
						)
					} else {
						page = await import(
							resolve(
								'./src/pages/' + url.charAt(1).toUpperCase() + url.slice(2) + '.tsx'
							)
						)
					}
					console.log(page.metadata);
				} catch (error) {

					// TODO: transfer responsibility to router
					return res.redirect(301, '/404')
				}

				// Append to html <head />
				({ render } = await vite.ssrLoadModule('/src/entry-server.tsx'))
			} else {
				template = indexProd;
				({ render } = (await import('./dist/server/entry-server.js')))
			}

			const context = {} as { url: string }
			const appHtml = render(url, context)

			if (context.url) {
				// Somewhere a `<Redirect>` was rendered
				return res.redirect(301, context.url)
			}

			const html = template.replace(`<!--ssr-outlet-->`, appHtml);

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
