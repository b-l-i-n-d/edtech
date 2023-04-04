/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Common } from '../../components';
import {
    useAddQuizMutation,
    useDeleteQuizMutation,
    useEditQuizMutation,
    useGetQuizzesQuery,
} from '../../features/quizzes/quizzesAPI';
import { useGetVideosQuery } from '../../features/videos/videosAPI';

function Quizzes() {
    const { data: quizzes, isLoading, error } = useGetQuizzesQuery();
    const { data: videos, isLoading: isVideosLoading } = useGetVideosQuery();
    const [deleteQuiz] = useDeleteQuizMutation();
    const [addQuiz, { data: addedQuiz, isLoading: isAddedQuizLoading }] = useAddQuizMutation();
    const [editQuiz, { data: editedQuiz, isLoading: isEditedQuizLoading }] = useEditQuizMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('Add Quiz');
    const [isEdit, setIsEdit] = useState(undefined);
    const [formData, setFormData] = useState({
        question: '',
        video_id: '',
        options: [
            { id: 1, option: '', isCorrect: false },
            { id: 2, option: '', isCorrect: false },
            { id: 3, option: '', isCorrect: false },
            { id: 4, option: '', isCorrect: false },
        ],
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

    const resetForm = () => {
        setFormData({
            question: '',
            video_id: '',
            options: [
                { id: 1, option: '', isCorrect: false },
                { id: 2, option: '', isCorrect: false },
                { id: 3, option: '', isCorrect: false },
                { id: 4, option: '', isCorrect: false },
            ],
        });
    };

    const onClose = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: name === 'video_id' ? Number(value) : value }));
    };

    const handleOptionChange = (e, index) => {
        const { name, value } = e.target;
        const options = [...formData.options];
        options[index] = { ...options[index], [name]: value };
        setFormData((prev) => ({ ...prev, options }));
    };

    const handleOptionCheckbox = (e, index) => {
        const { checked } = e.target;
        const options = [...formData.options];
        options[index] = { ...options[index], isCorrect: checked };
        setFormData((prev) => ({ ...prev, options }));
    };

    const handleAddModal = () => {
        setTitle('Add Quiz');
        resetForm();
        setIsModalOpen(true);
        setIsEdit(undefined);
    };

    const handleEditModal = (quiz) => {
        setTitle('Edit Quiz');
        setFormData({
            question: quiz.question,
            video_id: quiz.video_id,
            options: quiz.options,
        });
        setIsModalOpen(true);
        setIsEdit(quiz.id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            editQuiz({
                id: isEdit,
                ...formData,
                video_title: videos?.find((video) => video.id === formData.video_id)?.title,
            });
        } else {
            addQuiz({
                ...formData,
                video_title: videos?.find((video) => video.id === formData.video_id)?.title,
            });
        }
        resetForm();
    };

    const handleDelete = (id) => {
        deleteQuiz(id);
    };

    useEffect(() => {
        if (addedQuiz || editedQuiz) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addedQuiz, editedQuiz]);

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
            {!isVideosLoading &&
                videos.map((video) => (
                    <option key={video.id} value={video.id}>
                        {video.title}
                    </option>
                ))}
        </select>
    );

    const quizForm = (
        <form id="modalForm" onSubmit={handleSubmit}>
            <div className="flex flex-col">
                <label htmlFor="question">Title</label>
                <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                    required
                />
            </div>
            <div className="flex flex-col mt-4">
                <label htmlFor="video_id">Select Video</label>
                {selectVideo}
            </div>
            <div className="flex flex-col mt-4">
                <label htmlFor="options">Options</label>
                {formData.options.map((option, index) => (
                    <div key={option.id} className="flex flex-col mt-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`isCorrect${index}`}
                                name={`isCorrect${index}`}
                                checked={option.isCorrect}
                                onChange={(e) => handleOptionCheckbox(e, index)}
                                className="mr-2"
                            />
                            <label htmlFor={`isCorrect${index}`}>Is Correct</label>
                        </div>
                        <input
                            type="text"
                            id="option"
                            name="option"
                            value={option.option}
                            onChange={(e) => handleOptionChange(e, index)}
                            placeholder="Enter option"
                            className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                            required
                        />
                    </div>
                ))}
            </div>
        </form>
    );

    const quizItems = isLoading ? (
        <Common.Loader />
    ) : (
        quizzes.map((quiz) => (
            <tr key={quiz.id}>
                <td className="table-td">
                    {quiz.question.length > 50
                        ? `${quiz.question.substring(0, 50)}...`
                        : quiz.question}
                </td>
                <td className="table-td">{quiz.video_title}</td>
                <td className="table-td flex gap-x-2 justify-center">
                    <button type="button" onClick={() => handleDelete(quiz.id)}>
                        {deleteBtn}
                    </button>
                    <button type="button" onClick={() => handleEditModal(quiz)}>
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
                    Add Quiz
                </button>
            </div>
            {quizItems?.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                    <table className="divide-y-1 text-base divide-gray-600 w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Question</th>
                                <th className="table-th">Video</th>
                                <th className="table-th justify-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-600/50">{quizItems}</tbody>
                    </table>
                </div>
            ) : (
                <Common.Info info="No Quizzes Found" />
            )}
            {error && <Common.Error error={error} />}
            <Common.Modal
                title={title}
                open={isModalOpen}
                onClose={onClose}
                onOk={handleSubmit}
                confirmLoading={isAddedQuizLoading || isEditedQuizLoading}
            >
                {quizForm}
            </Common.Modal>
        </div>
    );
}

export default Quizzes;