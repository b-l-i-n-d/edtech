/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Common } from '../../components';
import {
    useAddVideoMutation,
    useDeleteVideoMutation,
    useEditVideoMutation,
    useGetVideosQuery,
} from '../../features/videos/videosAPI';

function Videos() {
    const { data: videos, isLoading, error } = useGetVideosQuery();
    const [addVideo, { data: addedVideo, isLoading: isAddedVideoLoading }] = useAddVideoMutation();
    const [editVideo, { data: editedVideo, isLoading: isEditedVideoLoading }] =
        useEditVideoMutation();
    const [deleteVideo] = useDeleteVideoMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('Add Video');
    const [isEdit, setIsEdit] = useState(undefined);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        duration: '',
        views: '',
    });

    const editBtn = (
        <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 hover:text-blue-500 cursor-pointer transition-all"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
        </svg>
    );
    const deleteBtn = (
        <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 hover:text-red-500 cursor-pointer transition-all"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );

    const onClose = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, [e.target.name]: e.target.value }));
    };

    const handleAddModal = () => {
        setIsModalOpen(true);
        setTitle('Add Video');
        setIsEdit(undefined);
    };

    const handleEditModal = (video) => {
        setIsModalOpen(true);
        setTitle('Edit Video');
        setFormData({
            title: video.title,
            description: video.description,
            url: video.url,
            duration: video.duration,
            views: video.views,
        });
        setIsEdit(video.id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            editVideo({ id: isEdit, data: formData });
        } else {
            addVideo(formData);
        }
        setFormData({
            title: '',
            description: '',
            url: '',
            duration: '',
            views: '',
        });
    };

    const handleDelete = (id) => {
        deleteVideo(id);
    };

    const videoForm = (
        <form id="modalForm" className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title" className="block mb-2 text-sm text-white">
                    Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    placeholder="Title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="description" className="block mb-2 text-sm text-white">
                    Description
                </label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    placeholder="Description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm text-white">
                    URL
                </label>
                <input
                    type="url"
                    name="url"
                    id="url"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    placeholder="http://githubrepo.com"
                    required
                    value={formData.url}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="views" className="block mb-2 text-sm text-white">
                    Views
                </label>
                <input
                    type="text"
                    name="views"
                    id="views"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    placeholder="55.5k"
                    required
                    value={formData.views}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="duration" className="block mb-2 text-sm text-white">
                    Duration
                </label>
                <input
                    type="text"
                    name="duration"
                    id="duration"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    placeholder="Duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                />
            </div>
        </form>
    );

    useEffect(() => {
        if (addedVideo || editedVideo) {
            setIsModalOpen(false);
        }
    }, [addedVideo, editedVideo]);

    const videoItems = isLoading ? (
        <Common.Loader />
    ) : (
        videos?.map((video) => (
            <tr key={video.id}>
                <td className="table-td">
                    {video.title.length > 70 ? `${video.title.substring(0, 70)}...` : video.title}
                </td>
                <td className="table-td">
                    {video.description.length > 70
                        ? `${video.description.substring(0, 70)}...`
                        : video.description}
                </td>
                <td className="table-td flex gap-x-2">
                    <button type="button" onClick={() => handleDelete(video.id)}>
                        {deleteBtn}
                    </button>
                    <button type="button" onClick={() => handleEditModal(video)}>
                        {editBtn}
                    </button>
                </td>
            </tr>
        ))
    );

    return (
        <div className="px-3 py-20 bg-opacity-10">
            <div className="w-full flex">
                <button
                    type="button"
                    className="px-3 font-bold py-1 border border-cyan text-black rounded-full text-sm bg-cyan-500 hover:text-cyan-500 hover:bg-transparent ml-auto"
                    onClick={handleAddModal}
                >
                    Add Video
                </button>
            </div>
            {videos?.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                    <table className="divide-y-1 text-base divide-gray-600 w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Video Title</th>
                                <th className="table-th">Description</th>
                                <th className="table-th">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-600/50">{videoItems}</tbody>
                    </table>
                </div>
            ) : (
                <Common.Info info="No videos found" />
            )}
            {error && <Common.Error error={error} />}
            <Common.Modal
                title={title}
                open={isModalOpen}
                onClose={onClose}
                onOk={handleSubmit}
                confirmLoading={isAddedVideoLoading || isEditedVideoLoading}
            >
                {videoForm}
            </Common.Modal>
        </div>
    );
}

export default Videos;
