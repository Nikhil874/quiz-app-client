import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

export const TakeQuizComponent = ({ question, index, setAnswers, answers }) => {
  const handleChangeMultiple = (value, isChecked, questionId) => {
    if (answers.length == 0 && isChecked) {
      answers.push({ questionId, options: [value] });
      setAnswers([...answers]);
    } else {
      let count = 0;
      answers = answers.map((answer, i) => {
        //already present
        if (answer.questionId == questionId) {
          count++;
          if (isChecked) {
            if (answer.options) {
              answer.options = [...answer.options, value];
            } else {
              answer.options = [value];
            }
          } else {
            answer.options = answer.options.filter((option) => {
              //removed unchecked
              if (option == value) {
                return false;
              } else {
                return true;
              }
            });
          }

          return answer;
        } else {
          return answer;
        }
      });
      //no match found
      if (count == 0) {
        answers.push({ questionId, options: [value] });
      }
      answers = answers.filter((answer) => {
        if (answer.options.length != 0) {
          return answer;
        }
      });
      setAnswers([...answers]);
    }
  };
  const [valueAdd, setValueAdd] = useState(null);

  const handleClick = (index, questionId) => {
    //adding option firstly
    if (answers.length == 0) {
      answers.push({ questionId, options: [index] });
      setAnswers([...answers]);
      setValueAdd(index);
    } else {
      let count = 0;
      answers = answers.map((answer, i) => {
        if (answer.questionId === questionId) {
          //found match remove it as unclick
          if (index == answer.options[0]) {
            setValueAdd(null);
            answer.options = [];
            count++;
          } else {
            answer.options = [index];
            setValueAdd(index);
            count++;
          }

          return answer;
        } else {
          return answer;
        }
      });
      //if question not present in answers
      if (count == 0) {
        answers.push({ questionId, options: [index] });
        setValueAdd(index);
      }
      answers = answers.filter((answer) => {
        if (answer.options.length != 0) {
          return answer;
        }
      });
      setAnswers([...answers]);
    }
  };

  return (
    <SaveQusetionContainer>
      <Typography fontSize="large" fontWeight="400">
        {index + 1} . {question.question}{" "}
      </Typography>

      <div>
        {!question.isMultiple ? (
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={valueAdd != null ? question?.options[valueAdd] : ""}
          >
            {question.options.map((option, i) => {
              return (
                <FormControlLabel
                  value={option}
                  control={
                    <Radio onClick={(e) => handleClick(i, question.id)} />
                  }
                  label={option}
                  key={i}
                />
              );
            })}
          </RadioGroup>
        ) : (
          <FormGroup>
            {question.options.map((option, i) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={option}
                      onChange={(event, value) =>
                        handleChangeMultiple(i, value, question.id)
                      }
                      name={option}
                    />
                  }
                  key={i}
                  label={option}
                />
              );
            })}
          </FormGroup>
        )}
      </div>
      {question.isMultiple && (
        <p className="info">* This question have multiple answers</p>
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
    text-align: right;
  }
`;
