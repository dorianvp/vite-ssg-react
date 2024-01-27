import './index.css'
import './App.css'
import { MainLayout } from './components/layout/main.layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true }) as Record<string, { default: () => JSX.Element }>

const routes = await Promise.all(
	Object.keys(pages).map(async (path) => {
		const route = path.match(/\.\/pages\/(.*)\.tsx$/) as any[]
		const name = route[1]
		const metadata = (await import(/* @vite-ignore */path)).metadata
		return {
			name,
			path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
			component: pages[path].default,
			metadata: metadata
		}
	})
)

const Router = import.meta.env.SSR ?
	StaticRouter :
	BrowserRouter

export function App({ location }: { location?: string }) {
	return (
		<Router location={location as string}>
			<MainLayout routes={routes}>
				<Routes>
					{routes.map(({ path, component: RouteComp }) => {
						return <Route key={path} path={path} element={<RouteComp />}></Route>
					})}
				</Routes>
			</MainLayout >
		</Router>
	)
}