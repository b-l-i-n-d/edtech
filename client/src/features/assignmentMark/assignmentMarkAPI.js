import { apiSlice } from '../api/apiSlice';

export const assignmentMarkAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAssignmentMark: builder.mutation({
            query: (data) => {
                const { user } = JSON.parse(localStorage.getItem('auth'));

                return {
                    url: '/assignmentMark',
                    method: 'POST',
                    body: {
                        ...data,
                        createdAt: new Date(),
                        status: 'pending',
                        mark: 0,
                        student_id: user.id,
                        student_name: user.name,
                    },
                };
            },
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: newAssignmentMark } = await queryFulfilled;
                    if (newAssignmentMark) {
                        await dispatch(
                            assignmentMarkAPI.util.upsertQueryData(
                                'getAssignmentMarksByAssignmentId',
                                data.assignment_id.toString(),
                                newAssignmentMark
                            )
                        );
                    }
                } catch (err) {
                    // do nothing
                }
            },
        }),

        getAssignmentMarksByAssignmentId: builder.query({
            query: (id) =>
                `/assignmentMark?assignment_id=${id}&student_id=${
                    JSON.parse(localStorage.getItem('auth')).user.id
                }`,
            transformResponse: (response) => {
                if (response.length > 0) {
                    return response[0];
                }
                return null;
            },
        }),

        getAssignmentMarks: builder.query({
            query: (page) =>
                `/assignmentMark?_page=${page}&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,

            transformResponse: (response, meta) => {
                const totalCount = meta.response.headers.get('x-total-count');
                return {
                    assignmentMarks: response,
                    totalCount,
                };
            },
        }),

        getAllAssignmentMarks: builder.query({
            query: () => `/assignmentMark`,
        }),

        getAssignmentMarksByStatus: builder.query({
            query: (status) => `/assignmentMark?status=${status}`,

            transformResponse: (response) => response.length,
        }),

        editAssignmentMark: builder.mutation({
            query: ({ id, data }) => ({
                url: `/assignmentMark/${id}`,
                method: 'PATCH',
                body: {
                    ...data,
                    status: 'published',
                },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedAssignmentMark } = await queryFulfilled;
                    if (updatedAssignmentMark) {
                        await dispatch(
                            assignmentMarkAPI.util.updateQueryData(
                                'getAssignmentMarks',
                                arg.currentPage,
                                (draft) => {
                                    const index = draft.assignmentMarks.findIndex(
                                        (assignmentMark) =>
                                            assignmentMark.id === updatedAssignmentMark.id
                                    );
                                    draft.assignmentMarks.splice(index, 1, updatedAssignmentMark);
                                }
                            )
                        );

                        await dispatch(
                            assignmentMarkAPI.util.updateQueryData(
                                'getAssignmentMarksByStatus',
                                'pending',
                                (draft) => draft - 1
                            )
                        );
                    }
                } catch (err) {
                    // do nothing
                }
            },
        }),
    }),
});

export const {
    useAddAssignmentMarkMutation,
    useGetAssignmentMarksByAssignmentIdQuery,
    useGetAssignmentMarksQuery,
    useGetAllAssignmentMarksQuery,
    useGetAssignmentMarksByStatusQuery,
    useEditAssignmentMarkMutation,
} = assignmentMarkAPI;
