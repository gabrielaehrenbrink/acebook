// frontend/src/services/users.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getUser = async (token, id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/users/${id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch user");
  }

  const data = await response.json();
  return data;
};

export const updateUser = async (token, id, updatedUserData) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: updatedUserData,
  };

  const response = await fetch(`${BACKEND_URL}/users/${id}`, requestOptions);

  if (response.status !== 200) {
    const errorText = await response.text();
    throw new Error(
      `Unable to update user. Status: ${response.status}, Message: ${errorText}`
    );
  }

  const updatedUser = await response.json();
  return updatedUser;
};

export const deleteUser = async (token, id) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(`Deleting user with ID: ${id}`);
  const response = await fetch(`${BACKEND_URL}/users/${id}`, requestOptions);

  if (response.status !== 200) {
    const errorText = await response.text();
    throw new Error(
      `Unable to delete user. Status: ${response.status}, Message: ${errorText}`
    );
  }

  const deletedUser = await response.json();
  return deletedUser;
};

export const getUserByName = async (token, name) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/users/search/${name}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch user");
  }

  const data = await response.json();
  return data;
};
