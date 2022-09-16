import { Button, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Navbar } from "../components/navbar";

import { TakeQuizComponent } from "../components/take-quiz-component";
import { answerSchema } from "../joi-schema/answer-schema";
import { motion } from "framer-motion";
export const TakeQuiz = () => {
  const { id } = useParams();
  const title = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  //get published quiz
  const getQuizByPermaLink = (id) => {
    axios
      .get(`http://localhost:3004/quiz/published/${id}`)
      .then(({ data }) => {
        setError(false);
        title.current = data.title;
        setQuestions([...data.questions]);
      })
      .catch((err) => {
        setError(true);
        toast.error(err.response.data.message);
      });
  };
  let [score, setScore] = useState(null);
  let [error, setError] = useState(false);
  //submit the quiz for score
  const handleSubmitQuiz = () => {
    const { error, value } = answerSchema.validate(answers);
    if (error) {
      toast.error(error.message);
    } else {
      axios
        .post(`http://localhost:3004/quiz/published/${id}`, { answers: value })
        .then(({ data }) => {
          setScore(data);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };
  const navigate = useNavigate();
  const handleRetakeQuiz = () => {
    setScore(null);
    setAnswers([]);
    return navigate(`/take-quiz/${id}`);
  };
  useEffect(() => {
    if (!score) {
      getQuizByPermaLink(id);
    }
  }, [score]);
  const handleCancel = () => {
    navigate("/");
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
    >
      <HomeContainer>
        <Navbar />
        <CreateQuizContainer>
          {!error ? (
            <>
              <h3 className="heading">QUIZ</h3>
              <Typography
                sx={{
                  marginLeft: "15%",
                  marginBottom: "20px",
                  fontSize: "20px",
                  fontWeight: "300",
                }}
              >
                Title : {title.current}
              </Typography>
              {!score ? (
                <>
                  <div>
                    {questions?.map((question, i) => {
                      return (
                        <TakeQuizComponent
                          setAnswers={setAnswers}
                          question={question}
                          key={i}
                          index={i}
                          answers={answers}
                        />
                      );
                    })}
                  </div>
                  <ButtonContainer>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSubmitQuiz}
                      sx={{ marginRight: "5px" }}
                    >
                      Submit Quiz
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="contained"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </ButtonContainer>
                </>
              ) : (
                <SaveQusetionContainer>
                  <Typography
                    component="h5"
                    variant="h5"
                    align="center"
                    color="inherit"
                  >
                    You answered {score?.score}/{score?.noOfQuestions} questions
                    correctly
                  </Typography>
                  <div className="btn-container">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ marginRight: "5px" }}
                      onClick={handleRetakeQuiz}
                    >
                      Retake Quiz
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="contained"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </div>
                </SaveQusetionContainer>
              )}
            </>
          ) : (
            <Typography
              component="h3"
              variant="h3"
              align="center"
              color="inherit"
            >
              Quiz Not Found
            </Typography>
          )}
        </CreateQuizContainer>
      </HomeContainer>
    </motion.div>
  );
};
const HomeContainer = styled.div`
  background-color: #001e3c;
  color: white;
  padding-bottom: 100px;
  min-height: 100vh;
`;
const CreateQuizContainer = styled.div`
  width: 70%;
  border: 1px solid lightgrey;
  margin-top: 15px;
  margin-left: 15%;
  background-color: #d8d2cb;
  color: black;
  padding-bottom: 100px;

  border-radius: 8px;
  .heading {
    margin-left: 45%;
  }
  padding-bottom: 5px;
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 0;
    border-radius: 0;
  }
`;

const SaveQusetionContainer = styled.div`
  margin: 10px 0;
  background-color: #eeeeee;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin-left: 15%;
  width: 68%;
  border: 1px solid lightgrey;
  padding: 15px;
  border-radius: 5px;
  .btn-container {
    margin-left: 35%;
    margin-top: 35px;
    @media (max-width: 768px) {
      margin-left: 20%;
    }
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  margin-left: 40%;
  @media (max-width: 768px) {
    margin-left: 30%;
  }
`;
