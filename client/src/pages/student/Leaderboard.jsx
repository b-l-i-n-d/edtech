import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllAssignmentMarksQuery } from '../../features/assignmentMark/assignmentMarkAPI';
import { useGetQuizMarksQuery } from '../../features/quizMark/quizMark';
import { useGetUsersQuery } from '../../features/users/usersAPI';
import { generateLeaderboard } from '../../utils';

function Leaderboard() {
    const currentUser = useSelector((state) => state.auth.user);
    const { data: users } = useGetUsersQuery();
    const { data: quizMarks } = useGetQuizMarksQuery();
    const { data: assignmentMarks } = useGetAllAssignmentMarksQuery();

    const generatedLeaderboard = useMemo(
        () =>
            users &&
            quizMarks &&
            assignmentMarks &&
            generateLeaderboard(users, quizMarks, assignmentMarks, 20),
        [assignmentMarks, quizMarks, users]
    );

    const leaderboardRows = generatedLeaderboard?.map((user) => (
        <tr key={user.id} className="border-b border-slate-600/50">
            <td className="table-td text-center">{user.rank}</td>
            <td className="table-td text-center">{user.name}</td>
            <td className="table-td text-center">{user.quizMark}</td>
            <td className="table-td text-center">{user.assignmentMark}</td>
            <td className="table-td text-center">{user.total}</td>
        </tr>
    ));

    const currentUserPosition = generatedLeaderboard?.find((user) => user.id === currentUser.id);

    const currentUserRow = currentUserPosition && (
        <tr className="border-2 border-cyan">
            <td className="table-td text-center font-bold">{currentUserPosition.rank}</td>
            <td className="table-td text-center font-bold">{currentUser.name}</td>
            <td className="table-td text-center font-bold">{currentUserPosition.quizMark}</td>
            <td className="table-td text-center font-bold">
                {currentUserPosition?.assignmentMark}
            </td>
            <td className="table-td text-center font-bold">{currentUserPosition.total}</td>
        </tr>
    );

    return (
        <>
            <div>
                <h3 className="text-lg font-bold">Your Position in Leaderboard</h3>
                <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
                    <thead>
                        <tr>
                            <th className="table-th !text-center">Rank</th>
                            <th className="table-th !text-center">Name</th>
                            <th className="table-th !text-center">Quiz Mark</th>
                            <th className="table-th !text-center">Assignment Mark</th>
                            <th className="table-th !text-center">Total</th>
                        </tr>
                    </thead>

                    <tbody>{currentUserRow}</tbody>
                </table>
            </div>

            <div className="my-8">
                <h3 className="text-lg font-bold">Top 20 Result</h3>
                <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
                    <thead>
                        <tr className="border-b border-slate-600/50">
                            <th className="table-th !text-center">Rank</th>
                            <th className="table-th !text-center">Name</th>
                            <th className="table-th !text-center">Quiz Mark</th>
                            <th className="table-th !text-center">Assignment Mark</th>
                            <th className="table-th !text-center">Total</th>
                        </tr>
                    </thead>

                    <tbody>{leaderboardRows}</tbody>
                </table>
            </div>
        </>
    );
}

export default Leaderboard;
