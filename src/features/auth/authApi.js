import { apiSlice } from "../api/apiSlice"
import { userLoggedIn } from "./authSlice"

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "user/admin/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { token, _id, role, email, firstname, lastname, profilePicture } = data

          // Dispatch userLoggedIn to update Redux state
          dispatch(
            userLoggedIn({
              user: {
                _id,
                email,
                firstname,
                lastname,
                role,
                profilePicture,
              },
              token,
            }),
          )

          // Persist user data to localStorage
          localStorage.setItem(
            "auth",
            JSON.stringify({
              access: token,
              user: {
                _id,
                email,
                firstname,
                lastname,
                role,
                profilePicture,
              },
            }),
          )
        } catch (error) {
          console.error("Login failed:", error)
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi

