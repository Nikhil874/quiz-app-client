import { Button, Checkbox, Input, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/user.context";
export const OptionComponent = ({
  option,
  index,

  setQuesOptions,
  quesOptions,
}) => {
  const { optActive, setOptActive } = React.useContext(UserContext);
  let [optionEdit, setOptionEdit] = useState(false);
  const [editCurrOption, setEditCurrOption] = useState({
    isCorrect: option.isCorrect,
    text: option.text,
  });

  //save edited option
  const SaveEditOption = (index) => {
    if (!editCurrOption.text.trim()) {
      toast.error("option should not be empty");
    } else if (quesOptions.length == 5 && !editCurrOption.isCorrect) {
      let count = 0;
      quesOptions.forEach((opt, i) => {
        if (opt.isCorrect && index != i) {
          count++;
        }
      });
      if (count == 0) {
        toast.error("there should be atleast one correct answer");
      } else {
        let optCheck = editCurrOption.text.trim();
        let count = 0;
        quesOptions.forEach((opt, i) => {
          if (opt.text == optCheck && index != i) {
            count++;
          }
        });
        if (count > 0) {
          toast.error("you cannot have duplicate options");
        } else {
          quesOptions = quesOptions.map((opt, i) => {
            if (i == index) {
              (opt.isCorrect = editCurrOption.isCorrect),
                (opt.text = editCurrOption.text);
              return opt;
            } else {
              return opt;
            }
          });
          setQuesOptions([...quesOptions]);
          setEditCurrOption({
            isCorrect: editCurrOption.isCorrect,
            text: editCurrOption.text,
          });
          setOptionEdit(false);
          setOptActive(false);
        }
      }
    } else {
      let optCheck = editCurrOption.text.trim();
      let count = 0;
      quesOptions.forEach((opt, i) => {
        if (opt.text == optCheck && index != i) {
          count++;
        }
      });
      if (count > 0) {
        toast.error("you cannot have duplicate options");
      } else {
        quesOptions = quesOptions.map((opt, i) => {
          if (i == index) {
            (opt.isCorrect = editCurrOption.isCorrect),
              (opt.text = editCurrOption.text);
            return opt;
          } else {
            return opt;
          }
        });
        setQuesOptions([...quesOptions]);
        setEditCurrOption({
          isCorrect: editCurrOption.isCorrect,
          text: editCurrOption.text,
        });
        setOptionEdit(false);
        setOptActive(false);
      }
    }
  };

  const handleOptDelete = (index) => {
    quesOptions = quesOptions.filter((opt, i) => {
      if (i != index) {
        return opt;
      }
    });
    setQuesOptions([...quesOptions]);
  };
  useEffect(() => {
    if (!optActive && optionEdit) {
      setOptionEdit(false);
    }
  }, [optActive]);

  return (
    <>
      {!optionEdit ? (
        <div key={index}>
          <Checkbox checked={option.isCorrect ? true : false} disabled />

          <Typography sx={{ display: "inline" }}>{option.text}</Typography>
          <Button
            onClick={() => {
              if (!optActive) {
                setOptActive(true);
                setOptionEdit(true);
              } else {
                setOptActive(false);
                setTimeout(() => {
                  setOptActive(true);
                  setOptionEdit(true);
                }, 0);
              }
            }}
            sx={{ fontSize: "1.15rem", padding: "0", margin: "0" }}
          >
            <EditIcon
              fontSize="2.5rem"
              color="primary"
              sx={{ margin: "-3px ", paddingBottom: "-10px" }}
            />
          </Button>
          <Button
            onClick={() => {
              handleOptDelete(index);
            }}
            sx={{ fontSize: "1.15rem" }}
          >
            <DeleteIcon
              fontSize="2.5rem"
              color="error"
              sx={{ margin: "-3px ", paddingBottom: "-10px" }}
            />
          </Button>
        </div>
      ) : (
        <>
          <Checkbox
            checked={editCurrOption.isCorrect}
            value={editCurrOption.text}
            onChange={() => {
              setEditCurrOption({
                ...editCurrOption,
                isCorrect: !editCurrOption.isCorrect,
              });
            }}
          />
          <Input
            placeholder="Add option"
            value={editCurrOption.text}
            onChange={(e) => {
              setEditCurrOption({ ...editCurrOption, text: e.target.value });
            }}
          />
          <Button
            size="small"
            variant="contained"
            sx={{ marginLeft: "5px" }}
            onClick={() => SaveEditOption(index)}
          >
            Save
          </Button>
        </>
      )}
    </>
  );
};
