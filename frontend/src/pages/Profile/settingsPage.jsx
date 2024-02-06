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

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    getUser(token, id)
      .then((data) => {
        setUser(data.user);
        setFormData({
          full_name: data.user.full_name,
          email: data.user.email,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  
    // Clear success message after a certain time
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); 
    }
  
    return () => clearTimeout(timer);
  
  }, [token, id, successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  const updateData = new FormData();
  updateData.append("full_name", formData.full_name); // Append form data to FormData
  updateData.append("email", formData.email);
  // updateData.append("profile_pic", profilePic); // Append profile picture file if selected
  if (profilePic) {
    updateData.append("profile_pic", profilePic); // Append profile picture file if selected
  }
  try {
    await updateUser(token, id, updateData); // updateUser should be adapted to handle FormData
    setSuccessMessage("Profile updated successfully");
    setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after delay
  } catch (error) {
    console.error("Error updating user:", error);
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

        {/* Form for updating user */}
        <form onSubmit={(e) => e.preventDefault()} class="form-settings">
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

          <button onClick={handleUpdate} class="button-settings">Save</button>
        </form>

        <button onClick={handleDeleteUser} class="delete-button">Delete Account</button>
      </div>
    </>
  );
};
