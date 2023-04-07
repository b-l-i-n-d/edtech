import { apiSlice } from '../api/apiSlice';

export const usersAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // get all users
        getUsers: builder.query({
            query: () => '/users',
        }),
    }),
});

export const { useGetUsersQuery } = usersAPI;
