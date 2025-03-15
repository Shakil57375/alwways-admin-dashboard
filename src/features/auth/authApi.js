import { apiSlice } from "../api/apiSlice"
import { userLoggedIn } from "./authSlice"

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing login mutation
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

    // Send password reset email
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "user/admin/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Verify OTP code
    verifyCode: builder.mutation({
      query: ({ email, code }) => ({
        url: "user/verify-code",
        method: "POST",
        body: { email, code },
      }),
    }),

    // Reset password with new password
    resetPassword: builder.mutation({
      query: ({ email, newPassword }) => ({
        url: "user/admin/set-new-password",
        method: "POST",
        body: { email, newPassword },
      }),
    }),
  }),
})

export const { useLoginMutation, useForgotPasswordMutation, useVerifyCodeMutation, useResetPasswordMutation } = authApi

