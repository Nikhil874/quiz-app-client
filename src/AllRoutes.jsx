import { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { UserContext } from "./context/user.context";
import { CreateQuiz } from "./pages/create-quiz";
import { EditQuiz } from "./pages/edit-quiz";
import { HomePage } from "./pages/home";
import { SignIn } from "./pages/login";
import { SignUp } from "./pages/sign-up";
import { TakeQuiz } from "./pages/take-quiz";
import { AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

export const AllRoutes = () => {
  const { tokenDetails } = useContext(UserContext);
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        {!tokenDetails && (
          <>
            <Route
              path="/login"
              element={!Cookies.get("Js cookies") ? <SignIn /> : <HomePage />}
            ></Route>
            <Route
              path="/sign-up"
              element={!Cookies.get("Js cookies") ? <SignUp /> : <HomePage />}
            ></Route>
            <Route path="/take-quiz/:id" element={<TakeQuiz />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="*" element={<SignIn />}></Route>
          </>
        )}
        {tokenDetails && (
          <>
            <Route path="/take-quiz/:id" element={<TakeQuiz />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/create-quiz" element={<CreateQuiz />}></Route>
            <Route path="/edit-quiz/:id" element={<EditQuiz />}></Route>
            <Route path="*" element={<HomePage />}></Route>
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};
