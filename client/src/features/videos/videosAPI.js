import { apiSlice } from '../api/apiSlice';
import { videoSelected } from './videosSlice';

export const videosAPI = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getVideos: build.query({
            query: () => ({
                url: `/videos?_page=1&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,
                method: 'GET',
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: videos } = await queryFulfilled;
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
        getMoreVideos: build.query({
            query: (page) => ({
                url: `/videos?_page=${page}&_limit=${import.meta.env.VITE_LIMIT_PER_PAGE}`,
                method: 'GET',
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: videos } = await queryFulfilled;
                    if (videos.length > 0) {
                        await dispatch(
                            videosAPI.util.updateQueryData('getVideos', undefined, (draft) => {
                                draft.push(...videos);
                            })
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
                    ...data,
                    createdAt: new Date(),
                },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: video } = await queryFulfilled;
                    if (video) {
                        await dispatch(
                            videosAPI.util.updateQueryData('getVideos', undefined, (draft) => {
                                draft.push(video);
                            })
                        );
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
                    const { data: video } = await queryFulfilled;
                    if (video) {
                        await dispatch(
                            videosAPI.util.updateQueryData('getVideos', undefined, (draft) => {
                                const index = draft.findIndex((v) => v.id === video.id);
                                draft.splice(index, 1, video);
                            })
                        );
                    }
                } catch (error) {
                    // do nothing
                }
            },
        }),
        deleteVideo: build.mutation({
            query: (id) => ({
                url: `/videos/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: video } = await queryFulfilled;
                    if (video) {
                        await dispatch(
                            videosAPI.util.updateQueryData('getVideos', undefined, (draft) => {
                                const index = draft.findIndex((v) => v.id === video.id);
                                draft.splice(index, 1);
                            })
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
    useAddVideoMutation,
    useDeleteVideoMutation,
    useEditVideoMutation,
    useGetVideosQuery,
    useGetMoreVideosQuery,
    useGetVideoQuery,
} = videosAPI;
