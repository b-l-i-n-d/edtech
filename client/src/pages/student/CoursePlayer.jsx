/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Common, Video } from '../../components';
import {
    useAddAssignmentMarkMutation,
    useGetAssignmentMarksByAssignmentIdQuery,
} from '../../features/assignmentMark/assignmentMarkAPI';
import { useGetAssignmentsByVideoIdQuery } from '../../features/assignments/assignmentsAPI';
import { useGetQuizMarkByVideoIdQuery } from '../../features/quizMark/quizMark';
import { useGetQuizzesByVideoIdQuery } from '../../features/quizzes/quizzesAPI';
import { useGetVideoQuery } from '../../features/videos/videosAPI';
import { videoSelected } from '../../features/videos/videosSlice';

function CoursePlayer() {
    const { currentVideoId } = useParams();
    const dispatch = useDispatch();
    const { data: video, isLoading: isGetVideoLoading, error } = useGetVideoQuery(currentVideoId);
    const { data: assignment } = useGetAssignmentsByVideoIdQuery(currentVideoId);
    const { data: assignmentMark, isLoading: isGetAssignmentMarkLoading } =
        useGetAssignmentMarksByAssignmentIdQuery(currentVideoId);
    const { data: quizMark, isLoading: isGetQuizMarkLoading } =
        useGetQuizMarkByVideoIdQuery(currentVideoId);
    const { data: quiz, isLoading: isGetQuizLoading } = useGetQuizzesByVideoIdQuery(currentVideoId);
    const [
        addAssignmentMark,
        { data: addedAssignmentMark, isLoading: isAddAssignmentMarkLoading },
    ] = useAddAssignmentMarkMutation();
    const [submittedAssignment, setSubmittedAssignment] = useState(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [formData, setFormData] = useState({
        repo_link: '',
    });

    if (currentVideoId) {
        localStorage.setItem('currentVideoId', currentVideoId);
        dispatch(videoSelected(currentVideoId));
    }

    const resetForm = () => {
        setFormData({
            repo_link: '',
        });
    };

    const onClose = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsModalOpen(false);
        addAssignmentMark({
            assignment_id: assignment.id,
            repo_link: formData.repo_link,
            title: assignment.title,
            totalMark: assignment.totalMark,
        });
    };

    const handleAddModal = () => {
        setIsModalOpen(true);
        setTitle(assignment.title);
        resetForm();
    };

    const handleShowModal = () => {
        setIsModalOpen(true);
        setTitle(assignment.title);
        resetForm();
    };

    const assignmentMarkForm = (
        <form id="modalForm" className="space-y-6" onSubmit={handleSubmit}>
            <label htmlFor="email" className="block mb-2 text-sm text-white">
                Github Repository Link
            </label>
            <input
                type="url"
                name="repo_link"
                id="repo_link"
                className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                placeholder="http://githubrepo.com"
                required
                value={formData.repo_link}
                onChange={handleChange}
            />
            <p className="font-bold">Total mark: {assignment?.totalMark}</p>
        </form>
    );

    const showModal = (
        <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs  uppercase bg-gray-50 dark:bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Github Repository Link
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {submittedAssignment?.repo_link}
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const assignmentBtn = () => {
        if (!submittedAssignment && assignment) {
            return (
                <button
                    className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                    type="button"
                    onClick={handleAddModal}
                >
                    এসাইনমেন্ট
                </button>
            );
        }

        if (submittedAssignment) {
            return (
                <>
                    <span className="px-3 font-bold py-1 text-white rounded-full text-sm bg-gradient-to-r from-cyan-600 to-blue-700">
                        সর্বমোট নাম্বার - {submittedAssignment?.totalMark}
                    </span>
                    <span className="px-3 font-bold py-1 text-white rounded-full text-sm bg-gradient-to-r from-blue-600 from-10% to-green-600 to-90%">
                        প্রাপ্ত নাম্বার -{' '}
                        {submittedAssignment?.status === 'published'
                            ? submittedAssignment?.mark
                            : submittedAssignment?.status}
                    </span>
                    <button
                        className="px-3 font-bold py-1 border border-cyan text-black rounded-full text-sm bg-cyan-500 hover:bg-white transition-all duration-300"
                        type="button"
                        onClick={handleShowModal}
                    >
                        আপনি যা জমা দিয়েছেন
                    </button>
                </>
            );
        }

        return null;
    };

    const quizBtn = () => {
        if (!isGetQuizMarkLoading && quizMark) {
            return (
                <Link
                    to="quiz"
                    className="px-3 font-bold py-1 text-white rounded-full text-sm bg-gradient-to-r from-cyan-600 to-blue-700"
                >
                    কুইজ দিয়েছেন
                </Link>
            );
        }
        if (!isGetQuizLoading && quiz) {
            return (
                <Link
                    to="quiz"
                    className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                >
                    কুইজে অংশগ্রহণ করুন
                </Link>
            );
        }

        return null;
    };

    useEffect(() => {
        if (!isGetAssignmentMarkLoading && assignmentMark) {
            setSubmittedAssignment(assignmentMark);
        } else if (!isAddAssignmentMarkLoading && addedAssignmentMark) {
            setSubmittedAssignment(addedAssignmentMark);
        }
        if (!assignment || (!assignmentMark && !addedAssignmentMark)) {
            setSubmittedAssignment(null);
        }
    }, [
        addedAssignmentMark,
        assignment,
        assignmentMark,
        isAddAssignmentMarkLoading,
        isGetAssignmentMarkLoading,
    ]);

    return (
        <div className="grid grid-cols-3 gap-2 lg:gap-8">
            <div className="col-span-full w-full space-y-8 lg:col-span-2">
                {isGetVideoLoading ? (
                    <Common.Loader />
                ) : (
                    <>
                        <iframe
                            width="100%"
                            className="aspect-video"
                            src={video?.url}
                            title="Things I wish I knew as a Junior Web Developer - Sumit Saha - BASIS SoftExpo 2023"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />

                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-slate-100">
                                {video?.title}
                            </h1>
                            <h2 className=" pb-4 text-sm leading-[1.7142857] text-slate-400">
                                Uploaded on {new Date(video?.createdAt).toDateString()}
                            </h2>

                            <div className="flex gap-4">
                                {assignmentBtn()}

                                {quizBtn()}
                            </div>
                            <p className="mt-4 text-sm text-slate-400 leading-6">
                                {video?.description}
                            </p>
                        </div>
                        {error && <Common.Error message={error.data} />}
                    </>
                )}
            </div>
            <Video.VideoList />
            <Common.Modal
                title={title}
                open={isModalOpen}
                onOk={handleSubmit}
                onClose={onClose}
                confirmLoading={isAddAssignmentMarkLoading}
                disableSubmit={!!submittedAssignment}
            >
                {!submittedAssignment ? assignmentMarkForm : showModal}
            </Common.Modal>
        </div>
    );
}

export default CoursePlayer;
