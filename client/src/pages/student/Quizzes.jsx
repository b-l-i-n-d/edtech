/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Quiz } from '../../components';
import Common from '../../components/common';
import {
    useAddQuizMarkMutation,
    useGetQuizMarkByVideoIdQuery,
} from '../../features/quizMark/quizMark';
import { useGetQuizzesByVideoIdQuery } from '../../features/quizzes/quizzesAPI';
import { useGetVideoQuery } from '../../features/videos/videosAPI';

function Quizzes() {
    const { currentVideoId } = useParams();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState({
        mark: 0,
        totalMark: 0,
    });
    const { data: video } = useGetVideoQuery(currentVideoId);
    const {
        data: quizzes,
        isLoading: isGetQuizLoading,
        error,
    } = useGetQuizzesByVideoIdQuery(currentVideoId);
    const [addQuizMark, { data: addedQuizMark, isLoading: isAddQuizMarkLoading }] =
        useAddQuizMarkMutation();
    const { data: quizMark, isLoading: isGetQuizMarkLoading } =
        useGetQuizMarkByVideoIdQuery(currentVideoId);

    const correctAnswer =
        !isGetQuizLoading &&
        quizzes?.map((quiz) => {
            const { id: quizId } = quiz;
            const optionId = quiz.options
                .filter((option) => option.isCorrect)
                .map((option) => option.id);

            return { quizId, optionId };
        });

    let quizCount = 0;
    const quizList =
        !isGetQuizLoading &&
        !isGetQuizMarkLoading &&
        quizzes?.map((quiz) => (
            <Quiz.Question
                key={quiz.id}
                quiz={quiz}
                count={++quizCount}
                isSubmitted={isSubmitted}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />
        ));

    const handleSubmit = () => {
        let correctCount = 0;
        correctAnswer.forEach((correct) => {
            const { quizId, optionId } = correct;
            const index = selectedOption.findIndex((option) => option.quizId === quizId);

            if (index !== -1) {
                const { optionId: selectedOptionId } = selectedOption[index];
                if (optionId.length === selectedOptionId.length) {
                    const isSame = optionId.every((id) => selectedOptionId.includes(id));
                    if (isSame) {
                        correctCount++;
                    }
                }
            }
        });

        addQuizMark({
            video_id: video.id,
            video_title: video.title,
            totalQuiz: quizzes.length,
            totalCorrect: correctCount,
            totalWrong: quizzes.length - correctCount,
            totalMark: quizzes.length * 5,
            mark: correctCount * 5,
        });
        setSelectedOption([]);
        navigate('/leaderboard');
    };

    useEffect(() => {
        if (!isAddQuizMarkLoading && addedQuizMark) {
            setIsSubmitted(true);
            setResult((prev) => ({
                ...prev,
                mark: addedQuizMark.mark,
                totalMark: addedQuizMark.totalMark,
            }));
        }
        if (!isGetQuizMarkLoading && quizMark) {
            setIsSubmitted(true);
            setResult((prev) => ({
                ...prev,
                mark: quizMark.mark,
                totalMark: quizMark.totalMark,
            }));
        }
    }, [addedQuizMark, isAddQuizMarkLoading, isGetQuizMarkLoading, quizMark]);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Quizzes for &quot;{video?.title}&quot;</h1>
                <p className="text-sm text-slate-200">Each question contains 5 Mark</p>

                {isSubmitted && (
                    <div className="mt-4">
                        <span className="text-lg text-slate-200">Your Mark: </span>
                        <span className="text-lg text-cyan ml-2 font-bold">
                            {result.mark} / {result.totalMark}
                        </span>
                        <p>
                            Correct answers are marked in{' '}
                            <span className="text-cyan-500 font-bold">cyan.</span>
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-8 ">{quizList}</div>

            {error && <Common.Error error={error} />}

            <button
                type="button"
                className={`px-4 py-2 rounded-full block ml-auto mt-8 border border-cyan bg-blue-500   ${
                    isSubmitted
                        ? 'opacity-50 cursor-not-allowed pointer-events-none'
                        : 'hover:opacity-90 active:opacity-100 active:scale-95'
                }}`}
                onClick={handleSubmit}
                disabled={!isGetQuizMarkLoading && quizMark}
            >
                {isSubmitted ? 'Submitted' : 'Submit'}
            </button>
        </>
    );
}

export default Quizzes;
