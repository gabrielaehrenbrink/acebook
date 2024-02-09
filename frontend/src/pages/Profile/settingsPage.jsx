import React, { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../services/users";
import Navbar from "../../components/Navbar/Navbar";
import "./profilePage.css";
import { useNavigate } from "react-router-dom";

export const SettingsPage = () => {
  document.title = "Settings Page";

  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const id = window.localStorage.getItem("id");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    about_me: "",
  });

  useEffect(() => {
    getUser(token, id)
      .then((data) => {
        setUser(data.user);
        setFormData({
          full_name: data.user.full_name,
          email: data.user.email,
          about_me: data.user.about_me,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  

let timer;

if (successMessage || errorMessage) {
  timer = setTimeout(() => {
    setSuccessMessage("");
    setErrorMessage("");
  }, 3000);
}
  
    return () => clearTimeout(timer);
  
  }, [token, id, successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
  e.preventDefault(); 
  const updateData = new FormData();
  updateData.append("full_name", formData.full_name); 
  updateData.append("email", formData.email);
  updateData.append("about_me", formData.about_me);
  if (profilePic) {
    updateData.append("profile_pic", profilePic); 
  }
  try {
    await updateUser(token, id, updateData); 
    setSuccessMessage("Profile updated successfully");
    setTimeout(() => setSuccessMessage(""), 2000);
  } catch (error) {
    console.error("Email already in use", error);
    setErrorMessage("Email is already in use. Please choose a different email.");
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  }
  };

  
  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(token, id);
      console.log("User deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings">
        <h1>Settings</h1>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Form for updating user */}
        <form onSubmit={(e) => e.preventDefault()} className="form-settings">
        <label className="label-settings">
            Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-settings"
            />
          </label>
          <label className="label-settings">
            Change Name:
          </label>
          <label className="label-settings">
            <input
              type="text"
              name="full_name"
              placeholder={`${user.full_name}`}
              value={formData.full_name}
              onChange={handleInputChange}
              className="input-settings"
            />
          </label>

          <label className="label-settings">
            Change Email:
          </label>
          <label className="label-settings">
            <input
              type="email"
              name="email"
              placeholder={`${user.email}`}
              value={formData.email}
              onChange={handleInputChange}
              className="input-settings"
            />
          </label>
          <label className="label-settings">
            About me:
            <textarea
              type="about_me"
              name="about_me"
              placeholder={`${user.about_me}`}
              value={formData.about_me}
              onChange={handleInputChange}
              className="input-settings about-me"
            />
          </label>

          <button onClick={handleUpdate} className="button-settings">Save</button>
        </form>

        <button onClick={handleDeleteUser} className="delete-button">Delete Account</button>
      </div>
    </>
  );
};
