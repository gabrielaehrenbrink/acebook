import { useEffect, useState } from "react";
import "./FriendList.css"
import {getAllFriendsByUserId} from "../../services/friends.js"
import { Friend } from "./Friend.jsx";
import React from "react";

export const FriendList = ({ userId }) => {
    const id = userId;
    const [friends, setFriends] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem("token"))

useEffect(() => {
    const fetchFriends = async () => {
        try {
        const friendsData = await getAllFriendsByUserId(token, id);

        setFriends(friendsData.friends);
        } catch (error) {
        console.error("Error fetching friends:", error);
        }
    };
    
    if (token && id) {
        fetchFriends();
    }
}, [id, token, friends]);

    return (
        <>
            <div className="allfriends">
                    {friends[0] ? [...friends].map((friend) => (
                        <Friend friend={friend} key={friend.user_id} token={token}/>
                    )) : <p>No friends to show</p> } 
            </div>
        </>
    );
}