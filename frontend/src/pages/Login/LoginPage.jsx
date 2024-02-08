import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signup/SignupPage.css"
import Navbar from "../../components/Navbar/Navbar";

import { login } from "../../services/authentication";

export const LoginPage = () => {
  document.title = "Login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  let timer;

if (loginError) {
  timer = setTimeout(() => {
    setLoginError("");
    setLoginError("");
  }, 3000);
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await login(email, password);
      window.localStorage.setItem("token", token[0]);
      window.localStorage.setItem("id", token[1])
      navigate("/posts");
    } catch (err) {
      console.error(err);
      if (err.message === "Received status 401 when logging in. Expected 201") {
        setLoginError("User not found. Please try again or create an account.");
      } else if (err.message === "Received status 403 when logging in. Expected 201") {
        setLoginError("Invalid password, please try again.");
      } else {
        setLoginError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
    <div className="sign-up">
      <h2>Login</h2>
      <p className="error-message">{loginError}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />

        <a href="/signup">New here? Sign up!</a>
      </form>
    </div>
    </>
  );
};
