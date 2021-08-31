import { useState } from "react";
import Card from "./ui/Card";
import AnswerItem from "./AnswerItem";

const QuestionCard = ({ question, answers, correctAnswer, onNextQuestion }) => {
    const [userAnswered, setUserAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [recordedAnswerId, setRecordedAnswerId] = useState(null);

    const answerHandler = (didAnswerCorrectly, answerId) => {
        setIsCorrect(didAnswerCorrectly);
        setRecordedAnswerId(answerId);
        setUserAnswered(true);
    };

    const nextQuestionHandler = () => {
        setIsCorrect(null);
        setUserAnswered(false);
        setRecordedAnswerId(null);
        onNextQuestion(isCorrect);
    };

    return (
        <Card>
            <h1 dangerouslySetInnerHTML={{ __html: question }} />
            <ul>
                {answers.map((answer, idx) => (
                    <AnswerItem
                        key={idx}
                        id={idx}
                        correct={isCorrect}
                        answer={answer}
                        answered={userAnswered}
                        correctAnswer={correctAnswer}
                        onAnswer={answerHandler}
                        recordedAnswerId={recordedAnswerId}
                    />
                ))}
            </ul>
            <div>
                <button
                    onClick={nextQuestionHandler}
                    disabled={!userAnswered}
                    className="btn"
                >
                    Next Question
                </button>
            </div>
        </Card>
    );
};

export default QuestionCard;
