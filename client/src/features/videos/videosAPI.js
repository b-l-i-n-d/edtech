import { apiSlice } from '../api/apiSlice';
import { videoSelected } from './videosSlice';

export const videosAPI = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getVideos: build.query({
            query: () => ({
                url: `/videos?_page=1&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,
                method: 'GET',
            }),

            transformResponse: (response, meta) => {
                const totalCount = meta.response.headers.get('x-total-count');
                return {
                    videos: response,
                    totalCount,
                };
            },

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: videosData } = await queryFulfilled;
                    const { videos } = videosData;
                    const currentVideoId = localStorage?.getItem('currentVideoId');

                    if (currentVideoId) {
                        dispatch(videoSelected(currentVideoId));
                    } else if (!currentVideoId && videos.length > 0) {
                        localStorage.setItem('currentVideoId', JSON.stringify(videos[0].id));
                        dispatch(videoSelected(videos[0].id));
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        getAllVideos: build.query({
            query: () => ({
                url: '/videos',
                method: 'GET',
            }),
        }),

        getMoreVideos: build.query({
            query: (page) => ({
                url: `/videos?_page=${page}&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,
                method: 'GET',
            }),

            transformResponse: (response, meta) => {
                const totalCount = meta.response.headers.get('x-total-count');
                return {
                    videos: response,
                    totalCount,
                };
            },

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: moreVideosData } = await queryFulfilled;
                    const { videos: moreVideos } = moreVideosData;
                    if (moreVideos.length > 0) {
                        await dispatch(
                            videosAPI.util.updateQueryData('getVideos', undefined, (draft) => ({
                                ...draft,
                                videos: [...draft.videos, ...moreVideos],
                            }))
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        getVideo: build.query({
            query: (id) => ({
                url: `/videos/${id}`,
                method: 'GET',
            }),
        }),

        addVideo: build.mutation({
            query: (data) => ({
                url: '/videos',
                method: 'POST',
                body: {
                    ...data.formData,
                    createdAt: new Date(),
                },
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: video } = await queryFulfilled;
                    if (video) {
                        await dispatch(
                            videosAPI.util.updateQueryData(
                                'getMoreVideos',
                                arg.totalPage,
                                (draft) => ({
                                    ...draft,
                                    videos:
                                        draft.videos.length < import.meta.env.VITE_LIMIT_PER_PAGE
                                            ? [...draft.videos, video]
                                            : draft.videos,
                                })
                            )
                        );
                        for (let i = 1; i <= arg.totalPage; i += 1) {
                            dispatch(
                                videosAPI.util.updateQueryData('getMoreVideos', i, (draft) => ({
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

        editVideo: build.mutation({
            query: ({ id, data }) => ({
                url: `/videos/${id}`,
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedVideo } = await queryFulfilled;
                    if (updatedVideo) {
                        await dispatch(
                            videosAPI.util.updateQueryData(
                                'getMoreVideos',
                                arg.totalPage,
                                (draft) => {
                                    const index = draft.videos.findIndex(
                                        (v) => v.id === updatedVideo.id
                                    );
                                    draft.videos.splice(index, 1, updatedVideo);
                                }
                            )
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),

        deleteVideo: build.mutation({
            query: ({ id }) => ({
                url: `/videos/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: deletedVideo } = await queryFulfilled;
                    if (deletedVideo) {
                        await dispatch(
                            videosAPI.util.updateQueryData(
                                'getMoreVideos',
                                arg.totalPage,
                                (draft) => {
                                    const index = draft.videos.findIndex(
                                        (v) => v.id === deletedVideo.id
                                    );
                                    draft.videos.splice(index, 1);
                                }
                            )
                        );
                        for (let i = 1; i <= arg.totalPage; i += 1) {
                            dispatch(
                                videosAPI.util.updateQueryData('getMoreVideos', i, (draft) => ({
                                    ...draft,
                                    totalCount: (Number(draft.totalCount) - 1).toString(),
                                }))
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
    useAddVideoMutation,
    useDeleteVideoMutation,
    useEditVideoMutation,
    useGetVideosQuery,
    useGetMoreVideosQuery,
    useGetVideoQuery,
    useLazyGetAllVideosQuery,
} = videosAPI;
