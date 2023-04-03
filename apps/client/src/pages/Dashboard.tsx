import {
    Box
} from '@hope-ui/solid'

import { Route, Routes } from '@solidjs/router'
import { lazy } from 'solid-js'

const AddEvents = lazy(() => import('./AddEvents'))
const CustomEvents = lazy(() => import('./CustomEvents'))
const HeaderNav = lazy(() => import('./HeaderNav'))
const Pricing = lazy(() => import('./Pricing'))
const SeatsInfo = lazy(() => import('./SeatsInfo'))
const Sidebar = lazy(() => import('./Sidebar'))
const Under100 = lazy(() => import('./Under100'))
const Venues = lazy(() => import('./Venues'))
const XLSImport = lazy(() => import('./XLS Import'))
const Skybox = lazy(() => import('./reports/Skybox'))
const Events = lazy(() => import('./reports/Events'))
const MissingPrices = lazy(() => import('./reports/MissingPrices'))

export default function Dashboard() {
    return (
        <Box minH="$screenH">
            <Sidebar />
            <HeaderNav />
            <Routes>
                <Route path="/events" component={AddEvents} />
                <Route path="/under-100" component={Under100} />
                <Route path="/seats-info" component={SeatsInfo} />
                <Route path="/custom-events" component={CustomEvents} />
                <Route path="/venues" component={Venues} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/xls-import" component={XLSImport} />
                <Route path="/reports/skybox" component={Skybox} />
                <Route path="/reports/events" component={Events} />
                <Route path="/reports/missing-pricing" component={MissingPrices} />
            </Routes>
        </Box>
    )
}
