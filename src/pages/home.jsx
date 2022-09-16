import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Navbar } from "../components/navbar";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserQuizCard } from "../components/user-quiz-card";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { motion } from "framer-motion";
import Cookies from "js-cookie";
const useStyles = makeStyles(() => ({
  ul: {
    "& .MuiPaginationItem-root": {
      color: "white",
    },
  },
}));
export const HomePage = () => {
  const navigate = useNavigate();

  let { tokenDetails, setTokenDetails } = useContext(UserContext);
  const handleCreateQuiz = () => {
    if (Cookies.get("Js cookie")) {
      navigate("/create-quiz");
    } else {
      // toast.error("session expired");
      setTokenDetails(null);
      navigate("/login")
    }
  };
  const [userQuizes, setUserQuizes] = useState([]);
  const [availableQuizes, setAvailableQuizes] = useState([]);
  const totalPages = useRef(0);
  const totalAvailablePages = useRef(0);
  const [userQuizPages, setUserQuizPages] = useState(1);

  const [availableQuizPages, setAvaliableQuizPages] = useState(1);
  const [userLoading, setUserLoading] = useState(false);
  const [avalilableLoading, setAvalilableLoading] = useState(false);

  const handleUserQuizes = (pageNumber) => {
    if (!pageNumber) {
      pageNumber = 1;
    }

    setUserLoading(true);
    axios
      .get(`http://localhost:3004/users/quizes?page=${pageNumber}`, {
        headers: { jwt: JSON.parse(Cookies.get("Js cookie"))?.token },
      })
      .then(({ data }) => {
        setUserQuizPages(pageNumber);
        setUserQuizes([...data.data]);
        setUserLoading(false);
        totalPages.current = data.noOfPages;
      })
      .catch((err) => {
        setUserLoading(false);
        toast.error(err.message);
      });
  };

  const handleAvaliableQuizes = (pageNumber) => {
    if (!pageNumber) {
      pageNumber = 1;
    }
    setAvalilableLoading(true);
    axios
      .get(`http://localhost:3004/quiz?page=${pageNumber}`)
      .then(({ data }) => {
        setAvaliableQuizPages(pageNumber);
        setAvailableQuizes([...data.data]);

        totalAvailablePages.current = data.noOfPages;
        setAvalilableLoading(false);
      })
      .catch((err) => {
        setAvalilableLoading(false);
        toast.error(err.message);
      });
  };
  useEffect(() => {
    const token = Cookies.get("Js cookie");
    if (token) {
      handleUserQuizes(userQuizPages);
    }

    handleAvaliableQuizes();
  }, []);
  const handleChange = (event, value) => {
    setUserQuizPages(value);
    handleUserQuizes(value);
    handleAvaliableQuizes();
  };
  const handleAvailableChange = (event, value) => {
    setAvaliableQuizPages(value);
    handleAvaliableQuizes(value);
  };

  const classes = useStyles();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
    >
      <HomeContainer>
        <Navbar />
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          sx={{ pt: 8, pb: 6, textAlign: "center" }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="inherit"
            gutterBottom
          >
            Quizes
          </Typography>
          <Button variant="outlined" onClick={handleCreateQuiz}>
            {tokenDetails ? "+ Create Quiz" : "Login to Create Quizes"}
          </Button>
        </Container>
        {/* start UserQuizes */}
        <Container maxWidth="md" component="main">
          {!userLoading ? (
            <Grid container spacing={5} alignItems="flex-end">
              {userQuizes?.length > 0 &&
                userQuizes?.map((quiz, i) => (
                  <UserQuizCard
                    userQuizes={userQuizes}
                    quiz={quiz}
                    key={uuidv4()}
                    handleUserQuizes={handleUserQuizes}
                    handleAvaliableQuizes={handleAvaliableQuizes}
                    userQuizPages={userQuizPages}
                  />
                ))}
            </Grid>
          ) : (
            <CircularProgress color="secondary" sx={{ marginLeft: "50%" }} />
          )}
          {userQuizes?.length > 0 && (
            <Stack spacing={2} sx={{ margin: "10px 0 10px 40%" }}>
              <Pagination
                count={totalPages.current}
                page={userQuizPages}
                color={"secondary"}
                onChange={handleChange}
                classes={{ ul: classes.ul }}
              />
            </Stack>
          )}
        </Container>
        {/* End UserQuizes */}
        {/* start of available Quizes */}
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          sx={{ pt: 8, pb: 6, textAlign: "center" }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="inherit"
            gutterBottom
          >
            Available Quizes
          </Typography>
        </Container>
        <Container maxWidth="md" component="main">
          {!avalilableLoading ? (
            <Grid container spacing={5} alignItems="flex-end">
              {availableQuizes?.map((quiz, i) => (
                <UserQuizCard quiz={quiz} key={uuidv4()} available={true} />
              ))}
            </Grid>
          ) : (
            <CircularProgress color="secondary" sx={{ marginLeft: "50%" }} />
          )}
          {availableQuizes?.length > 0 && (
            <Stack spacing={2} sx={{ margin: "10px 0 10px 40%" }}>
              <Pagination
                count={totalAvailablePages.current}
                page={availableQuizPages}
                color={"secondary"}
                onChange={handleAvailableChange}
                classes={{ ul: classes.ul }}
              />
            </Stack>
          )}
        </Container>
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
