// frontend/src/services/comments.js

// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const submitComment = async (comment, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Specify the content type as JSON
    },
    body: JSON.stringify(comment),
  };

  const response = await fetch(`${BACKEND_URL}/comments`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to comment on post!");
  }

  const data = await response.json();
  return data;
};

export const getAllCommentsForAPost = async (token, post_id, loadCycle) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/comments/${post_id}/${loadCycle}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch comments");
  }

  const data = await response.json();
  return data;
};


export const deleteComment = async (token, id) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(`Deleting comment with ID: ${id}`);
  const response = await fetch(`${BACKEND_URL}/comments/${id}`, requestOptions);

  if (response.status !== 200) {
    const errorText = await response.text();
    throw new Error(
      `Unable to delete comment. Status: ${response.status}, Message: ${errorText}`
    );
  }

  const deletedComment = await response.json();
  return deletedComment;
};



export const likeComment = async (commentId, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Specify the content type as JSON
    },
    body: JSON.stringify({ commentId }), // Send the comment ID to the backend
  };

  // console.log("Request Body:", requestOptions.body);

  const response = await fetch(
    `${BACKEND_URL}/comments/like/toggle`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to toggle the like status of the comment");
  }

  const data = await response.json();
  return data;
};

export const getAllLikesByCommentId = async (commentId, token) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/comments/likes/all/${commentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};


export const editComment = async (token, id, editedComment) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ comment: editedComment }),
  };
  console.log(`Editing comment with id: ${id}`);
  const response = await fetch(`${BACKEND_URL}/comments/${id}`, requestOptions)

  if (response.status !== 200) {
    throw new Error(
      "Failed to update comment"
    );
  }

  const updatedCommentData = await response.json();
  return updatedCommentData;

};
