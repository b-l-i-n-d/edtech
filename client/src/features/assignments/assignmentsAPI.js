import { apiSlice } from '../api/apiSlice';

export const assignmentsAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAssignmentsByVideoId: builder.query({
            query: (id) => `/assignments?video_id=${id}`,
            transformResponse: (response) => response[0],
        }),

        getAssignments: builder.query({
            query: (page) =>
                `/assignments?_page=${page}&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,

            transformResponse: (response, meta) => {
                const totalCount = meta.response.headers.get('x-total-count');
                return {
                    assignments: response,
                    totalCount,
                };
            },
        }),

        addAssignment: builder.mutation({
            query: (data) => ({
                url: '/assignments',
                method: 'POST',
                body: data.data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: addedAssignment } = await queryFulfilled;
                    if (addedAssignment) {
                        await dispatch(
                            assignmentsAPI.util.updateQueryData(
                                'getAssignments',
                                arg.totalPage,
                                (draft) => ({
                                    ...draft,
                                    assignments:
                                        draft.assignments.length <
                                        import.meta.env.VITE_LIMIT_PER_PAGE
                                            ? [...draft.assignments, addedAssignment]
                                            : draft.assignments,
                                })
                            )
                        );
                        for (let i = 1; i <= arg.totalPage; i += 1) {
                            dispatch(
                                assignmentsAPI.util.updateQueryData(
                                    'getAssignments',
                                    i,
                                    (draft) => ({
                                        ...draft,
                                        totalCount: (Number(draft.totalCount) + 1).toString(),
                                    })
                                )
                            );
                        }
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        editAssignment: builder.mutation({
            query: ({ id, data }) => ({
                url: `/assignments/${id}`,
                method: 'PATCH',
                body: data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedAssignment } = await queryFulfilled;
                    if (updatedAssignment) {
                        dispatch(
                            assignmentsAPI.util.updateQueryData(
                                'getAssignments',
                                arg.currentPage,
                                (draft) => {
                                    const index = draft.assignments.findIndex(
                                        (assignment) => assignment.id === updatedAssignment.id
                                    );
                                    draft.assignments.splice(index, 1, updatedAssignment);
                                }
                            )
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        deleteAssignment: builder.mutation({
            query: ({ id }) => ({
                url: `/assignments/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: deletedAssignment } = await queryFulfilled;
                    if (deletedAssignment) {
                        dispatch(
                            assignmentsAPI.util.updateQueryData(
                                'getAssignments',
                                arg.currentPage,
                                (draft) => {
                                    draft.assignments = draft.assignments.filter(
                                        (assignment) => assignment.id !== arg.id
                                    );
                                }
                            )
                        );
                        for (let i = 1; i <= arg.totalPage; i += 1) {
                            dispatch(
                                assignmentsAPI.util.updateQueryData(
                                    'getAssignments',
                                    i,
                                    (draft) => ({
                                        ...draft,
                                        totalCount: (Number(draft.totalCount) - 1).toString(),
                                    })
                                )
                            );
                        }
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),
    }),
});

export const {
    useGetAssignmentsByVideoIdQuery,
    useGetAssignmentsQuery,
    useAddAssignmentMutation,
    useDeleteAssignmentMutation,
    useEditAssignmentMutation,
} = assignmentsAPI;
