// frontend/src/services/friends.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const befriend = async (token, id) => {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(`${BACKEND_URL}/friends/${id}/befriend`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to befriend user!");
    }

    const data = await response.json();
    return data;
};

export const unfriend = async (token, id) => {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(`${BACKEND_URL}/friends/${id}/unfriend`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to unfriend user!");
    }

    const data = await response.json();
    return data;
};

export const getFriendStatus = async (token, id) => {
    const requestOptions = {
        method: "GET", 
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // console.log("requestOptions: ", requestOptions)

    const response = await fetch(`${BACKEND_URL}/friends/${id}/friendStatus`, requestOptions);

    if (!response.ok) { 
        throw new Error("Failed to retrieve friend status.");
    }

    const data = await response.json();
    return data; // This will return an object with the isFriend boolean
};

export const getAllFriendsByUserId = async (token, id) => {
    const requestOptions = {
        method: "GET", 
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // console.log("requestOptions: ", requestOptions)

    const response = await fetch(`${BACKEND_URL}/friends/${id}/allfriends`, requestOptions);

    if (!response.ok) { 
        throw new Error("Failed to retrieve friend status.");
    }

    const data = await response.json();
    return data; // This will return an object with the isFriend boolean
};
