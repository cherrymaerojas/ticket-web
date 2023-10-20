import { Route, Routes } from "@solidjs/router"
import { lazy } from "solid-js"

// Lazy components
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Login = lazy(() => import("./features/auth/components/Login"))
const AddEvents = lazy(() => import("./pages/AddEvents"))
const CustomEvents = lazy(() => import("./pages/CustomEvents"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Events = lazy(() => import("./features/events/components/Events"))
const EventsItem = lazy(() => import("./features/events/components/EventsItem"))
const Under100 = lazy(() => import("./pages/Under100"))
const Venues = lazy(() => import("./features/venues/components/Venues"))
const VenueItem = lazy(() => import("./features/venues/components/VenueItem"))
const XLSImport = lazy(() => import("./pages/XLS Import"))
const Skybox = lazy(() => import("./pages/reports/Skybox"))
const EventsReport = lazy(() => import("./pages/reports/Events"))
const MissingPrices = lazy(() => import("./pages/reports/MissingPrices"))
const EventPerformances = lazy(
  () => import("./features/events/components/EventPerformances")
)

export default function App() {
  return (
    <Routes>
      <Route path="/login" component={Login} />
      {/* TODO: Create 404 page */}
      <Route path="*" element={<h4>404</h4>} />
      <Route path="/" component={Dashboard}>
        <Route path={["/", "events"]}>
          <Route path="/" component={AddEvents} />
          <Route
            path="/events/:id/performances"
            component={EventPerformances}
          />
        </Route>
        <Route path="under-100" component={Under100} />
        <Route path="performances">
          <Route path="/" component={Events} />
          <Route path="/:id" component={EventsItem} />
        </Route>
        <Route path="venues">
          <Route path="/" component={Venues} />
          <Route path="/:id" component={VenueItem} />
        </Route>
        <Route path="custom-events" component={CustomEvents} />
        <Route path="pricing" component={Pricing} />
        <Route path="xls-import" component={XLSImport} />
        <Route path="reports">
          <Route path="/skybox" component={Skybox} />
          <Route path="/events" component={EventsReport} />
          <Route path="/missing-pricing" component={MissingPrices} />
        </Route>
      </Route>
    </Routes>
  )
}
