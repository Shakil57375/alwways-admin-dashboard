import { apiSlice } from "../api/apiSlice"

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch policies (Terms & Conditions and Privacy Policy)
    fetchPolicies: builder.query({
      query: () => "policy/policies",
      transformResponse: (response) => {
        return {
          termsAndConditions: response.termsAndConditions || "",
          privacyPolicy: response.privacyPolicy || "",
        }
      },
      providesTags: ["Policies"],
    }),

    // Update policies
    updatePolicies: builder.mutation({
      query: (data) => ({
        url: "policy/policies",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Policies"],
    }),
  }),
})

export const { useFetchPoliciesQuery, useUpdatePoliciesMutation } = settingsApi

