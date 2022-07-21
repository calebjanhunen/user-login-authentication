import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, frontEndLogout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        //ataches access token to header on each request

        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

async function baseQueryWithReAuth(args, api, extraOptions) {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        console.log("sending refresh token");

        //call refresh token endpoint to get new access token
        const refreshResult = await baseQuery("/refresh", api, extraOptions);
        console.log(args, api);
        console.log(refreshResult);

        if (refreshResult?.data) {
            const user = api.getState().auth.user;

            //store new token
            api.dispatch(
                setCredentials({
                    token: refreshResult.data.accessToken,
                    user,
                })
            );

            //retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
            console.log(result);
        } else {
            api.dispatch(frontEndLogout());
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["data"],
    endpoints: builder => ({}),
});
