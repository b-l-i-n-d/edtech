import React from 'react';
import InfinityScroll from 'react-infinite-scroll-component';
import { useGetVideosQuery } from '../../features/videos/videosAPI';
import Common from '../common';
import VideoCard from './VideoCard';

function VideoList() {
    const { data: videos, isLoading, error } = useGetVideosQuery();

    const videoList = isLoading ? (
        <Common.Loader />
    ) : (
        videos?.map((video) => <VideoCard key={video.id} video={video} />)
    );

    return (
        <div className="col-span-full lg:col-auto max-h-[570px] overflow-y-auto bg-secondary rounded-md border border-slate-50/10 divide-y divide-slate-600/30">
            {videoList.length > 0 ? (
                <InfinityScroll
                    dataLength={videoList.length}
                    next={() => {
                        console.log('next');
                    }}
                    hasMore
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
