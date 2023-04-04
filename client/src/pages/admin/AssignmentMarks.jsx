import React, { useState } from 'react';
import Common from '../../components/common';
import {
    useEditAssignmentMarkMutation,
    useGetAssignmentMarksQuery,
} from '../../features/assignmentMark/assignmentMarkAPI';

function AssignmentMarks() {
    const { data: assignmentMarks, isLoading, error } = useGetAssignmentMarksQuery();
    const [editAssignmentMark, { isLoading: editAssignmentMarkLoading }] =
        useEditAssignmentMarkMutation();
    const [formData, setFormData] = useState({
        mark: '',
    });

    const totalAssignmentMarks = assignmentMarks?.length;
    const pendingAssignmentMarks = assignmentMarks?.filter(
        (assignmentMark) => assignmentMark.status === 'pending'
    ).length;

    const submitBtn = (
        <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-400"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
    };

    const handleEditAssignmentMark = (e) => {
        e.preventDefault();
        const assignmentMark = assignmentMarks.find(
            (assMark) => assMark.id === Number(e.target.id)
        );
        editAssignmentMark({
            ...assignmentMark,
            mark: formData.mark,
        });
    };

    const assignmentMarkForm = (id) => (
        <form
            id={id}
            className="flex items-center"
            onSubmit={handleEditAssignmentMark}
            autoComplete="off"
        >
            <input
                type="number"
                name="mark"
                id="mark"
                className="w-20 h-8 px-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                onChange={handleChange}
                required
            />
            <button type="submit" className="ml-2" disabled={editAssignmentMarkLoading}>
                {submitBtn}
            </button>
        </form>
    );

    const assignmentMarkList = isLoading ? (
        <Common.Loader />
    ) : (
        assignmentMarks?.map((assignmentMark) => (
            <tr key={assignmentMark.id}>
                <td className="table-td">{assignmentMark.title}</td>
                <td className="table-td">{new Date(assignmentMark.createdAt).toDateString()}</td>
                <td className="table-td">{assignmentMark.student_name}</td>
                <td className="table-td">
                    {assignmentMark.repo_link.length > 40
                        ? `${assignmentMark.repo_link.substring(0, 40)}...`
                        : assignmentMark.repo_link}
                </td>
                <td className="table-td">
                    {assignmentMark.status === 'pending'
                        ? assignmentMarkForm(assignmentMark.id)
                        : assignmentMark.mark}
                </td>
            </tr>
        ))
    );

    return (
        <div className="px-3 py-20 bg-opacity-10">
            <ul className="assignment-status">
                <li>
                    Total <span>{totalAssignmentMarks}</span>
                </li>
                <li>
                    Pending <span>{pendingAssignmentMarks}</span>
                </li>
                <li>
                    Mark Sent{' '}
                    <span>
                        {totalAssignmentMarks &&
                            pendingAssignmentMarks &&
                            totalAssignmentMarks - pendingAssignmentMarks}
                    </span>
                </li>
            </ul>
            {assignmentMarkList?.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                    <table className="divide-y-1 text-base divide-gray-600 w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Assignment</th>
                                <th className="table-th">Date</th>
                                <th className="table-th">Student Name</th>
                                <th className="table-th">Repo Link</th>
                                <th className="table-th">Mark</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-600/50">{assignmentMarkList}</tbody>
                    </table>
                </div>
            ) : (
                <Common.Info info="No Assignment Marks Found" />
            )}
            {error && <Common.Error error={error} />}
        </div>
    );
}

export default AssignmentMarks;
