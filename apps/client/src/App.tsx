import { lazy } from 'solid-js'

// Lazy components
const Dashboard = lazy(() => import('./pages/Dashboard'))

export default function App() {
    return <Dashboard />
}
