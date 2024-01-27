import { Router } from 'express';
import { readdirSync } from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p: string) => path.resolve(__dirname, p)
const mainRouter = Router()

mainRouter.get('/example', (_req, res) => {
	return res.send('Hello')
})

mainRouter.get('/pageCount', (_req, res) => {
	try {
		const pages = readdirSync('src/pages')
		return res.send({ count: pages.length })
	} catch (error) {
		console.log(error);
		return res.send({ count: 0 })
	}
})

mainRouter.get('/', async (_req, res) => {
	try {
		const pages = readdirSync('src/pages')

		const routes = await Promise.all(
			pages.map(async (name) => {
				const path = resolve(
					'../pages/' + name.charAt(0).toUpperCase() + name.slice(1)
				)
				const module = await import(
					path
				)
				return {
					name,
					path: `/${name.toLowerCase()}`,
					metadata: module.metadata
				}
			})
		)
		return res.send({ data: { pages: routes } })
	} catch (error) {
		console.log(error);
		return res.send({
			data: {
				pages: []
			}
		})
	}
})

export { mainRouter }