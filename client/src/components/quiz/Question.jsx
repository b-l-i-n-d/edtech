import React from 'react';

function Question({ quiz, count, selectedOption, setSelectedOption, isSubmitted }) {
    const { question, options } = quiz;

    const handleChange = (e) => {
        // if checked the add to selctedOption array as {quizId: quizId, optionId: [optionId]} and if quizId is already in the array then add optionId to the optionId array
        const { id, checked } = e.target;
        const quizId = quiz.id;
        const optionId = Number(id.split('-')[1]);

        if (checked) {
            const index = selectedOption.findIndex((option) => option.quizId === quizId);
            if (index !== -1) {
                const { optionId: selectedOptionId } = selectedOption[index];
                const newOptionId = [...selectedOptionId, optionId];
                const newSelectedOption = [
                    ...selectedOption.slice(0, index),
                    { quizId, optionId: newOptionId },
                    ...selectedOption.slice(index + 1),
                ];
                setSelectedOption(newSelectedOption);
            } else {
                setSelectedOption([...selectedOption, { quizId, optionId: [optionId] }]);
            }
        } else {
            // if unchecked then remove from selectedOption array
            const index = selectedOption.findIndex((option) => option.quizId === quizId);
            const { optionId: selectedOptionId } = selectedOption[index];
            const newOptionId = selectedOptionId.filter((qid) => qid !== optionId);
            const newSelectedOption = [
                ...selectedOption.slice(0, index),
                { quizId, optionId: newOptionId },
                ...selectedOption.slice(index + 1),
            ];
            setSelectedOption(newSelectedOption);
        }
    };

    const optionList = isSubmitted
        ? options.map((option) => (
              <label
                  key={`${count}-${option.id}`}
                  htmlFor={`${count}-${option.id}`}
                  style={{
                      cursor: 'not-allowed',
                      backgroundColor: option.isCorrect && '#06b6d4',
                  }}
              >
                  <input
                      type="checkbox"
                      id={`${count}-${option.id}`}
                      checked={option.isCorrect}
                      disabled
                  />
                  {option.option}
              </label>
          ))
        : options.map((option) => (
              <label key={`${count}-${option.id}`} htmlFor={`${count}-${option.id}`}>
                  <input
                      type="checkbox"
                      id={`${count}-${option.id}`}
                      onChange={handleChange}
                      checked={selectedOption.some((slctOption) => {
                          if (slctOption.quizId === quiz.id) {
                              return slctOption.optionId.includes(option.id);
                          }
                          return false;
                      })}
                  />
                  {option.option}
              </label>
          ));

    return (
        <div className="quiz">
            <h4 className="question">
                Quiz {count} - {question}
            </h4>
            <form className="quizOptions">{optionList}</form>
        </div>
    );
}

export default Question;
