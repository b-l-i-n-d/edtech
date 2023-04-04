import { apiSlice } from '../api/apiSlice';

export const assignmentsAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAssignmentsByVideoId: builder.query({
            query: (id) => `/assignments?video_id=${id}`,
            transformResponse: (response) => response[0],
        }),
        getAssignments: builder.query({
            query: () => `/assignments`,
        }),
        addAssignment: builder.mutation({
            query: (data) => ({
                url: '/assignments',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: assignment } = await queryFulfilled;
                    if (assignment) {
                        dispatch(
                            assignmentsAPI.util.updateQueryData(
                                'getAssignments',
                                undefined,
                                (draft) => {
                                    draft.push(assignment);
                                }
                            )
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),
        editAssignment: builder.mutation({
            query: (data) => ({
                url: `/assignments/${data.id}`,
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedAssignment } = await queryFulfilled;
                    if (updatedAssignment) {
                        dispatch(
                            assignmentsAPI.util.updateQueryData(
                                'getAssignments',
                                undefined,
                                (draft) => {
                                    const index = draft.findIndex(
                                        (assignment) => assignment.id === data.id
                                    );
                                    draft.splice(index, 1, updatedAssignment);
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
            query: (id) => ({
                url: `/assignments/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    const { data: deletedAssignment } = await queryFulfilled;
                    if (deletedAssignment) {
                        dispatch(
                            assignmentsAPI.util.updateQueryData(
                                'getAssignments',
                                undefined,
                                (draft) => {
                                    const index = draft.findIndex(
                                        (assignment) => assignment.id === deletedAssignment.id
                                    );
                                    draft.splice(index, 1);
                                }
                            )
                        );
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
