// frontend/src/pages/Profile/profilePage.jsx

import Navbar from "../../components/Navbar/Navbar.jsx";
import { useState, useEffect } from "react";
import { getUser } from "../../services/users"
import "./profilePage.css"
import Post from "../../components/Post/Post.jsx";
import { getPostsByUser } from "../../services/posts";
import { useParams } from "react-router-dom";
import { befriend, unfriend, getFriendStatus} from "../../services/friends";

export const ProfilePage = () => {
    document.title = "Profile Page"
    
    const [user, setUser] = useState({});
    const [token, setToken] = useState(window.localStorage.getItem("token"))
    const { userId } = useParams();
    const currentUserId = window.localStorage.getItem("id");
    const [posts, setPosts] = useState([]);
    const [isFriend, setIsFriend] = useState(false);
    const myProfilePage = () => {
        if (userId === currentUserId) {
            return true
        }
    }

    useEffect(() => {
        getUser(token, userId)
            .then((data) => {
                setUser(data.user)
            })
            .catch((error) => {
                console.error(error)
            })
        getPostsByUser(token, userId)
            .then((data) => {
                setPosts(data.posts);
                setToken(data.token);
                window.localStorage.setItem("token", data.token);
            })
            .catch((err) => {
                console.error(err);
            });

            // console.log('Calling getFriendStatus with token:', token, 'and userId:', userId);
            getFriendStatus(token, userId)
                .then((response) => {
                    // console.log('getFriendStatus response:', response);
                    setIsFriend(response.isFriend); // Update based on the response from the server
                })
                .catch((error) => {
                    console.error("Failed to retrieve friend status:", error);
                });
    }, [token, userId])

    const handleFriendshipChange = () => {
        const action = isFriend ? unfriend : befriend;
        action(token, userId)
            .then(() => {
                setIsFriend(!isFriend); // Toggle the isFriend state
            })
            // .catch((error) => {
            //     setIsFriend(currentIsFriend => !currentIsFriend);
            //     console.error(`Failed to ${isFriend ? "remove" : "add"} friend:`, error);
            // });
    };
    

    return (
        <>
        <Navbar />
        <h1>My Profile</h1>
        
        <div className="profile">
            <div className="details-and-friend-container">
                <img src={user.profile_pic} alt="profile pic" className="profilePage_user_picture"/>
                <div className="user-details">
                    <p>Username: {user.full_name}</p>
                    <br />
                    <p>Email: {user.email}</p>
                    <br />
                    {user.about_me && <p>About Me: {user.about_me}</p>}
                </div>
                {!myProfilePage() && (
                    <button className="befriend-unfriend-button" onClick={handleFriendshipChange}>
                        {isFriend ? "Unfriend" : "Add Friend"}
                    </button>
                )}
            </div>
            <div className="posts-by-user">
                <h2>My posts</h2>
                {[...posts].reverse().map((post) => (
                    <Post post={post} key={post._id} token={token} />
                ))}
            </div>
        </div>
        </>
    )
};