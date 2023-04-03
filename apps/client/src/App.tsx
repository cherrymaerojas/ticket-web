import { Box } from '@hope-ui/solid'
import { lazy } from 'solid-js'

// Lazy components
const Dashboard = lazy(() => import('./pages/Dashboard'))

function Test() {
    return <Box ml="$60" p="$4">
        Text
    </Box>
}

export default function App() {
    return <Dashboard />
}
