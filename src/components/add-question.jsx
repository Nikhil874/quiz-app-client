import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { questionSchema } from "../joi-schema/question-schema";
import { OptionComponent } from "./option-component";
import { UserContext } from "../context/user.context";
export const IsMultiple = (options) => {
  let count = 0;
  options?.forEach((opt) => {
    if (opt.isCorrect) {
      count++;
    }
  });
  return count;
};
export const AddQuestionComponent = ({ questions, setQuestions }) => {
  const [question, setQuestion] = useState("");

  const [quesOptions, setQuesOptions] = useState([]);
  const [currOption, setCurrOption] = useState({ isCorrect: false, text: "" });
  const [isAdd, setIsAdd] = useState(false);
  const { setOptActive, setActiveQues } = React.useContext(UserContext);
  const SaveOption = () => {
    if (!currOption.text.trim()) {
      toast.error("option should not be empty");
    } else if (quesOptions.length == 4 && !currOption.isCorrect) {
      let count = 0;
      quesOptions.forEach((opt) => {
        if (opt.isCorrect) {
          count++;
        }
      });
      if (count == 0) {
        toast.error("there should be atleast one correct answer");
      } else {
        //only for last option
        let optCheck = currOption.text.trim();
        let count = 0;
        quesOptions.forEach((opt) => {
          if (opt.text == optCheck) {
            count++;
          }
        });
        if (count > 0) {
          toast.error("you cannot have duplicate options");
        } else {
          setQuesOptions([
            ...quesOptions,
            { isCorrect: currOption.isCorrect, text: optCheck },
          ]);
          setCurrOption({ isCorrect: false, text: "" });
          setIsAdd(false);
        }
      }
    } else {
      let optCheck = currOption.text.trim();
      let count = 0;
      quesOptions.forEach((opt) => {
        if (opt.text == optCheck) {
          count++;
        }
      });
      if (count > 0) {
        toast.error("you cannot have duplicate options");
      } else {
        setQuesOptions([
          ...quesOptions,
          { isCorrect: currOption.isCorrect, text: optCheck },
        ]);
        setCurrOption({ isCorrect: false, text: "" });
        setIsAdd(false);
      }
    }
  };
  const SaveQuestion = () => {
    let { value, error } = questionSchema.validate({
      question,

      options: quesOptions,
    });
    if (error) {
      toast.error(error.message);
    } else {
      let queCheck = question.trim();
      let duplicate = 0;
      questions.forEach((que) => {
        if (que.question == queCheck) {
          duplicate++;
        }
      });
      if (duplicate) {
        toast.error("you cannot repeat the question");
      } else {
        if (value?.options?.length == 2 && IsMultiple(value.options) > 1) {
          toast.error(
            "multiple choice question must have atleast three options"
          );
        } else {
          let count = 0;
          value?.options?.forEach((opt) => {
            if (opt.isCorrect) {
              count++;
            }
          });
          if (count == 0) {
            toast.error("there should be atleast one correct answer");
          } else {
            setQuestions([
              ...questions,
              { question: value.question, options: value.options },
            ]);
            setQuestion("");
            setActiveQues(false);
            setCurrOption({ isCorrect: false, text: "" });
            setQuesOptions([]);
            setOptActive(false);
          }
        }
      }
    }
  };

  return (
    <AddQusetionContainer>
      <FormControl variant="standard" sx={{ width: "60%", margin: "10px 0" }}>
        <InputLabel htmlFor="title">Question</InputLabel>
        <Input
          id="title"
          className="title"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value), setActiveQues(true);
            if (e.target.value == "") {
              setActiveQues(false);
            }
          }}
        />
      </FormControl>
      {IsMultiple(quesOptions) > 1 && (
        <p className="info">* This question have multiple answers</p>
      )}
      <div className="options">
        {quesOptions?.map((option, i) => {
          return (
            <div key={i}>
              <OptionComponent
                index={i}
                option={option}
                setQuesOptions={setQuesOptions}
                quesOptions={quesOptions}
              />
            </div>
          );
        })}

        {/* for adding options */}
        {isAdd ? (
          <>
            <Checkbox
              value={currOption.isCorrect}
              onChange={() => {
                setCurrOption({
                  ...currOption,
                  isCorrect: !currOption.isCorrect,
                });
              }}
            />{" "}
            <Input
              placeholder="Add option"
              value={currOption.text}
              onChange={(e) => {
                setCurrOption({ ...currOption, text: e.target.value });
              }}
            />
            <Button
              size="small"
              variant="contained"
              sx={{ marginLeft: "5px" }}
              onClick={SaveOption}
              disabled={currOption.text ? false : true}
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setIsAdd(true);
            }}
            sx={{ marginTop: "10px" }}
            disabled={
              quesOptions.length == 5 || question.length < 3 ? true : false
            }
          >
            ADD OPTION
          </Button>
        )}
      </div>
      <Button
        variant="contained"
        size="small"
        onClick={SaveQuestion}
        sx={{ marginLeft: "35%", marginTop: "20px" }}
        disabled={currOption.text || !question ? true : false}
      >
        Save Question
      </Button>
    </AddQusetionContainer>
  );
};
const AddQusetionContainer = styled.div`
  background-color: #eeeeee;
  margin-left: 15%;
  width: 68%;
  border: 1px solid lightgray;
  padding: 15px;
  border-radius: 5px;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  .info {
    color: red;
  }
`;
