import { HopeProvider } from '@hope-ui/solid'
import { render } from 'solid-js/web'

import { Router } from '@solidjs/router'
import App from './App'
import './index.css'
import theme from './theme'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
    )
}

render(() => <Router>
    <HopeProvider config={theme}>
        <App />
    </HopeProvider>
</Router>, root!)
