import { apiSlice } from "../api/apiSlice"

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders
    getAllOrders: builder.query({
      query: () => "order/all-orders",
      providesTags: ["Orders"],
      transformResponse: (response) => {
        // Transform the response to match the expected format
        if (response && response.orders) {
          return response.orders.map((order) => ({
            id: order._id,
            name: `${order.userId.firstname} ${order.userId.lastname}`,
            email: order.userId.email,
            contactNumber: order.userId.mobile || "N/A",
            location: order.userId.location || "N/A",
            status: order.status || "Pending",
            subscriptionType: order.shippingMethod || "Standard",
            income: order.price || 0,
            avatar: order.userId.profilePicture || "/placeholder.svg?height=40&width=40",
            date: order.createdAt,
            role: order.userId.role || "user",
            bookTitle: order.bookTitle,
            quantity: order.quantity,
            price: order.price,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          }))
        }
        return []
      },
    }),
  }),
})

export const { useGetAllOrdersQuery } = orderApi

