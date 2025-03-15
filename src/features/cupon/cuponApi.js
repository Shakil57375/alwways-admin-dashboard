import { apiSlice } from "../api/apiSlice"

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all coupons
    getAllCoupons: builder.query({
      query: () => "coupon/list",
      providesTags: ["Coupons"],
    }),

    // Create new coupon
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "coupon/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Update coupon
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `coupon/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Delete coupon
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `coupon/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
})

export const { useGetAllCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } =
  couponApi

