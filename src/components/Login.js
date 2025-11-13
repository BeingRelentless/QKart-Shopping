import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  // State to store form input values
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State to show loading spinner when login is in progress
  const [loading, setLoading] = useState(false);

  // Handles input changes for username and password
  const changeHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const syncGuestCart = async (token) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (!guestCart.length) return;
  
    try {
      for (let item of guestCart) {
        await axios.post(
          `${config.endpoint}/cart`,
          { productId: item.productId, qty: item.qty },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      localStorage.removeItem("guestCart");
      console.log("Guest cart synced successfully");
    } catch (e) {
      console.error("Failed to sync guest cart:", e);
    }
  };
  

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
   const login = async (formData) => {
    // Validate the user input before sending the request
    if (!validateInput(formData)) return;

    // Show loader
    setLoading(true);

    try {
      // Send POST request to backend API
      const response = await axios.post(`${config.endpoint}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      // If login is successful
      if (response.status === 201) {
        enqueueSnackbar("Logged in successfully!", { variant: "success" });
        console.log(response.data)

        // Store token, username, and balance in localStorage
        persistLogin(
          response.data.token,
          response.data.username,
          response.data.balance
        );

        await syncGuestCart(response.data.token)

        // Redirect to homepage after login
        history.push("/");
      }
    } catch (err) {
      // If backend sends a known error message
      if (err.response && err.response.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Please try again.", {
          variant: "error",
        });
      }
    } finally {
      // Hide loader once API call finishes
      setLoading(false);
    }
  };
  

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
   const validateInput = () => {
    if (!formData.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
  
    if (!formData.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
  
    return true;
  };
  

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
   
   const persistLogin = (token, username, balance) => {
    // console.log('persist login', token)
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      {/* Header Section */}
      <Header hasHiddenAuthButtons />

      {/* Main Login Form */}
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>

          {/* Username Input Field */}
          <TextField
            id="username"
            label="username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={changeHandler}
            fullWidth
          />

          {/* Password Input Field */}
          <TextField
            id="password"
            label="password"
            variant="outlined"
            name="password"
            type="password"
            value={formData.password}
            onChange={changeHandler}
            fullWidth
          />

          {/* Login Button */}
          <Button
            className="button"
            variant="contained"
            onClick={() => login(formData)}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "LOGIN TO QKART"
            )}
          </Button>

          {/* Register Page Redirect */}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Login;
