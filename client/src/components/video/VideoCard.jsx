import React from 'react';
import { Link, useParams } from 'react-router-dom';

function VideoCard({ video }) {
    const { currentVideoId } = useParams();
    const { id, title, views, duration } = video;

    return (
        <Link to={`/videos/${id}`}>
            <div
                className={`w-full flex flex-row gap-2 cursor-pointer p-2 py-3 ${
                    id === Number(currentVideoId)
                        ? 'bg-slate-600 hover:bg-slate-700'
                        : 'hover:bg-slate-900'
                }`}
            >
                {/* <!-- Thumbnail --> */}
                <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                    />
                </svg>
                {/* <!-- Description --> */}
                <div clas="flex flex-col w-full">
                    <p className="text-slate-50 text-sm font-medium">{title}</p>

                    <div
                        className={`${
                            id === Number(currentVideoId) ? 'text-white' : 'text-gray-400'
                        }`}
                    >
                        <span className="text-xs mt-1">{duration}</span>
                        <span className="text-xs mt-1"> | </span>
                        <span className="text-xs mt-1">{views} views</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;
