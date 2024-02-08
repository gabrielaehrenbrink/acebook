// frontend/src/pages/Feed/FeedPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar"; 
import "./FeedPage.css";
import "../Profile/profilePage.css"
import CreateNewPost from "../../components/Post/CreateNewPost";
import { getUser } from "../../services/users";
import { FriendList } from "../../components/Friend/FriendList";

export const FeedPage = () => {
  document.title = "Posts"
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const [postChanged, setPostChanged] = useState(false);
  const navigate = useNavigate();
  const id = window.localStorage.getItem("id")
  const [newPost, setNewPost] = useState(false)

  const [totalPosts, setTotalPosts] = useState(0)
  const [loadCycle, setLoadCycle] = useState(1)
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const [allPostsRead, setAllpostsRead] = useState(false)

  useEffect(() => {
    if (token) {
      getPosts(token, loadCycle)
        .then((data) => {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts)
          setToken(data.token);
          window.localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
        });
      getUser(token, id)
        .then((data) => {
            setUser(data.user)
        })
        .catch((error) => {
            console.error(error)
        })
    } else {
      navigate("/login");
    }
  }, [token, navigate]); //Needed if useEffect is used anywhere else

  useEffect(() => {
    if (token) {
      getPosts(token, loadCycle)
        .then((data) => {
          setPosts(data.posts);
          setToken(data.token);
          setPostChanged(false)
          //console.log(data.posts.length, totalPosts)
          if (data.posts.length < totalPosts) {
            setHasReachedBottom(false)
          } else if (data.posts.length === totalPosts) {
            setAllpostsRead(true)
          }
          window.localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [postChanged])

  if (!token) {
    return;
  }

  useEffect(() => {
    const handleScroll = () => {
      let scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      let scrolledToBottom = window.scrollY >= scrollableHeight -1;
      
      if (scrolledToBottom && !hasReachedBottom) {
        setLoadCycle(prevLoadCycle => prevLoadCycle + 1)
        setPostChanged(true)
        setHasReachedBottom(true)
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasReachedBottom]);

  return (
    <>
      <Navbar />

      <div className="posts-and-friends-container">
        <div className="friendlist">
            <br></br>
            <h2>My Friends</h2>
            <FriendList userId={id}/>
        </div>

        <div className="allposts">
          <br></br>
          <br></br>
          <CreateNewPost token={token} setPostChanged={setPostChanged}/>
          <br></br>
          <h2>Posts</h2>
          <div className="feed" role="feed">
            {[...posts].map((post) => (
                <Post post={post} key={post._id} token={token} setNewPost={setPostChanged}/>
            ))}
          </div>
        </div>
      </div>

      {allPostsRead ? <p>No new posts to display!</p> : null}
    </>
  );
};
