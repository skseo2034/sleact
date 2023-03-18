import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "countApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://example.com/api" }),
  tagTypes: ["Count"],
  endpoints: (builder) => ({
    getCount: builder.query({
      query: ({ name }) => `count/${name}`,
      providesTags: (result, error, arg) => {
        return [{ type: "Count", id: arg.name }];
      }
    }),
    setCount: builder.mutation({
      query: ({ name, value }) => {
        return {
          url: `count/${name}`,
          method: "POST",
          body: { value }
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Count", id: arg.name }]
    })
  })
});
