import { useEffect, useState } from "react";
import { AllRoutes } from "./AllRoutes";

import "./App.css";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./context/user.context";

import Cookies from "js-cookie";

function App() {
  const [tokenDetails, setTokenDetails] = useState(null);
  const [active, setActive] = useState(false);
  const [optActive, setOptActive] = useState(false);
  const [activeQues, setActiveQues] = useState(false);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    let token = Cookies.get("Js cookie")
      ? JSON.parse(Cookies.get("Js cookie"))?.token
      : null;
    console.log(token, "here");
    if (token) {
      setTokenDetails(token);
    } else {
      setTokenDetails(token);
      setLogin(false);
    }
  }, [login, tokenDetails]);
  return (
    <UserContext.Provider
      value={{
        tokenDetails,
        setTokenDetails,
        active,
        setActive,
        optActive,
        setOptActive,
        activeQues,
        setActiveQues,
        login,
        setLogin,
      }}
    >
      <div className="App">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AllRoutes />
      </div>
    </UserContext.Provider>
  );
}

export default App;
