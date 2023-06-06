import axios from "axios"
import useAuth from "./useAuth"


type RefreshTokenResponse = {
    accessToken: string
    refreshToken: string
}

const useRefreshToken = () => {
    const auth = useAuth()
    return async () => {
        const response = await axios.post<RefreshTokenResponse>('api/auth/refresh-tokens', { refreshToken: auth?.auth.refreshToken })
        auth?.setAuth("accessToken", response.data.accessToken)
        auth?.setAuth("refreshToken", response.data.refreshToken)
        return response.data
    }
}

export default useRefreshToken
