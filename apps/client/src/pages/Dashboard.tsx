import { Box } from "@hope-ui/solid"
import { Outlet, useNavigate } from "@solidjs/router"
import { createEffect, lazy } from "solid-js"

// Lazy components
const HeaderNav = lazy(() => import("./HeaderNav"))
const Sidebar = lazy(() => import("./Sidebar"))

export default function Dashboard() {
  const token = sessionStorage.getItem("token")
  const navigate = useNavigate()

  createEffect(() => {
    if (!token) {
      navigate("/login", { replace: true })
    }
  })

  return (
    <Box minH="$screenH">
      <Sidebar />
      <HeaderNav />
      <Box ml="$60" p="$4">
        <Outlet />
      </Box>
    </Box>
  )
}
