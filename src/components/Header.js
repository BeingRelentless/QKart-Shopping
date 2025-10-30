import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = ({ hasHiddenAuthButtons }) => {
  const history = useHistory();

  // Check if user is logged in
  const user = localStorage.getItem("username");

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    history.push("/login");
  };

  return (
    <Box className="header">
      {/* Logo */}
      <Box
        className="header-title"
        onClick={() => history.push("/products")}
        style={{ cursor: "pointer" }}
      >
        <img src="logo_light.svg" alt="QKart-icon" />
      </Box>

      {/* If header has hidden auth buttons (for login/register pages) */}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/products")}
        >
          Back to explore
        </Button>
      ) : (
        // Normal header behavior (on Products Page)
        <Stack direction="row" spacing={2} alignItems="center">
          {user ? (
            // If logged in
            <>
              <Avatar alt={user} src="/avatar.png" />
              <Box>{user}</Box>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            // If not logged in
            <>
              <Button
                variant="text"
                onClick={() => history.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => history.push("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default Header;
