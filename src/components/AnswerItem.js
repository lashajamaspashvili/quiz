import styles from "./AnswerItem.module.css";

const AnswerItem = ({
    answer,
    answered,
    id,
    recordedAnswerId,
    correct,
    correctAnswer,
    onAnswer
}) => {
    const answerClickHandler = () => {
        if (!answered) {
            if (answer === correctAnswer) {
                console.log("Correct answer!");
                onAnswer(true, id);
            } else {
                console.log("Incorrect answer!");
                onAnswer(false, id);
            }
        }
    };

    let cssClasses = styles.answer;
    // console.log(recordedAnswerId);

    if (recordedAnswerId !== null) {
        if (id === recordedAnswerId)
            cssClasses = !correct && `${styles.answer} ${styles.wrong}`;
        if (answer === correctAnswer)
            cssClasses = `${styles.answer} ${styles.correct}`;
    }


    return (
        <li
            onClick={answerClickHandler}
            id={id}
            dangerouslySetInnerHTML={{ __html: answer }}
            className={cssClasses}
        />
    );
};

export default AnswerItem;
