/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import Pagination from 'rc-pagination';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import { Common } from '../../components';
import {
    useAddAssignmentMutation,
    useDeleteAssignmentMutation,
    useEditAssignmentMutation,
    useGetAssignmentsQuery,
} from '../../features/assignments/assignmentsAPI';
import {
    useGetVideosQuery,
    useLazyGetAllVideosQuery,
    videosAPI,
} from '../../features/videos/videosAPI';
import { useTitle } from '../../hooks';
import { getTotalPageNumber } from '../../utils';

function Assignments() {
    // useTitle is a custom hook to set the title of the page
    useTitle('Assignments');
    const [currentPage, setCurrentPage] = useState(1); // current page of assignments
    const [videosPage, setVideosPage] = useState(1); // current page of videos
    const [hasMore, setHasMore] = useState(true); // check if there are more videos to load
    const [isModalOpen, setIsModalOpen] = useState(false); // check if modal is open
    const [title, setTitle] = useState('Add Assignment'); // title of the modal
    const [isEdit, setIsEdit] = useState(undefined); // check if the modal is for editing
    const [formData, setFormData] = useState({
        title: '',
        video_id: '',
        video_title: '',
        totalMark: 0,
    });
    const dispatch = useDispatch();
    const { data: assignmentsData, isLoading, error } = useGetAssignmentsQuery(currentPage);
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
    const [getAllVideos, { data: allVideosData }] = useLazyGetAllVideosQuery();

    const { assignments, totalCount } = assignmentsData || {};
    const { videos, totalCount: totalVideosCount } = videosData || {};
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

    // reset form data
    const resetForm = () => {
        setFormData({
            title: '',
            video_id: '',
            video_title: '',
            totalMark: 0,
        });
    };

    // handle modal close
    const onClose = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // fetch more videos
    const fetchMoreData = () => {
        if (videos.length >= totalVideosCount) {
            setHasMore(false);
            return;
        }
        setVideosPage((prevPage) => prevPage + 1);
    };

    // fetch new assignments for the current page
    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

    // handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'totalMark' || name === 'video_id' ? Number(value) : value,
        }));
    };

    // handle add modal
    const handleAddModal = () => {
        resetForm();
        setIsModalOpen(true);
        setTitle('Add Video');
        setIsEdit(undefined);
    };

    // handle edit modal
    const handleEditModal = (assignment) => {
        setIsModalOpen(true);
        setTitle('Edit Assignment');
        setFormData({
            title: assignment.title,
            video_id: assignment.video_id,
            video_title: assignment.video_title,
            totalMark: assignment.totalMark,
        });
        setIsEdit(assignment.id);
        getAllVideos();
    };

    // handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            editAssignment({
                id: isEdit,
                data: formData,
                currentPage,
            });
        } else {
            const totalPage = getTotalPageNumber(totalCount);
            addAssignment({
                data: formData,
                totalPage,
            });
        }
        resetForm();
    };

    // handle delete assignment
    const handleDelete = (id) => {
        const totalPage = getTotalPageNumber(totalCount);
        deleteAssignment({
            id,
            currentPage,
            totalPage,
        });
    };

    // filter videos that are not assigned to any assignment
    // when editing an assignment it includes the video that is being edited
    const filteredVideos =
        (!isVideoLoading &&
            videos?.filter(
                (video) =>
                    !assignments?.find((assignment) => assignment.video_id === video.id) ||
                    assignments?.find((assignment) => assignment.video_id === video.id)?.id ===
                        isEdit
            )) ||
        [];

    // select options for videos
    const selectVideoOptions = filteredVideos?.map((video) => ({
        value: video.id,
        label: video.title.length > 60 ? `${video.title.slice(0, 60)}...` : video.title,
    }));

    // select options for all videos
    const allVideosSelectOptions = allVideosData?.map((video) => ({
        value: video.id,
        label: video.title.length > 60 ? `${video.title.slice(0, 60)}...` : video.title,
    }));

    // load options for react-select
    const loadOptions = async () => {
        const transformedOptions = selectVideoOptions;
        const more = hasMore;
        if (more) {
            await fetchMoreData();
        }

        return {
            options: transformedOptions,
            hasMore: more,
        };
    };

    // video select component
    // infinite scroll for adding assignment
    const selectVideo = !isEdit ? (
        <AsyncPaginate
            form="modalForm"
            name="video_id"
            id="video_id"
            defaultOptions
            value={selectVideoOptions?.find((option) => option.value === formData.video_id)}
            loadOptions={loadOptions}
            onChange={(value) =>
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    video_id: value.value,
                    video_title: value.label,
                }))
            }
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            required
        />
    ) : (
        <Select
            form="modalForm"
            name="video_id"
            id="video_id"
            options={allVideosSelectOptions}
            onChange={(value) =>
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    video_id: value.value,
                    video_title: value.label,
                }))
            }
            value={allVideosSelectOptions?.find((option) => option.value === formData.video_id)}
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            required
        />
    );

    // assignment form
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

    // assignment table
    const assignmentItems = isLoading ? (
        <Common.Loader />
    ) : (
        assignments?.map((assignment) => (
            <tr key={assignment.id}>
                <td className="table-td">
                    {assignment.title.length > 50
                        ? `${assignment.title.substring(0, 50)}...`
                        : assignment.title}
                </td>
                <td className="table-td">
                    {assignment.video_title.length > 70
                        ? `${assignment.video_title.substring(0, 50)}...`
                        : assignment.video_title}
                </td>
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

    // close modal when assignment is added or edited successfully
    useEffect(() => {
        if (addedAssignment || editedAssignment) {
            setIsModalOpen(false);
        }
    }, [addedAssignment, editedAssignment]);

    // fetch more videos when videos page is greater than 1
    useEffect(() => {
        if (videosPage > 1) {
            dispatch(videosAPI.endpoints.getMoreVideos.initiate(videosPage));
        }
    }, [videosPage, dispatch]);

    // set hasMore to true if total page is greater than videos page
    useEffect(() => {
        if (totalCount > 0) {
            const more = Math.ceil(totalCount / import.meta.env.VITE_LIMIT_PER_PAGE) > videosPage;
            setHasMore(more);
        }
    }, [totalCount, videosPage]);

    // set current page to total page when assignment is added
    useEffect(() => {
        if (addedAssignment) {
            const totalPage = getTotalPageNumber(totalCount);
            setCurrentPage(totalPage);
        }
    }, [addedAssignment, totalCount]);

    // set current page to total page - 1 when assignment is deleted
    useEffect(() => {
        if (deletedAssignment) {
            const assignmentLengthInCurrentPage = assignments?.length;
            if (assignmentLengthInCurrentPage === 0) {
                setCurrentPage((prevCurrentPage) =>
                    prevCurrentPage > 1 ? prevCurrentPage - 1 : 1
                );
            }
        }
    }, [assignments?.length, deletedAssignment]);

    return (
        <div className="px-3 py-10 bg-opacity-10">
            {/* Error and Success */}
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
                    message={
                        addedAssignment
                            ? 'Assignment Added Successfully'
                            : editedAssignment
                            ? 'Assignment Edited Successfully'
                            : deletedAssignment
                            ? 'Assignment Deleted Successfully'
                            : ''
                    }
                />
            )}

            {/* Add button */}
            <div className="w-full flex">
                <button
                    type="button"
                    className="px-3 font-bold py-1 border border-cyan text-black rounded-full text-sm bg-cyan-500 hover:text-cyan-500 hover:bg-transparent ml-auto"
                    onClick={handleAddModal}
                >
                    Add Assignment
                </button>
            </div>

            {/* Assignments table */}
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

            {/* Pagination */}
            <div className="mt-5 fixed bottom-10 w-full max-w-7xl flex justify-end">
                <Pagination
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} videos`}
                    total={totalCount}
                    current={currentPage}
                    onChange={onPaginationChange}
                />
            </div>

            {/* Modal */}
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
