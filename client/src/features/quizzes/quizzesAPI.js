import { apiSlice } from '../api/apiSlice';

export const quizzesAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuizzesByVideoId: builder.query({
            query: (id) => `/quizzes?video_id=${id}`,
            transformResponse: (response) => {
                if (response.length > 0) {
                    return response;
                }
                return response[0];
            },
        }),
        getQuizzes: builder.query({
            query: () => '/quizzes',
        }),
        addQuiz: builder.mutation({
            query: (data) => ({
                url: '/quizzes',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: quiz } = await queryFulfilled;
                    if (quiz) {
                        dispatch(
                            quizzesAPI.util.updateQueryData('getQuizzes', undefined, (draft) => {
                                draft.push(quiz);
                            })
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),
        editQuiz: builder.mutation({
            query: (data) => ({
                url: `/quizzes/${data.id}`,
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedQuiz } = await queryFulfilled;
                    if (updatedQuiz) {
                        dispatch(
                            quizzesAPI.util.updateQueryData('getQuizzes', undefined, (draft) => {
                                const index = draft.findIndex((quiz) => quiz.id === data.id);
                                draft.splice(index, 1, updatedQuiz);
                            })
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),
        deleteQuiz: builder.mutation({
            query: (id) => ({
                url: `/quizzes/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        quizzesAPI.util.updateQueryData('getQuizzes', undefined, (draft) => {
                            const index = draft.findIndex((quiz) => quiz.id === id);
                            draft.splice(index, 1);
                        })
                    );
                } catch (error) {
                    // do nothing
                }
            },
        }),
    }),
});

export const {
    useGetQuizzesByVideoIdQuery,
    useGetQuizzesQuery,
    useAddQuizMutation,
    useDeleteQuizMutation,
    useEditQuizMutation,
} = quizzesAPI;
