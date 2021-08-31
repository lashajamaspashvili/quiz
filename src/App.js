import "./App.css";

import { useReducer, useEffect } from "react";
import * as constants from './constants';

import Form from "./components/Form";
import QuestionCard from "./components/QuestionCard";
import Loading from "./components/ui/Loading";
import Results from "./components/Results";

let isInitial = true;

const initialBaseState = {
  number: "",
  category: "",
  difficulty: "",
  isLoading: false,
  showForm: true
};

const baseReducer = (state, action) => {
  switch (action.type) {
    case constants.FETCH_START:
      return {
        ...action.payload,
        isLoading: true,
        showForm: false
      };
    case constants.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case constants.RESET:
      return initialBaseState;
    default:
      throw new Error({ message: "Something went wrong" });
  }
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case constants.QUIZ_START:
      const data = action.payload.data;

      return {
        quizDone: false,
        allQuestions: data,
        answeredCorrectly: 0,
        totalQuestionsAmount: data.length,
        currentQuestionIdx: 0,
        currentQuestion: data[0].question,
        currentQuestionAnswers: data[0].allAnswers,
        correctCurrentAnswer: data[0].correctAnswer
      };
    case constants.NEXT_QUESTION:
      return {
        ...state,
        answeredCorrectly: action.payload.correct
          ? state.answeredCorrectly + 1
          : state.answeredCorrectly,
        currentQuestionIdx: state.currentQuestionIdx + 1,
        currentQuestion:
          state.allQuestions[state.currentQuestionIdx + 1].question,
        currentQuestionAnswers:
          state.allQuestions[state.currentQuestionIdx + 1].allAnswers,
        correctCurrentAnswer:
          state.allQuestions[state.currentQuestionIdx + 1].correctAnswer
      };
    case constants.QUIZ_FINISH:
      return {
        ...state,
        answeredCorrectly: action.payload.correct
          ? state.answeredCorrectly + 1
          : state.answeredCorrectly,
        quizDone: true
      };
    case constants.RESET:
      isInitial = true;
      return initialQuizState;
    default:
      throw new Error({ message: "Something went wrong!" });
  }
};

const initialQuizState = {
  allQuestions: [],
  totalQuestionsAmount: "",
  currentQuestionIdx: "",
  currentQuestionAnswers: [],
  answeredCorrectly: 0,
  quizDone: false
};

export default function App() {
  const [baseState, dispatchBase] = useReducer(baseReducer, initialBaseState);
  const [quizState, dispatchQuiz] = useReducer(quizReducer, initialQuizState);

  const { showForm, number, category, difficulty, isLoading } = baseState;
  const {
    currentQuestion,
    totalQuestionsAmount,
    currentQuestionAnswers,
    correctCurrentAnswer,
    currentQuestionIdx,
    answeredCorrectly,
    quizDone
  } = quizState;

  useEffect(() => {
    if (isInitial) {
      console.log("Initial!");
      isInitial = false;
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=multiple`
        );

        if (!response.ok) {
          throw new Error({ message: "Something went wrong" });
        }

        const data = await response.json();
        // console.log(data);

        const desiredData = data.results.map((questionData) => {
          return {
            question: questionData.question,
            correctAnswer: questionData.correct_answer,
            allAnswers: [
              questionData.correct_answer,
              ...questionData.incorrect_answers
            ].sort(() => Math.random() - 0.5)
          };
        });

        console.log(desiredData);

        dispatchQuiz({
          type: constants.QUIZ_START,
          payload: { data: desiredData }
        });
        dispatchBase({ type: constants.FETCH_SUCCESS });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [number, category, difficulty]);

  const enteredDataHandler = (enteredData) => {
    if (!enteredData.number) {
      alert("Please enter number of questions!");
      return;
    }
    dispatchBase({ type: constants.FETCH_START, payload: { ...enteredData } });
  };

  const nextQuestionCheckHandler = (answeredCorrectly) => {
    if (currentQuestionIdx === totalQuestionsAmount - 1) {
      dispatchQuiz({
        type: constants.QUIZ_FINISH,
        payload: { correct: answeredCorrectly }
      });
    } else {
      dispatchQuiz({
        type: constants.NEXT_QUESTION,
        payload: { correct: answeredCorrectly }
      });
    }
  };

  const resetQuizHandler = () => {
    dispatchQuiz({ type: constants.RESET });
    dispatchBase({ type: constants.RESET });
  };

  return (
    <div className="App">
      {showForm && <Form onEnteredData={enteredDataHandler} />}
      {isLoading && <Loading />}
      {!isLoading && !showForm && !quizDone && (
        <QuestionCard
          onNextQuestion={nextQuestionCheckHandler}
          totalQuestions={totalQuestionsAmount}
          question={currentQuestion}
          correctAnswer={correctCurrentAnswer}
          answers={currentQuestionAnswers}
        />
      )}
      {quizDone && (
        <Results
          onReset={resetQuizHandler}
          answeredCorrectly={answeredCorrectly}
          totalQuestionsAmount={totalQuestionsAmount}
        />
      )}
    </div>
  );
}
