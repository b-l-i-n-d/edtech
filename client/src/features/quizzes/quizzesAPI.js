import { apiSlice } from '../api/apiSlice';

export const quizzesAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // get quizzes by video id
        getQuizzesByVideoId: builder.query({
            query: (id) => `/quizzes?video_id=${id}`,
            transformResponse: (response) => {
                if (response.length > 0) {
                    return response;
                }
                return response[0];
            },
        }),

        // get quizzes by page
        getQuizzes: builder.query({
            query: (page) => `/quizzes?_page=${page}&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,

            transformResponse: (response, meta) => {
                const totalCount = meta.response.headers.get('x-total-count');
                return {
                    quizzes: response,
                    totalCount,
                };
            },
        }),

        // create new quiz
        addQuiz: builder.mutation({
            query: (data) => ({
                url: '/quizzes',
                method: 'POST',
                body: data.data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: addedQuiz } = await queryFulfilled;

                    if (addedQuiz) {
                        // update with new quiz in quizzes
                        await dispatch(
                            quizzesAPI.util.updateQueryData(
                                'getQuizzes',
                                arg.totalPage,
                                (draft) => ({
                                    ...draft,
                                    quizzes:
                                        draft.quizzes.length < import.meta.env.VITE_LIMIT_PER_PAGE
                                            ? [...draft.quizzes, addedQuiz]
                                            : draft.quizzes,
                                })
                            )
                        );

                        // update total count
                        for (let i = 1; i <= arg.totalPage; i += 1) {
                            dispatch(
                                quizzesAPI.util.updateQueryData('getQuizzes', i, (draft) => ({
                                    ...draft,
                                    totalCount: (Number(draft.totalCount) + 1).toString(),
                                }))
                            );
                        }
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        // update quiz
        editQuiz: builder.mutation({
            query: ({ id, data }) => ({
                url: `/quizzes/${id}`,
                method: 'PATCH',
                body: data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedQuiz } = await queryFulfilled;

                    // update with edited quiz in quizzes
                    if (updatedQuiz) {
                        await dispatch(
                            quizzesAPI.util.updateQueryData(
                                'getQuizzes',
                                arg.currentPage,
                                (draft) => {
                                    const index = draft.quizzes.findIndex(
                                        (quiz) => quiz.id === updatedQuiz.id
                                    );
                                    draft.quizzes.splice(index, 1, updatedQuiz);
                                }
                            )
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        // delete quiz
        deleteQuiz: builder.mutation({
            query: ({ id }) => ({
                url: `/quizzes/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    // remove deleted quiz from quizzes
                    await dispatch(
                        quizzesAPI.util.updateQueryData('getQuizzes', arg.currentPage, (draft) => {
                            draft.quizzes = draft.quizzes.filter((quiz) => quiz.id !== arg.id);
                        })
                    );

                    // update total count
                    for (let i = 1; i <= arg.totalPage; i += 1) {
                        dispatch(
                            quizzesAPI.util.updateQueryData('getQuizzes', i, (draft) => ({
                                ...draft,
                                totalCount: (Number(draft.totalCount) - 1).toString(),
                            }))
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
    useGetQuizzesByVideoIdQuery,
    useGetQuizzesQuery,
    useAddQuizMutation,
    useDeleteQuizMutation,
    useEditQuizMutation,
} = quizzesAPI;
