import { apiSlice } from "../api/apiSlice"

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query({
      query: () => "user/all-users",
      providesTags: ["Users"],
      transformResponse: (response) => {
        // Transform the response to match the expected format
        if (response && response.users) {
          return response.users.map((user) => ({
            id: user._id,
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            contactNumber: user.mobile || "N/A",
            location: user.location || "N/A",
            status: user.isBlocked ? "Blocked" : "Active",
            subscriptionType: user.subscriptionType || "Free",
            income: user.income || 0,
            avatar: user.profilePicture || "/placeholder.svg?height=40&width=40",
            date: user.dateOfBirth || null,
            role: user.role || "user",
            gender: user.gender || "N/A",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }))
        }
        return []
      },
    }),
  }),
})

export const { useGetAllUsersQuery } = userApi

