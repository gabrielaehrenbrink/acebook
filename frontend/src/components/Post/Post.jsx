// frontend/src/components/Post/Post.jsx

import React, { useEffect, useState, useRef } from "react";
import "./Post.css";
import { likePost, getAllLikesByPostId, editPost, deletePost } from "../../services/posts";
import CommentsList from "../Comment/CommentsList";
import { calculateTimeSincePost } from "../dateTimeLogic";
import { useNavigate } from "react-router-dom";
import LikeButton from "../Buttons/LikeButton/LikeButton.jsx"


const Post = ({ post, token, setNewPost }) => {
  const id = window.localStorage.getItem("id")
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [toggleCommentForm, setToggleCommentForm] = useState(false);
  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate(`/profile/${post.user_id}`);
  };
  const [date, setDate] = useState(null)
  const [editedPost, setEditedPost] = useState(post.message);
  const [showOptions, setShowOptions] = useState(false)
  const handleOptions = () => {
      setShowOptions(!showOptions)
  }
  const [editingPost, setEditingPost] = useState(false)

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesData = await getAllLikesByPostId(post._id, token);

        setIsLiked(likesData.userLiked);
        setNumberOfLikes(likesData.numberOfLikes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
  
    if (token && post._id) {
      fetchLikes();
    }
  }, [post._id, token, numberOfLikes, isLiked, setNewPost]);
  

  // Function to handle liking/unliking a post
  const handleLikeClick = async () => {
    try {
      // Call the likePost function to send the like request to the backend
      await likePost(post._id, token);

      // Toggle the like status in the UI
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking the post:", error.message);
    }
  };

  // Function to handle opening of the comment form
  const handleCommentClick = async () => {
    setToggleCommentForm(!toggleCommentForm);
  };

  useEffect(() => {
    if (post.createdAt != null) {
      setDate(calculateTimeSincePost(post.createdAt))
    }
  })
  
  
  const handleDeletePost = async () => {
    try {
        await deletePost(token, post._id);
        console.log("Post deleted");
        setNewPost(true)
    } catch (error) {
        console.error("Error deleting comment", error);
    }
}
  
  
  const handleEditPost = async () => {
    handleOptions()
    setEditingPost(!editingPost)
  }

  const updatePost = async () => {
    try {
        await editPost(token, post._id, editedPost);
        console.log("Comment Successfully Edited!")
        setNewPost(true);
        setEditingPost(!editingPost)
    } catch (error) {
        console.error("Error Editing Post:", error);
    }
  }

  const textAreaRef = useRef(null)
  useEffect(() => {
      if (editingPost) {
          textAreaRef.current.style.height = "auto"
          textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
      }
  }, [editedPost])

  return (
    <div className="post" id={post._id}>
      <div className="post-header">
        <a onClick={navigateToProfile} className="author-container">
          <img src={post.profile_pic} alt={`Author's avatar`} />
          <div className="date-and-time">
            <h4>{post.full_name}</h4>
            <p className="post-time">{date}</p>
          </div>
        </a>
      </div>
      {post.user_id == id && (<button className='options-button' onClick={handleOptions}>
        <img className="options-button-image" src="http://localhost:5173/public/three-dots.svg" alt="" />
      </button>)}
      {showOptions && (
          <div className='post-options-menu'>
              <button onClick={handleEditPost}>Edit</button>
              <button onClick={handleDeletePost}>Delete</button>
          </div>  
      )}
      <div className="post-content">
        {!editingPost ?
        <article>{post.message}</article> :
        <textarea value={editedPost} 
          onChange={(e) => setEditedPost(e.target.value)} 
          onBlur={updatePost}
          ref={textAreaRef}
        />
        }
        {post.image != undefined && post.image != ""  ? ( <img src={post.image} className="post-image"/>): null} 
      </div>
      <div className="post-actions">
        <LikeButton handleLikeClick={handleLikeClick} isLiked={isLiked} numberOfLikes={numberOfLikes}></LikeButton>
        <div className="comment-btn">
          <button onClick={handleCommentClick} >Comments</button>
        </div>
      </div>
      {toggleCommentForm ? 
      <div className="feed" role="feed">
        <div>
          <CommentsList postId={post._id}/>
        </div> 
      </div>
      : <></>}
    </div>
  );
};

export default Post;