import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

import styled from "styled-components";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import Cookies from "js-cookie";

export const UserQuizCard = ({
  quiz,
  handleUserQuizes,
  available,
  handleAvaliableQuizes,
  userQuizPages,
  userQuizes,
}) => {
  const { tokenDetails, setTokenDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const handleEditQuiz = (id) => {
    navigate(`/edit-quiz/${id}`);
  };
  //delete user quiz
  const handleDeleteQuiz = (id) => {
    if (Cookies.get("Js cookie")) {
      axios
        .delete(`http://localhost:3004/quiz/${id}`, {
          headers: { jwt: tokenDetails },
        })
        .then(() => {
          if (userQuizPages > 1) {
            if (userQuizes.length == 1) {
              userQuizPages = userQuizPages - 1;
            }
          }
          handleUserQuizes(userQuizPages);
          handleAvaliableQuizes();
          toast.success("Quiz deleted successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      toast.error("session expired");
      setTokenDetails(null);
      navigate("/login");
    }
  };
  //publish user quiz
  const handlePublishQuiz = (id) => {
    if (Cookies.get("Js cookie")) {
      axios
        .patch(`http://localhost:3004/quiz/${id}?publish=true`, null, {
          headers: { jwt: tokenDetails },
        })
        .then(() => {
          handleUserQuizes(userQuizPages);
          handleAvaliableQuizes();
          toast.success("Quiz Published successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      toast.error("session expired");
      setTokenDetails(null);
      navigate("/login");
    }
  };
  const handleTakeQuiz = (id) => {
    navigate(`/take-quiz/${id}`);
  };
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardHeader
          title={quiz.title}
          titleTypographyProps={{ align: "center" }}
          action={null}
          subheaderTypographyProps={{
            align: "center",
          }}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              mb: 2,
            }}
          ></Box>

          <Typography variant="subtitle1" align="center">
            No.Of Questions:{quiz.noOfQuestions}
          </Typography>
          <Container
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "10px",
            }}
          >
            {!quiz.permaLink && (
              <Button
                onClick={() => {
                  handleEditQuiz(quiz.id);
                }}
              >
                {" "}
                <ModeEditIcon color="primary.dark" />
              </Button>
            )}
            {!available && (
              <Button
                onClick={() => {
                  handleDeleteQuiz(quiz.id);
                }}
              >
                <DeleteIcon color="secondary" />
              </Button>
            )}
          </Container>
        </CardContent>
        <CardActions>
          {quiz.permaLink ? (
            <TakeQuizContent>
              <p>Take Quiz:</p>

              <Link to={`/take-quiz/${quiz.permaLink}`} className="link">
                {quiz.permaLink}
              </Link>
            </TakeQuizContent>
          ) : (
            <PublishButton>
              <Button
                variant="outlined"
                onClick={() => {
                  handlePublishQuiz(quiz.id);
                }}
              >
                Publish Quiz
              </Button>
            </PublishButton>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};
const PublishButton = styled.div`
  margin-left: 22.5%;
  @media (max-width: 768px) {
    margin-left: 35%;
  }
`;
const TakeQuizContent = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 20%;
  width: 100%;

  p {
    margin: 0;
    padding: 0;
    font-weight: 500;
    margin-right: 5px;
    font-size: 18px;
  }
  .link {
    text-decoration: none;
    font-size: 18px;
  }
  @media (max-width: 768px) {
    margin-left: 35%;
  }
`;
