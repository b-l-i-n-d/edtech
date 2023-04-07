import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: undefined,
    user: undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // set accessToken and user in Store
        userLoggedIn: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },

        // clear accessToken and user in Store and localStorage
        userLoggedOut: (state) => {
            state.accessToken = undefined;
            state.user = undefined;

            // clear local storage
            localStorage.clear();
        },
    },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
