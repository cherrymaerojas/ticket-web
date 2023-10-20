import axios from "axios"

// export function signup(email: string, password: string) {
//   return baseApi
//     .post<User>("users/signup", { email, password })
//     .then(res => res.data)
// }

export function signIn(username: string, password: string) {
  return axios
    .post("https://aiitchtix.net/api/auth/login", { username, password })
    .then(res => res.data)
}

// export function logout() {
//   return baseApi.delete("users/logout")
// }

// export function getLoggedInUser() {
//   return baseApi
//     .get<User | undefined>("users/session")
//     .then(res => res.data ?? undefined)
// }
