import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = ({ hasHiddenAuthButtons, children }) => {
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
        onClick={() => history.push("/")}
        style={{ cursor: "pointer" }}
      >
        <img src="logo_light.svg" alt="QKart-icon" />
      </Box>
      {children && <Box className="header-children">{children}</Box>}

      {/* If header has hidden auth buttons (for login/register pages) */}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          sx={{ color: "#00A278" }}
          onClick={() => history.push("/")}
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
                sx={{
                  color: "#00A278",
                  borderColor: "#00A278",
                  "&:hover": {
                    backgroundColor: "#00A278",
                    color: "#fff",
                    borderColor: "#00A278",
                  },
                }}
                variant="outlined"
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
                sx={{
                  color: "#00A278",
                  borderColor: "#00A278",
                  "&:hover": {
                    backgroundColor: "#00A278",
                    color: "#fff",
                    borderColor: "#00A278",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => history.push("/register")}
                sx={{
                  backgroundColor: "#00A278",
                  color: "#fff",
                  borderColor: "#00A278",
                  transition: "all 0.2s ease-in-out", // smooth animation
                  "&:hover": {
                    backgroundColor: "#008C65", // darker green
                    transform: "scale(1.05)",   // slight zoom on hover
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // add some depth
                  },
                }}
                
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
