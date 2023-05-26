import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { createEffect, onCleanup } from "solid-js"
import axios from "../api/axios"
import useAuth from "./useAuth"
import useRefreshToken from "./useRefresh"

type ErrorResponse = {
    message: string
}

const useAxios = () => {
    const refresh = useRefreshToken()
    const auth = useAuth()

    createEffect(() => {
        const requestIntercept = axios.interceptors.request.use((config): InternalAxiosRequestConfig => {
            if (!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${auth?.auth.accessToken}`
            }
            return config
        }, error => Promise.reject(error)
        )

        const responseIntercept = axios.interceptors.response.use(
            (res: AxiosResponse) => res,
            async (error: AxiosError<ErrorResponse>) => {
                const prevReq = error.config
                if (error.response?.status === 403 && prevReq) {
                    const { accessToken } = await refresh()
                    prevReq.headers['Authorization'] = `Bearer ${accessToken}`
                    return axios(prevReq)
                }
                return Promise.reject(error)
            },
        )
        onCleanup(() => {
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(responseIntercept)
        })
    })
    return axios
}

export default useAxios
