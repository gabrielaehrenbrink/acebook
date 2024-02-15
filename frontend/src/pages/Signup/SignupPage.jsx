import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css"


export const SignupPage = () => {
  document.title = "Sign Up"
  const [profile_pic, setProfilePic] = useState("");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("")

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (! isValidEmail(email)) {
      return setErrorMessage("Invalid email address")
    }

    if (! isValidPassword(password)) {
      return setErrorMessage("Invalid password!")
    }
  
    try {
      const formData = new FormData();
      formData.append("profile_pic", profile_pic);
      formData.append("full_name", full_name);
      formData.append("email", email);
      formData.append("password", password);
      

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      // Send the form data to the server using fetch or any HTTP library
      const response = await fetch(`${BACKEND_URL}/users`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        console.log("redirecting...:");
        navigate("/login");
      } else if (response.status === 409) {
        setErrorMessage("Email already in use")
      } else {
        console.error("Server error:", response.statusText);
        navigate("/signup");
      }
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    setProfilePic(file);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="sign-up">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        
        <div>
      <label htmlFor="profile_pic">Profile Pic:</label>
      <input
          id="profile_pic"
          type="file"
          onChange={handleProfilePicChange}
          />
        </div>

        <div>
      <label htmlFor="full_name">Full name:</label>
        <input
          id="full_name"
          type="text"
          value={full_name}
          onChange={handleFullNameChange}
          required={true}
        />
        </div>

        <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          required={true}
        />
        </div>

        <div>
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required={true}        />
        </div>
        <p className="error-message">{errorMessage}</p>
        <input role="submit-button" id="submit" type="submit" value="Submit" />

        <a href="/login">Login</a>
      </form>
    </div>
  );
};
