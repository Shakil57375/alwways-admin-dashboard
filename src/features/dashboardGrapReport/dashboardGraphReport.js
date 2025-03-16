import { apiSlice } from "../api/apiSlice"

export const dashboardGraphReport = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchIncomeReport: builder.query({
            query: () => "report/income-report",
        })
    }),
})

export const { useFetchIncomeReportQuery } = dashboardGraphReport
