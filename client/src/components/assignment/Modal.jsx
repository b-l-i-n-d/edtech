/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useAddAssignmentMarkMutation } from '../../features/assignmentMark/assignmentMarkAPI';

function Modal({ name, assignment, assignmentData, setSubmittedAssignment }) {
    const [showModal, setShowModal] = useState(false);
    const [fromDate, setFromDate] = useState({
        repo_link: '',
    });
    const [addAssignmentMark, { data, isLoading }] = useAddAssignmentMarkMutation();
    const { id, title, totalMark } = assignment || {};

    const handleChange = (e) => {
        setFromDate({ ...fromDate, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addAssignmentMark({
            ...fromDate,
            assignment_id: id,
            title,
            totalMark,
        });
    };

    useEffect(() => {
        if (data) {
            setShowModal(false);
            setSubmittedAssignment(data);
        }
    }, [data, setSubmittedAssignment]);

    return (
        <>
            <button
                className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                type="button"
                onClick={() => setShowModal(true)}
            >
                {name || 'Modal'}
            </button>
            {showModal ? (
                <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full bg-slate-900 bg-opacity-70 flex justify-center items-center">
                    <div className="relative w-full h-full max-w-2xl md:h-auto">
                        <div className="relative rounded-lg shadow bg-slate-900 p-5 space-y-6">
                            <div className="flex items-start justify-between rounded-t">
                                <h3 className="text-xl font-semibold text-white">
                                    {assignment ? title : 'আপনি এসাইনমেন্ট এ যা জমা দিয়েছেন'}
                                </h3>
                                <button
                                    type="button"
                                    className="text-slate-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
                                    data-modal-hide="defaultModal"
                                    onClick={() => setShowModal(false)}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            {!assignmentData ? (
                                <>
                                    <form
                                        id="modalForm"
                                        className="space-y-6"
                                        onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm text-white"
                                            >
                                                Github Repository Link
                                            </label>
                                            <input
                                                type="url"
                                                name="repo_link"
                                                id="repo_link"
                                                className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                                                placeholder="http://githubrepo.com"
                                                required
                                                value={fromDate.repo_link}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </form>
                                    <div className="flex items-center justify-between rounded-b">
                                        <div>
                                            <span className="text-sm font-medium text-white">
                                                Total Marks: {totalMark}
                                            </span>
                                        </div>
                                        <div className="space-x-2 flex items-center">
                                            <button
                                                form="modalForm"
                                                className="inline-flex px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                {isLoading && (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                        viewBox="0 0 100 101"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"
                                                        />
                                                    </svg>
                                                )}
                                                Submit
                                            </button>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                type="button"
                                                className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm  hover:bg-red-500
                                        hover:text-white
                                        hover:border-transparent"
                                            >
                                                Cancle
                                            </button>
                                        </div>
                                    </div>{' '}
                                </>
                            ) : (
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
                                                    {assignmentData.repo_link}
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default Modal;
