import Pagination from 'rc-pagination';
import React, { useState } from 'react';
import Common from '../../components/common';
import {
    useEditAssignmentMarkMutation,
    useGetAssignmentMarksByStatusQuery,
    useGetAssignmentMarksQuery,
} from '../../features/assignmentMark/assignmentMarkAPI';

function AssignmentMarks() {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        mark: '',
    });
    const { data: assignmentMarksData, isLoading, error } = useGetAssignmentMarksQuery(currentPage);
    const [
        editAssignmentMark,
        {
            data: edittedAssignmentMark,
            isLoading: editAssignmentMarkLoading,
            error: editAssignmentMarkError,
        },
    ] = useEditAssignmentMarkMutation();
    const { data: assignmentsMarksByStatus, isLoading: isGetAssignmentMarkPendingLoading } =
        useGetAssignmentMarksByStatusQuery('pending');

    const { assignmentMarks, totalCount } = assignmentMarksData || {};
    const pendingMarks = !isGetAssignmentMarkPendingLoading && assignmentsMarksByStatus;

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

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
        editAssignmentMark({
            id: Number(e.target.id),
            data: {
                mark: formData.mark,
            },
            currentPage,
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
                min={0}
                max={assignmentMarks?.totalMark}
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
                <td className="table-td">
                    {assignmentMark.title.length > 30
                        ? `${assignmentMark.title.substring(0, 30)}...`
                        : assignmentMark.title}
                </td>
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
        <div className="px-3 py-10 bg-opacity-10">
            {(error || editAssignmentMarkError) && (
                <Common.Error error={error || editAssignmentMarkError} />
            )}
            {edittedAssignmentMark && <Common.Success message="Assignment Mark Updated" />}

            <ul className="assignment-status">
                <li>
                    Total <span>{totalCount}</span>
                </li>
                <li>
                    Pending <span>{pendingMarks}</span>
                </li>
                <li>
                    Mark Sent <span>{totalCount && pendingMarks && totalCount - pendingMarks}</span>
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

            <div className="mt-5 fixed bottom-10 w-full max-w-7xl flex justify-end">
                <Pagination
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} videos`}
                    total={totalCount}
                    current={currentPage}
                    onChange={onPaginationChange}
                />
            </div>
        </div>
    );
}

export default AssignmentMarks;
