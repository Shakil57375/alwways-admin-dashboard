import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query({
      query: () => 'user/all-users',
      providesTags: ['Users'],
      transformResponse: (response) => {
        // Transform the response to match the expected format
        if (response && response.users) {
          return response.users.map((user) => ({
            id: user._id,
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            contactNumber: user.mobile || 'N/A',
            location: user.location || 'N/A',
            status: user.isBlocked ? 'Blocked' : 'Active',
            subscriptionType: user.subscriptionType || 'Free',
            income: user.income || 0,
            avatar:
              user.profilePicture || '/placeholder.svg?height=40&width=40',
            date: user.dateOfBirth || null,
            role: user.role || 'user',
            gender: user.gender || 'N/A',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }));
        }
        return [];
      },
    }),

    // Get user profile
    getUserProfile: builder.query({
      query: () => 'user/profile',
      providesTags: ['user'],
    }),

    // Update admin profile
    updateAdminProfile: builder.mutation({
      query: (formData) => ({
        url: 'user/admin/edit-profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['user'],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: 'user/admin/change-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),

    getUserGrowth: builder.query({
      query: (year) => `user/users-statics/${year}`,
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `user/admin/delete/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useGetUserGrowthQuery,
  useUpdateAdminProfileMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} = userApi;
