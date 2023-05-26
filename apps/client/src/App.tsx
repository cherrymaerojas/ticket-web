import { Route, Routes } from '@solidjs/router'
import { lazy } from 'solid-js'

// Lazy components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Events = lazy(() => import('./pages/Events'))
const CustomEvents = lazy(() => import('./pages/CustomEvents'))
const Pricing = lazy(() => import('./pages/Pricing'))
const SeatsInfo = lazy(() => import('./pages/SeatsInfo'))
const Under100 = lazy(() => import('./pages/Under100'))
const Venues = lazy(() => import('./pages/Venues'))
const XLSImport = lazy(() => import('./pages/XLS Import'))
const Skybox = lazy(() => import('./pages/reports/Skybox'))
const EventsReport = lazy(() => import('./pages/reports/Events'))
const MissingPrices = lazy(() => import('./pages/reports/MissingPrices'))

export default function App() {
    return <Routes>
        <Route path="/login" component={Login} />
        <Route path="/" component={Dashboard}>
            <Route path={["/", "events"]} component={Events} />
            <Route path="under-100" component={Under100} />
            <Route path="seats-info" component={SeatsInfo} />
            <Route path="custom-events" component={CustomEvents} />
            <Route path="venues" component={Venues} />
            <Route path="pricing" component={Pricing} />
            <Route path="xls-import" component={XLSImport} />
            <Route path="reports/skybox" component={Skybox} />
            <Route path="reports/events" component={EventsReport} />
            <Route path="reports/missing-pricing" component={MissingPrices} />
        </Route>
        {/* TODO: Create 404 page */}
        <Route path="*" element={<h4>404</h4>} />
    </Routes>
}
