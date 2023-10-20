import { Outlet, useNavigate } from "@solidjs/router"
import { createEffect } from "solid-js"

export default function RouteGuard() {
  const navigate = useNavigate()
  const token = sessionStorage.getItem("token")

  createEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true })
    }
  })

  return (
    <div>
      <Outlet />
    </div>
  )
}
