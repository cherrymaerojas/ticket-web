
import { useContext } from "solid-js"
import AuthContext from "../context/AuthProvider"

const useAuth = () => useContext(AuthContext)
export default useAuth
