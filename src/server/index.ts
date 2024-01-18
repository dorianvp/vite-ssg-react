import { Router } from 'express';
import { readdirSync } from 'fs'

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

export { mainRouter }