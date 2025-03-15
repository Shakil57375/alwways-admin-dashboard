import { apiSlice } from "../api/apiSlice"

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all admins
    getAllAdmins: builder.query({
      query: () => "user/get-all-admins",
      providesTags: ["Admins"],
    }),

    // Create new admin
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "user/make-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admins"],
    }),

    // Delete admin
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `user/delete-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),

    // Edit admin profile
    editAdminProfile: builder.mutation({
      query: (data) => ({
        url: "user/admin/edit-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admins"],
    }),

    // Change admin password
    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "user/admin/change-password",
        method: "PUT",
        body: data,
      }),
    }),
  }),
})

export const {
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useEditAdminProfileMutation,
  useChangeAdminPasswordMutation,
} = adminApi

