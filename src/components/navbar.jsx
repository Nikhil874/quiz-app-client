import * as React from "react";
import AppBar from "@mui/material/AppBar";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../context/user.context";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
export const Navbar = () => {
  const { tokenDetails, setTokenDetails, setLogin } =
    React.useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    return navigate("/login");
  };
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,

        backgroundColor: "#0a1929",
      }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Quiz App
          </Link>
        </Typography>

        {tokenDetails ? (
          <Button
            color="inherit"
            onClick={() => {
              Cookies.remove("Js cookie");

              setTokenDetails(null);
              setLogin(false);
              toast.success("Logged out");

              navigate("/login");
            }}
          >
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
