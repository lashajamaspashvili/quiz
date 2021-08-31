import styles from "./Form.module.css";
import { useRef } from "react";

const Form = ({ onEnteredData }) => {
  const numberRef = useRef();
  const categoryRef = useRef();
  const difficultyRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const data = {
      number: numberRef.current.value,
      category: categoryRef.current.value,
      difficulty: difficultyRef.current.value
    };

    console.log(data);
    onEnteredData(data);
  };

  return (
    <form onSubmit={submitHandler} className={styles.form}>
      <h1>Welcome!</h1>
      <p>Please choose category and difficulty!</p>

      <label htmlFor="number">number</label>
      <input
        ref={numberRef}
        placeholder="1-10"
        type="number"
        id="number"
        min="1"
        max="10"
      />

      <label htmlFor="category">category</label>
      <select ref={categoryRef} id="category">
        <option value="15">Entertainment: Video Games</option>
        <option value="12">Entertainment: Music</option>
        <option value="14">Entertainment: Television</option>
      </select>

      <label htmlFor="difficulty">difficulty</label>
      <select ref={difficultyRef} id="difficulty">
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>

      <button className="btn" type="submit">
        Start quiz
      </button>
    </form>
  );
};

export default Form;
