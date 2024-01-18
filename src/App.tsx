import './index.css'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/main.layout'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true }) as Record<string, { default: () => JSX.Element }>

const routes = Object.keys(pages).map((path) => {
	const route = path.match(/\.\/pages\/(.*)\.tsx$/) as any[]
	const name = route[1]
	return {
		name,
		path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
		component: pages[path].default,
	}
})

export function App() {
	return (
		<MainLayout routes={routes}>
			<Routes>
				{routes.map(({ path, component: RouteComp }) => {
					return <Route key={path} path={path} element={<RouteComp />}></Route>
				})}
			</Routes>
		</MainLayout>
	)
}