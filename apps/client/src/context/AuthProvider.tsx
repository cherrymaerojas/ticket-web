import { ParentComponent, createContext } from 'solid-js'
import { SetStoreFunction, createStore } from 'solid-js/store'

interface AuthContextType {
    auth: { isAuthenticated: boolean, isLoading: boolean }
    setAuth: SetStoreFunction<{
        isAuthenticated: boolean
        isLoading: boolean
    }>
}

const AuthContext = createContext<AuthContextType>()
export const AuthProvider: ParentComponent = (props) => {
    const [auth, setAuth] = createStore({ isAuthenticated: false, isLoading: false })

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext
