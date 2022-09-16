import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { AddQuestionComponent } from "../components/add-question";
import { Navbar } from "../components/navbar";
import { SaveQuestionComponent } from "../components/save-question";

import { UserContext } from "../context/user.context";
import { quizSchema } from "../joi-schema/quiz-schema";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
export const EditQuiz = () => {
  const { tokenDetails, active, activeQues, setTokenDetails } =
    useContext(UserContext);
  const token = tokenDetails;

  const [quiz, setQuiz] = useState({ title: "", questions: null });
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  //get user quiz by id
  const getQuiz = (id) => {
    if (Cookies.get("Js cookie")) {
      axios
        .get(`http://localhost:3004/users/quizes/${id}`, {
          headers: { jwt: token },
        })
        .then(({ data }) => {
          setQuiz({ title: data?.title, questions: data?.questions });
          setQuestions(data.questions);
          setError(null);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setError(err.response.data.message);
        });
    } else {
      toast.error("session expires");
      setTokenDetails(null);
      navigate("/login");
    }
  };
  //edit user quiz
  const handleSubmitQuiz = (id) => {
    if (Cookies.get("Js cookie")) {
      let { value, error } = quizSchema.validate({
        title: quiz.title,
        questions,
      });
      if (active) {
        toast.error("save all questions to submit quiz");
      } else if (error) {
        toast.error(error.message);
      } else {
        axios
          .patch(
            `http://localhost:3004/quiz/${id}`,
            { title: value.title, questions: value.questions },
            { headers: { jwt: token } }
          )
          .then(({ data }) => {
            toast.success("quiz edited successfully");

            navigate("/");
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
    } else {
      toast.error("session expires");
      setTokenDetails(null);
      navigate("/login");
    }
  };
  useEffect(() => {
    getQuiz(id);
  }, []);

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
              <h3 className="heading">Your Quiz</h3>
              <div className="content">
                <FormControl
                  variant="standard"
                  id="quiz-title"
                  sx={{
                    marginLeft: "15%",
                    marginBottom: "20px",
                    color: "black",
                  }}
                >
                  <InputLabel htmlFor="quiz-title">Quiz Title</InputLabel>
                  <Input
                    value={quiz?.title}
                    id="quiz-title"
                    onChange={(e) => {
                      quiz.title = e.target.value;
                      setQuiz({ ...quiz });
                    }}
                  />
                </FormControl>
                <div>
                  {questions?.map((question, i) => {
                    return (
                      <SaveQuestionComponent
                        question={question}
                        key={i}
                        index={i}
                        questions={questions}
                        setQuestions={setQuestions}
                      />
                    );
                  })}
                </div>
              </div>
              <div>
                {questions.length < 10 ? (
                  <AddQuestionComponent
                    questions={questions}
                    setQuestions={setQuestions}
                  />
                ) : null}
              </div>
              <div className="btn-container">
                <Button
                  onClick={() => handleSubmitQuiz(id)}
                  sx={{ marginRight: "5px" }}
                  variant="contained"
                  size="small"
                  disabled={activeQues || questions.length == 0 ? true : false}
                >
                  Submit Quiz
                </Button>
                <Button onClick={handleCancel} variant="contained" size="small">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <Typography
                component="h3"
                variant="h3"
                align="center"
                color="inherit"
              >
                Quiz not found
              </Typography>
            </>
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

  border-radius: 8px;
  .heading {
    margin-left: 45%;
  }
  padding-bottom: 20px;
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 0;
    border-radius: 0;
  }
  .btn-container {
    margin-top: 20px;
    margin-left: 40%;
    @media (max-width: 768px) {
      margin-left: 30%;
    }
  }
`;
