// frontend/src/services/posts.js

// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPosts = async (token, loadCycle) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/posts/all/${loadCycle}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};

// Currently working on
export const getPostsByUser = async (token, user_id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/posts/${user_id}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};

export const likePost = async (postId, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Specify the content type as JSON
    },
    body: JSON.stringify({ postId }), // Send the post ID to the backend
  };

  // console.log("Request Body:", requestOptions.body);

  const response = await fetch(`${BACKEND_URL}/likes/toggle`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to toggle the like status of the post");
  }

  const data = await response.json();
  return data;
};

export const getAllLikesByPostId = async (postId, token) => {
  try {
    const response = await fetch(`${BACKEND_URL}/likes/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createPost = async (token, formData) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create post");
  }

  const data = await response.json();
  return data;
};
