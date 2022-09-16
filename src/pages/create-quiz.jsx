import { Button, FormControl, Input, InputLabel } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { AddQuestionComponent } from "../components/add-question";
import { Navbar } from "../components/navbar";
import { SaveQuestionComponent } from "../components/save-question";
import { UserContext } from "../context/user.context";
import { quizSchema } from "../joi-schema/quiz-schema";
import { motion } from "framer-motion";

import Cookies from "js-cookie";
export const CreateQuiz = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    if (!Cookies.get("Js cookie")) {
      navigate("/login");
    }
  }, []);

  const [title, setTitile] = useState("");

  const { tokenDetails, active, activeQues, setTokenDetails } =
    useContext(UserContext);

  const token = tokenDetails;

  //create user quiz
  const handleSubmitQuiz = () => {
    if (!Cookies.get("Js cookie")) {
      toast.error("session expired");
      setTokenDetails(null);
      navigate("/login");
    } else {
      let { value, error } = quizSchema.validate({ title, questions });
      if (active) {
        toast.error("save all questions to submit quiz");
      } else if (error) {
        toast.error(error.message);
      } else {
        axios
          .post(
            "http://localhost:3004/quiz",
            { title: value.title, questions: value.questions },
            { headers: { jwt: token } }
          )
          .then(({ data }) => {
            toast.success("quiz created successfully");
            setTitile("");
            setQuestions([]);
            console.log(data.quizId);
            navigate(`/edit-quiz/${data.quizId}`);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
    }
  };
  const navigate = useNavigate();
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
          <h3 className="heading">Create Quiz</h3>
          <div className="content">
            <FormControl
              variant="standard"
              id="quiz-title"
              sx={{ marginLeft: "15%", marginBottom: "20px", color: "black" }}
            >
              <InputLabel htmlFor="quiz-title">Quiz Title</InputLabel>
              <Input
                value={title}
                id="quiz-title"
                onChange={(e) => {
                  setTitile(e.target.value);
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
            {questions.length < 10 ? (
              <AddQuestionComponent
                questions={questions}
                setQuestions={setQuestions}
              />
            ) : null}
          </div>
          <div className="btn-container">
            <Button
              onClick={handleSubmitQuiz}
              sx={{ marginRight: "5px" }}
              variant="contained"
              size="small"
              disabled={activeQues || questions.length == 0 ? true : false}
            >
              Save & Edit
            </Button>
            <Button onClick={handleCancel} variant="contained" size="small">
              Cancel
            </Button>
          </div>
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
