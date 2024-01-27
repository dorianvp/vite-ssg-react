import ReactDOMServer from 'react-dom/server'
import { App } from './App'
import { StrictMode } from 'react'

export function render(url: string, _context: {}) {
	return ReactDOMServer.renderToString(
		<StrictMode>
			<App location={url} />
		</StrictMode>
	)
}