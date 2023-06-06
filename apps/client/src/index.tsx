import { HopeProvider, NotificationsProvider } from '@hope-ui/solid'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'

import { Router } from '@solidjs/router'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import './index.css'
import theme from './theme'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
    )
}

const queryClient = new QueryClient()

render(() =>
    <QueryClientProvider client={queryClient}>
        <HopeProvider config={theme}>
            <NotificationsProvider>
                <Router>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </Router>
            </NotificationsProvider>
        </HopeProvider>
    </QueryClientProvider>, root!)

export { queryClient }
