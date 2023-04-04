import { apiSlice } from '../api/apiSlice';
import { userLoggedIn } from './authSlice';

export const authAPI = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body: data,
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken, user } = data;

                    localStorage.setItem(
                        'auth',
                        JSON.stringify({
                            accessToken,
                            user,
                        })
                    );

                    dispatch(userLoggedIn({ accessToken, user }));
                } catch (error) {
                    // do nothing
                }
            },
        }),
        register: build.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: {
                    ...data,
                    role: 'student',
                },
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken, user } = data;

                    localStorage.setItem(
                        'auth',
                        JSON.stringify({
                            accessToken,
                            user,
                        })
                    );

                    dispatch(userLoggedIn({ accessToken, user }));
                } catch (error) {
                    // do nothing
                }
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authAPI;
