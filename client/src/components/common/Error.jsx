import React from 'react';

function Error({ error }) {
    return (
        <div
            className="p-4 my-5 inline-flex w-full space-x-3 text-sm rounded-lg bg-gray-800 text-red-400"
            role="alert"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span className="font-medium">{error}</span>
        </div>
    );
}

export default Error;
