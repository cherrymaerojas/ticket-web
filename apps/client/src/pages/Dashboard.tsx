import {
    Box
} from '@hope-ui/solid'
import { Outlet, useNavigate } from '@solidjs/router'
import { createEffect, lazy } from 'solid-js'
import useAuth from '../hooks/useAuth'

// Lazy components
const HeaderNav = lazy(() => import('./HeaderNav'))
const Sidebar = lazy(() => import('./Sidebar'))

export default function Dashboard() {
    const auth = useAuth()
    const navigate = useNavigate()

    createEffect(async () => {
        console.log(auth?.auth.isAuthenticated)
        if (!auth?.auth.isAuthenticated) {
            navigate("/login", { replace: true })
        }
    })

    return (
        <Box minH="$screenH">
            <Sidebar />
            <HeaderNav />
            <Outlet />
        </Box>
    )
}
