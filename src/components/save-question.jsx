import { Button, Checkbox, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { questionSchema } from "../joi-schema/question-schema";
import { toast } from "react-toastify";
import { UserContext } from "../context/user.context";
import { OptionComponent } from "./option-component";
import { IsMultiple } from "./add-question";
export const SaveQuestionComponent = ({
  question,
  index,
  questions,
  setQuestions,
}) => {
  let { active, setActive, setOptActive, optActive } =
    React.useContext(UserContext);
  let questionNumber = index + 1;
  const handleDeleteQuestion = (title) => {
    let result = questions?.filter((question, i) => {
      if (title != question.question) {
        return question;
      }
    });

    if (result.length == 0) {
      setQuestions([]);
    } else {
      setQuestions([...result]);
    }
  };
  //edit saved question
  const [edit, setEdit] = useState(false);
  const [editQuestion, setEditQuestion] = useState(question?.question);
  const [editOptions, setEditOptions] = useState([...question?.options]);

  const [currOption, setCurrOption] = useState({ isCorrect: false, text: "" });
  const [isAdd, setIsAdd] = useState(false);

  //save edited option save new option
  const SaveOption = () => {
    if (!currOption.text.trim()) {
      toast.error("option should not be empty");
    } else if (editOptions.length == 4 && !currOption.isCorrect) {
      let count = 0;
      editOptions.forEach((opt) => {
        if (opt.isCorrect) {
          count++;
        }
      });
      if (count == 0) {
        toast.error("there should be atleast one correct answer");
      } else {
        //for last option
        let optCheck = currOption.text.trim();
        let count = 0;
        editOptions.forEach((opt) => {
          if (opt.text == optCheck) {
            count++;
          }
        });
        if (count > 0) {
          toast.error("you cannot have duplicate options");
        } else {
          setEditOptions([
            ...editOptions,
            { isCorrect: currOption.isCorrect, text: optCheck },
          ]);
          setCurrOption({ isCorrect: false, text: "" });
          setIsAdd(false);
        }
      }
    } else {
      let optCheck = currOption.text.trim();
      let count = 0;
      editOptions.forEach((opt) => {
        if (opt.text == optCheck) {
          count++;
        }
      });
      if (count > 0) {
        toast.error("you cannot have duplicate options");
      } else {
        setEditOptions([
          ...editOptions,
          { isCorrect: currOption.isCorrect, text: optCheck },
        ]);
        setCurrOption({ isCorrect: false, text: "" });
        setIsAdd(false);
      }
    }
  };

  //save edited question
  const SaveQuestion = (index) => {
    let { value, error } = questionSchema.validate({
      question: editQuestion,

      options: editOptions,
    });
    if (error) {
      toast.error(error.message);
    } else {
      let queCheck = editQuestion.trim();
      let duplicate = 0;
      questions.forEach((que, i) => {
        if (que.question == queCheck && i != index) {
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
            questions = questions.map((question, i) => {
              if (i == index) {
                question.question = value.question;

                question.options = value.options;
                return question;
              } else {
                return question;
              }
            });

            setQuestions([...questions]);
            setCurrOption({ isCorrect: false, text: "" });
            setEdit(false);
            setActive(false);
            setOptActive(false);
          }
        }
      }
    }
  };
  useEffect(() => {
    if (!active && edit) {
      setEdit(false);
    }
  }, [active]);

  return (
    <SaveQusetionContainer>
      {/* saved question */}
      {!edit ? (
        <>
          <Typography fontSize="large" fontWeight="400">
            {questionNumber} . {question.question}{" "}
          </Typography>
          {IsMultiple(question?.options) > 1 && (
            <p className="info">* This question have multiple answers</p>
          )}
          <div>
            {question.options?.map((option, i) => {
              return (
                <div key={i}>
                  <Checkbox checked={option.isCorrect} disabled />
                  <Typography sx={{ display: "inline" }} fontSize="medium">
                    {option.text}
                  </Typography>
                </div>
              );
            })}
          </div>
          <div className="btn-container">
            <Button
              onClick={() => {
                if (!active) {
                  setActive(true);
                  setEdit(true);
                } else {
                  setActive(false);
                  setTimeout(() => {
                    setActive(true);
                    setEdit(true);
                  }, 0);
                }
              }}
              variant="contained"
              size="small"
              sx={{ marginRight: "20px" }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteQuestion(question.question)}
              variant="contained"
              size="small"
            >
              Delete
            </Button>
          </div>
          {/* save question end */}
        </>
      ) : (
        <>
          {/* edit question start */}
          <Input
            className="title"
            placeholder="Add Question"
            sx={{ width: "60%", margin: "10px 0" }}
            value={!editQuestion ? "" : editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
          />

          {IsMultiple(editOptions) > 1 && (
            <p className="info">* This question have multiple answers</p>
          )}
          <div className="options">
            {editOptions?.map((option, i) => {
              return (
                <div key={i}>
                  <OptionComponent
                    index={i}
                    option={option}
                    setQuesOptions={setEditOptions}
                    quesOptions={editOptions}
                  />
                </div>
              );
            })}

            {isAdd ? (
              <>
                <Checkbox
                  value={currOption?.isCorrect}
                  onChange={() => {
                    setCurrOption({
                      ...currOption,
                      isCorrect: !currOption.isCorrect,
                    });
                  }}
                />{" "}
                <Input
                  placeholder="Add option"
                  value={currOption?.text}
                  onChange={(e) => {
                    setCurrOption({ ...currOption, text: e.target.value });
                  }}
                />
                <Button
                  size="small"
                  variant="contained"
                  sx={{ marginLeft: "5px" }}
                  onClick={SaveOption}
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
                disabled={
                  editOptions.length == 5 || !editQuestion ? true : false
                }
              >
                ADD OPTION
              </Button>
            )}
          </div>
          <div className="btn-container-1">
            <Button
              variant="contained"
              size="small"
              onClick={() => SaveQuestion(index)}
              sx={{ marginRight: "20px" }}
              disabled={optActive}
            >
              Save Question
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setEdit(false);
                setActive(false);
                setEditQuestion(question?.question);
                setEditOptions([...question?.options]);
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </SaveQusetionContainer>
  );
};
const SaveQusetionContainer = styled.div`
  margin: 10px 0;
  background-color: #eeeeee;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin-left: 15%;
  width: 68%;
  border: 1px solid lightgrey;
  padding: 15px;
  border-radius: 5px;
  .info {
    color: red;
  }
  .btn-container {
    text-align: right;
    margin-top: 10px;
  }
  .btn-container-1 {
    text-align: center;
    margin-top: 10px;
  }
`;


