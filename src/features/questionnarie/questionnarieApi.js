import { apiSlice } from "../api/apiSlice";

export const questionnaireApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Section endpoints
    getSections: builder.query({
      query: () => "section/sections",
      providesTags: ["Sections"],
    }),

    addSection: builder.mutation({
      query: (data) => ({
        url: "section/section",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sections"],
    }),

    updateSection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `section/section/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sections"],
    }),

    deleteSection: builder.mutation({
      query: (id) => ({
        url: `section/section/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sections"],
    }),

    // Question endpoints
    getQuestionsBySection: builder.query({
      query: (sectionId) => `question/questions/${sectionId}`,
      providesTags: (result, error, sectionId) => [{ type: "Questions", id: sectionId }],
    }),

    addQuestion: builder.mutation({
      query: (data) => ({
        url: "question/question",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { sectionId }) => [{ type: "Questions", id: sectionId }, "Sections"],
    }),

    updateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `question/question/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { sectionId }) => [{ type: "Questions", id: sectionId }, "Sections"],
    }),

    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `question/question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { sectionId }) => [{ type: "Questions", id: sectionId }, "Sections"],
    }),
    // Notification endpoints
    getNotifications: builder.query({
      query: () => "user/notifications",
      providesTags: ["Notifications"],
    }),

    updateNotificationStatus: builder.mutation({
      query: (id) => ({
        url: `user/notifications/${id}`,
        method: "PUT",
        body: { status: "read" }, // Adjust to match API expectation
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useGetQuestionsBySectionQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} = questionnaireApi;