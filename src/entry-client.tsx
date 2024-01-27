import ReactDOM from 'react-dom/client'
import { App } from './App'
import { StrictMode } from 'react'

ReactDOM.hydrateRoot(
	document.getElementById('root') as Element,
	<StrictMode>
		<App />
	</StrictMode>
)
console.log('client hydrated')