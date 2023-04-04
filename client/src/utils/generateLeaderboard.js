const generateLeaderboard = (usersData, quizMarksData, assignmentMarksData, limit) => {
    const leaderboard = [];
    let rank = 0;
    let prevTotal = 0;

    usersData
        .filter((user) => user.role === 'student')
        .forEach((user) => {
            // find all quiz marks of user
            const userQuizMarks = quizMarksData.filter(
                (quizMark) => quizMark.student_id === user.id
            );

            // find all assignment marks of user
            const userAssignmentMarks = assignmentMarksData.filter(
                (assignmentMark) => assignmentMark.student_id === user.id
            );

            // calculate only total of quiz.mark
            const quizMark = userQuizMarks.reduce((mark, qMark) => mark + qMark.mark, 0);

            // calculate total assignment marks
            const assignmentMark = userAssignmentMarks.reduce(
                (mark, assMark) => mark + assMark.mark,
                0
            );

            // calculate total marks
            const total = quizMark + assignmentMark;

            // push user to leaderboard
            leaderboard.push({
                id: user.id,
                name: user.name,
                quizMark,
                assignmentMark,
                total,
            });
        });

    leaderboard.sort((a, b) => b.total - a.total);
    const rankedLeaderBoard = leaderboard.map((user) => {
        if (user.total !== prevTotal) {
            rank += 1;
            prevTotal = user.total;
        }
        return { ...user, rank };
    });

    if (limit) {
        return rankedLeaderBoard.slice(0, limit);
    }

    return rankedLeaderBoard;
};

export default generateLeaderboard;
