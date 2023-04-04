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
                    console.log(err);
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
            query: () => '/assignmentMark',
        }),
        editAssignmentMark: builder.mutation({
            query: (data) => ({
                url: `/assignmentMark/${data.id}`,
                method: 'PUT',
                body: {
                    ...data,
                    status: 'published',
                },
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedAssignmentMark } = await queryFulfilled;
                    if (updatedAssignmentMark) {
                        dispatch(
                            assignmentMarkAPI.util.updateQueryData(
                                'getAssignmentMarks',
                                undefined,
                                (draft) => {
                                    const index = draft.findIndex(
                                        (assignmentMark) => assignmentMark.id === data.id
                                    );
                                    draft.splice(index, 1, updatedAssignmentMark);
                                }
                            )
                        );
                    }
                } catch (err) {
                    console.log(err);
                }
            },
        }),
    }),
});

export const {
    useAddAssignmentMarkMutation,
    useGetAssignmentMarksByAssignmentIdQuery,
    useGetAssignmentMarksQuery,
    useEditAssignmentMarkMutation,
} = assignmentMarkAPI;
