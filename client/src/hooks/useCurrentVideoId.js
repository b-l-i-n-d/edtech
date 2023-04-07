import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetVideosQuery } from '../features/videos/videosAPI';
import { videoSelected } from '../features/videos/videosSlice';

// This hook is used to make sure all the data is loaded before rendering the app
export default function useCurrentVideoId() {
    const dispatch = useDispatch();
    const [isCurrentVideoIdLoaded, setIsCurrentVideoIdLoaded] = useState(false);
    const { data: videos } = useGetVideosQuery();

    useEffect(() => {
        const currentVideoId = localStorage?.getItem('currentVideoId');
        if (currentVideoId) {
            dispatch(videoSelected(currentVideoId));
        } else if (!currentVideoId && videos?.length > 0) {
            localStorage.setItem('currentVideoId', JSON.stringify(videos[0].id));
            dispatch(videoSelected(videos[0].id));
        }
        setIsCurrentVideoIdLoaded(true);
    }, [dispatch, videos]);

    return isCurrentVideoIdLoaded;
}
