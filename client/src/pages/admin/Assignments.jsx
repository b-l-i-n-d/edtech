/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Common } from '../../components';
import {
    useAddAssignmentMutation,
    useDeleteAssignmentMutation,
    useEditAssignmentMutation,
    useGetAssignmentsQuery,
} from '../../features/assignments/assignmentsAPI';
import { useGetVideosQuery } from '../../features/videos/videosAPI';

function Assignments() {
    const { data: assignments, isLoading, error } = useGetAssignmentsQuery();
    const {
        data: videosData,
        isLoading: isVideoLoading,
        error: getVideosError,
    } = useGetVideosQuery();
    const [deleteAssignment, { data: deletedAssignment, error: deleteAssignmentError }] =
        useDeleteAssignmentMutation();
    const [
        addAssignment,
        { data: addedAssignment, isLoading: isAddedAssignmentLoading, error: addAssignmentError },
    ] = useAddAssignmentMutation();
    const [
        editAssignment,
        {
            data: editedAssignment,
            isLoading: isEditedAssignmentLoading,
            error: editAssignmentError,
        },
    ] = useEditAssignmentMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('Add Assignment');
    const [isEdit, setIsEdit] = useState(undefined);
    const [formData, setFormData] = useState({
        title: '',
        video_id: '',
        totalMark: 0,
    });

    const { videos } = videosData || {};
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
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'totalMark' || name === 'video_id' ? Number(value) : value,
        }));
    };

    const handleAddModal = () => {
        setFormData({
            title: '',
            video_id: '',
            totalMark: 0,
        });
        setIsModalOpen(true);
        setTitle('Add Video');
        setIsEdit(undefined);
    };

    const handleEditModal = (assignment) => {
        setIsModalOpen(true);
        setTitle('Edit Assignment');
        setFormData({
            title: assignment.title,
            video_id: assignment.video_id,
            totalMark: assignment.totalMark,
        });
        setIsEdit(assignment.id);
    };

    const handleDelete = (id) => {
        deleteAssignment(id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            editAssignment({
                id: isEdit,
                ...formData,
                video_title: videos?.find((video) => video.id === formData.video_id)?.title,
            });
        } else {
            addAssignment({
                ...formData,
                video_title: videos?.find((video) => video.id === formData.video_id)?.title,
            });
        }
        setFormData({
            title: '',
            video_id: '',
            totalMark: 0,
        });
    };

    useEffect(() => {
        if (addedAssignment || editedAssignment) {
            setIsModalOpen(false);
        }
    }, [addedAssignment, editedAssignment]);

    const filteredVideos =
        !isVideoLoading &&
        videos?.filter(
            (video) =>
                !assignments?.find((assignment) => assignment.video_id === video.id) ||
                assignments?.find((assignment) => assignment.video_id === video.id)?.id === isEdit
        );

    const selectVideo = (
        <select
            name="video_id"
            id="video_id"
            value={formData.video_id}
            onChange={handleChange}
            className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            required
        >
            <option value="" hidden>
                Select Video
            </option>
            {filteredVideos &&
                filteredVideos?.map((video) => (
                    <option key={video.id} value={video.id}>
                        {video.title}
                    </option>
                ))}
        </select>
    );

    const assignmentForm = (
        <form id="modalForm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder='Enter "title"'
                    value={formData.title}
                    onChange={handleChange}
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="video_id">Select Video</label>
                {selectVideo}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="totalMark">Total Mark</label>
                <input
                    type="number"
                    name="totalMark"
                    id="totalMark"
                    placeholder='Enter "totalMark"'
                    value={formData.totalMark}
                    onChange={handleChange}
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    required
                />
            </div>
        </form>
    );

    const assignmentItems = isLoading ? (
        <Common.Loader />
    ) : (
        assignments?.map((assignment) => (
            <tr key={assignment.id}>
                <td className="table-td">{assignment.title}</td>
                <td className="table-td">{assignment.video_title}</td>
                <td className="table-td">{assignment.totalMark}</td>
                <td className="table-td flex gap-2">
                    <button type="button" onClick={() => handleDelete(assignment.id)}>
                        {deleteBtn}
                    </button>
                    <button type="button" onClick={() => handleEditModal(assignment)}>
                        {editBtn}
                    </button>
                </td>
            </tr>
        ))
    );

    return (
        <div className="px-3 py-10 bg-opacity-10">
            {(error ||
                addAssignmentError ||
                editAssignmentError ||
                deleteAssignmentError ||
                getVideosError) && (
                <Common.Error
                    error={
                        error ||
                        addAssignmentError ||
                        editAssignmentError ||
                        deleteAssignmentError ||
                        getVideosError
                    }
                />
            )}

            {(addedAssignment || editedAssignment || deletedAssignment) && (
                <Common.Success
                    success={
                        addedAssignment
                            ? 'Assignment Added Successfully'
                            : editedAssignment
                            ? 'Assignment Edited Successfully'
                            : 'Assignment Deleted Successfully'
                    }
                />
            )}
            <div className="w-full flex">
                <button
                    type="button"
                    className="px-3 font-bold py-1 border border-cyan text-black rounded-full text-sm bg-cyan-500 hover:text-cyan-500 hover:bg-transparent ml-auto"
                    onClick={handleAddModal}
                >
                    Add Assignment
                </button>
            </div>
            {assignmentItems?.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                    <table className="divide-y-1 text-base divide-gray-600 w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Title</th>
                                <th className="table-th">Video Title</th>
                                <th className="table-th">Mark</th>
                                <th className="table-th">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-600/50">{assignmentItems}</tbody>
                    </table>
                </div>
            ) : (
                <Common.Info info="No Assignments Found" />
            )}
            <Common.Modal
                open={isModalOpen}
                onClose={onClose}
                title={title}
                onOk={handleSubmit}
                confirmLoading={isAddedAssignmentLoading || isEditedAssignmentLoading}
            >
                {assignmentForm}
            </Common.Modal>
        </div>
    );
}

export default Assignments;
