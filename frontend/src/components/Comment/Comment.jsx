// frontend/src/components/Comment/Comment.jsx

import React, { useState } from 'react';
import "./comment.css"

const Comment = ({ comment_data }) => {
    const [showOptions, setShowOptions] = useState(false)
    const handleOptions = () => {
        setShowOptions(!showOptions)
    }

    const [isLiked, setIsLiked] = useState(false);
    const [numberOfLikes, setNumberOfLikes] = useState(0);

    const handleLikeClick = async () => {
        try {
          // Call the likePost function to send the like request to the backend
          //await likePost(post._id, token);
    
          // Toggle the like status in the UI
          //setIsLiked(!isLiked);
        } catch (error) {
          //console.error("Error liking the post:", error.message);
        }
      };

    return (
        <div className="comment">
            <div className='comment-user'>
                <img src={comment_data.profile_pic} alt="" className='profile-pic'/>
                <h5 className="comment-author">{comment_data.full_name}</h5>
                <button className='options' onClick={handleOptions}>...</button>
                {showOptions && (
                    <div className='options-menu'>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                )}
            </div>
            <p className="comment-text">{comment_data.message}</p>
            <div className="post-actions">
                <div className="like-btn" onClick={handleLikeClick}>
                {/* Display "Like" or "Unlike" based on the isLiked state */}
                <label>Likes: {numberOfLikes}</label>
                <button>{isLiked ? "Unlike" : "Like"}</button>
                </div>
            </div>
        </div>
    );
};

export default Comment;