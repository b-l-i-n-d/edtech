import { apiSlice } from '../api/apiSlice';

export const quizMarkAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // create new quizMark
        addQuizMark: builder.mutation({
            query: (data) => {
                const { user } = JSON.parse(localStorage.getItem('auth'));

                return {
                    url: '/quizMark',
                    method: 'POST',
                    body: {
                        ...data,
                        student_id: user.id,
                        student_name: user.name,
                    },
                };
            },
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: quizMark } = await queryFulfilled;

                    if (quizMark) {
                        // insert new quizMark into quizMarks
                        await dispatch(
                            quizMarkAPI.util.upsertQueryData(
                                'getQuizMarkByVideoId',
                                data.video_id.toString(),
                                quizMark
                            )
                        );

                        // update with new quizMark in quizMarks
                        await dispatch(
                            quizMarkAPI.util.updateQueryData('getQuizMarks', undefined, (draft) => {
                                draft.push(quizMark);
                            })
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        // get quizMark by video id
        getQuizMarkByVideoId: builder.query({
            query: (id) =>
                `/quizMark?video_id=${id}&student_id=${
                    JSON.parse(localStorage.getItem('auth')).user.id
                }`,
            transformResponse: (response) => {
                if (response.length > 0) {
                    return response[0];
                }
                return null;
            },
        }),

        // get all quizMarks
        getQuizMarks: builder.query({
            query: () => '/quizMark',
        }),
    }),
});

export const { useAddQuizMarkMutation, useGetQuizMarkByVideoIdQuery, useGetQuizMarksQuery } =
    quizMarkAPI;
