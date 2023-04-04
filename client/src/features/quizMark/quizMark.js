import { apiSlice } from '../api/apiSlice';

export const quizMarkAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
                        await dispatch(
                            quizMarkAPI.util.upsertQueryData(
                                'getQuizMarkByVideoId',
                                data.video_id.toString(),
                                quizMark
                            )
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),
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
        getQuizMarks: builder.query({
            query: () => '/quizMark',
        }),
    }),
});

export const { useAddQuizMarkMutation, useGetQuizMarkByVideoIdQuery, useGetQuizMarksQuery } =
    quizMarkAPI;
