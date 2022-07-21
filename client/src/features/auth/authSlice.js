import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
        },
        setNewAccessToken: (state, action) => {
            const { token } = action.payload;
            state.token = token;
        },
        frontEndLogout: (state, action) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setCredentials, frontEndLogout, setNewAccessToken } =
    authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = state => state.auth.user;
export const selectCurrentToken = state => state.auth.token;
