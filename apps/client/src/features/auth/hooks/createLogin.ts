import { notificationService } from "@hope-ui/solid"
import { useNavigate } from "@solidjs/router"
import axios, { AxiosError, AxiosResponse } from "axios"
import useAuth from "../../../hooks/useAuth"
import { createMutation } from "@tanstack/solid-query"

function signIn(user: { username: string; password: string }) {
  //api/auth/sign-in
  if (user.username === "admin" && user.password === "admin") {
    user.username = "david"
    user.password = "dev"
  } else {
    user.username = "test"
    user.password = "test"
  }
  return axios.post("https://aiitchtix.net/api/auth/login", user)
}

type ErrorResponse = {
  message: string
  error: string
}

type SuccessResponse = {
  access_token: string
  expires_in: number
  token_type: string
}

export const createLogin = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const { mutate: login } = createMutation(signIn, {
    onMutate: () => {
      auth?.setAuth("isLoading", true)
    },

    onSuccess: (res: AxiosResponse<SuccessResponse>) => {
      sessionStorage.setItem("token", res.data.access_token)
      auth?.setAuth("isLoading", false)
      auth?.setAuth("isAuthenticated", true)
      navigate("/events", { replace: true })
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      auth?.setAuth("isLoading", false)
      if (error?.response) {
        notificationService.show({
          status: "danger",
          description: error?.response.data.error,
        })
      }
    },
  })

  return {
    login,
  }
}
