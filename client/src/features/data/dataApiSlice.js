import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getData: builder.query({
            query: () => "/data",
            keepUnusedDataFor: 5,
            providesTags: ["data"],
        }),
        createData: builder.mutation({
            query: title => ({
                url: "/data",
                method: "POST",
                body: { title },
            }),
        }),
        deleteData: builder.mutation({
            query: id => ({
                url: `/data/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["data"],
        }),
    }),
});

export const { useGetDataQuery, useCreateDataMutation, useDeleteDataMutation } =
    usersApiSlice;
