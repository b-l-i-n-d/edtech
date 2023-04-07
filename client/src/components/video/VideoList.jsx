import React, { useEffect, useState } from 'react';
import InfinityScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { useGetVideosQuery, videosAPI } from '../../features/videos/videosAPI';
import Common from '../common';
import VideoCard from './VideoCard';

function VideoList() {
    const { data, isLoading, error } = useGetVideosQuery();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();

    const { videos, totalCount } = data || {};

    // fetch more data
    const fetchMoreData = () => {
        if (videos.length >= totalCount) {
            setHasMore(false);
            return;
        }
        setPage((prevPage) => prevPage + 1);
    };

    // generating video list
    const videoList = isLoading ? (
        <Common.Loader />
    ) : (
        videos?.map((video) => <VideoCard key={video.id} video={video} />)
    );

    // fetch more videos if page > 1
    useEffect(() => {
        if (page > 1) {
            dispatch(videosAPI.endpoints.getMoreVideos.initiate(page));
        }
    }, [page, dispatch]);

    // check if there are more videos to fetch
    useEffect(() => {
        if (totalCount > 0) {
            const more = Math.ceil(totalCount / import.meta.env.VITE_LIMIT_PER_PAGE) > page;
            setHasMore(more);
        }
    }, [page, totalCount]);

    return (
        <div className="col-span-full lg:col-auto max-h-[570px] overflow-y-auto bg-secondary rounded-md border border-slate-50/10 divide-y p-4 divide-slate-600/30">
            {videoList?.length > 0 ? (
                <InfinityScroll
                    dataLength={videoList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<Common.Loader inline />}
                    height={530}
                >
                    {videoList}
                </InfinityScroll>
            ) : (
                <Common.Info info="No videos found" />
            )}
            {error && <Common.Error error={error} />}
        </div>
    );
}

export default VideoList;
