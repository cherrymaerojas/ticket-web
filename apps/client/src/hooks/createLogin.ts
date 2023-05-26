import { notificationService } from "@hope-ui/solid"
import { useNavigate } from "@solidjs/router"
import { createMutation } from "@tanstack/solid-query"
import axios, { AxiosError, AxiosResponse } from "axios"
import useAuth from "./useAuth"

function signIn(user: { username: string, password: string }) {
    return axios.post('api/session-authentication/sign-in', user, {
        headers: { 'Content-Type': 'application/json' }
    })
}

type ErrorResponse = {
    message: string
}

type SuccessResponse = {
    accessToken: string
    refreshToken: string
}

export const createLogin = () => {
    const navigate = useNavigate()
    const auth = useAuth()

    const { mutate: login, } = createMutation(signIn, {
        onMutate: () => { auth?.setAuth("isLoading", true) },

        onSuccess: (res: AxiosResponse<SuccessResponse>) => {
            auth?.setAuth("isLoading", false)
            auth?.setAuth("isAuthenticated", true)
            navigate('/', { replace: true })
        },

        onError: (error: AxiosError<ErrorResponse>) => {
            auth?.setAuth("isLoading", false)
            if (error?.response) {
                notificationService.show({
                    status: "danger",
                    description: error?.response.data.message,
                })
            }
        },
    })

    return {
        login
    }
}
