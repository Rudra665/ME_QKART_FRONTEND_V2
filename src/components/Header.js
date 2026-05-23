import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";


const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  
  // 1. Retrieve user data from localStorage to check login status
  const username = localStorage.getItem("username");

  // 2. Handle Logout logic
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Refresh to update the UI state
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {/* Render search bar if passed as children (only on Products page) */}
      {children}

      <Stack direction="row" spacing={1} alignItems="center">
        {hasHiddenAuthButtons ? (
          // STATE 1: Login/Register Pages
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
          >
            Back to explore
          </Button>
        ) : username ? (
          // STATE 3: Products Page - Logged In
          <>
            <Avatar src="avatar.png" alt={username}  />
            <p className="username-text">{username}</p>
            <Button variant="text" className="explore-button" onClick={handleLogout}>
              LOGOUT
            </Button>
          </>
        ) : (
          // STATE 2: Products Page - Logged Out
          <>
            <Button variant="text" className="explore-button" onClick={() => history.push("/login")}>
              LOGIN
            </Button>
            <Button variant="contained" className="explore-button-contained" onClick={() => history.push("/register")}>
              REGISTER
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Header;