import {
    Box
} from '@hope-ui/solid'

import HeaderNav from './pages/HeaderNav'
import Sidebar from './pages/Sidebar'

export default function App() {
    return (
        <Box minH="$screenH">
            <Sidebar />
            <HeaderNav />
        </Box>
    )
}
