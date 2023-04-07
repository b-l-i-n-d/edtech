import { apiSlice } from '../api/apiSlice';

export const assignmentMarkAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // create new assignmentMark
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

                    // update with new assignmentMark in assignmentMarks
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

        // get assignmentMark by assignment id
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

        // get assignmentMarks by page
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

        // get all assignmentMarks
        getAllAssignmentMarks: builder.query({
            query: () => `/assignmentMark`,
        }),

        // get assignmentMarks length by status
        getAssignmentMarksByStatus: builder.query({
            query: (status) => `/assignmentMark?status=${status}`,

            transformResponse: (response) => response.length,
        }),

        // update assignmentMark
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

                    // update with new assignmentMark in assignmentMarks by page
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
