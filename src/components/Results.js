import styles from "./Results.module.css";

const Results = ({ answeredCorrectly, totalQuestionsAmount, onReset }) => {
    return (
        <div className={styles.results}>
            <h1>
                {" "}
                Your result is {answeredCorrectly} correct answer out of{" "}
                {totalQuestionsAmount} questions!
            </h1>
            <button onClick={onReset} className="btn">
                Start again
            </button>
        </div>
    );
};

export default Results;
