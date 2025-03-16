import { apiSlice } from "../api/apiSlice"

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscriptions
    getAllSubscriptions: builder.query({
      query: () => "subscription/list",
      transformResponse: (response) => {
        if (response && response.subscriptions) {
          return response.subscriptions
        }
        return []
      },
      providesTags: ["Subscriptions"],
    }),

    // Create a new subscription
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "subscription/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    // Update a subscription
    updateSubscription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `subscription/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    // Delete a subscription
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `subscription/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
})

export const {
  useGetAllSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi

