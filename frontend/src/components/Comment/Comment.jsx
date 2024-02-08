// frontend/src/components/Comment/Comment.jsx

import React, { useEffect, useState, useRef  } from 'react';
import "./comment.css"
import { deleteComment } from '../../services/comments';
import { getAllLikesByCommentId, likeComment } from '../../services/comments';
import { calculateTimeSincePost } from '../dateTimeLogic';
import { editComment } from '../../services/comments';
import LikeButton from "../Buttons/LikeButton/LikeButton.jsx"

const Comment = ({ comment_data, setNewComment }) => {
    const [showOptions, setShowOptions] = useState(false)
    const handleOptions = () => {
        setShowOptions(!showOptions)
    }
    const id = window.localStorage.getItem("id")
    const token = window.localStorage.getItem("token")
    const [isLiked, setIsLiked] = useState(false);
    const [numberOfLikes, setNumberOfLikes] = useState(0);
    const [date, setDate] = useState(null)
    const [editedComment, setEditedComment] = useState(comment_data.message);
    const [editingComment, setEditingComment] = useState(false)

    const handleDeleteComment = async () => {
        try {
            await deleteComment(token, comment_data._id);
            console.log("Comment deleted");
            setNewComment(true)
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    }

    useEffect(() => {
        const fetchLikes = async () => {
            try {
              const likesData = await getAllLikesByCommentId(comment_data._id, token);
              setIsLiked(likesData.userLiked);
              setNumberOfLikes(likesData.numberOfLikes);
            } catch (error) {
              console.error("Error fetching likes:", error);
            }
        };
        fetchLikes()
    }, [isLiked])


    const handleEditComment = async () => {
        handleOptions()
        setEditingComment(!editingComment)
    }

    const handleLikeClick = async () => {
        try {
          await likeComment(comment_data._id, token);
          setIsLiked(!isLiked);
        } catch (error) {
          console.error("Error liking the post:", error.message);
        }
    };

    useEffect(() => {
      if (comment_data.createdAt != null) {
        setDate(calculateTimeSincePost(comment_data.createdAt))
      }
    })

    const updateComment = async () => {
        try {
            await editComment(token, comment_data._id, editedComment);
            console.log("Comment Successfully Edited!")
            setNewComment(true);
            setEditingComment(!editingComment)
        } catch (error) {
            console.error("Error Editing Comment:", error);
            console.log("Error Editing Comment!")
        }
    }

    const textAreaRef = useRef(null)
    useEffect(() => {
        if (editingComment) {
            textAreaRef.current.style.height = "auto"
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
        }
    }, [editedComment])

    return (
        <div className="comment">
            <div className='comment-user'>
                <img src={comment_data.profile_pic} alt="" className='profile-pic'/>
                <div className='date-and-time-comment'>
                    <h5 className="comment-author">{comment_data.full_name}</h5>
                    <p className=''>{date}</p>
                </div>
                {comment_data.user_id == id && (
                <button className='options' onClick={handleOptions}>
                    <img className="options-button-image" src="http://localhost:5173/public/three-dots.svg" alt="" />
                </button>
                )}
                {showOptions && (
                    <div className='options-menu'>
                        <button onClick={handleEditComment}>Edit</button>
                        <button onClick={handleDeleteComment}>Delete</button>
                    </div>
                )}
            </div>
            {!editingComment ? 
            <p className="comment-text">{comment_data.message}</p> :
            <textarea value={editedComment} 
                onChange={(e) => setEditedComment(e.target.value)} 
                onBlur={updateComment}
                ref={textAreaRef}
            />
            }
            
            <div className="post-actions">
                <LikeButton handleLikeClick={handleLikeClick} isLiked={isLiked} numberOfLikes={numberOfLikes}></LikeButton>
            </div>
        </div>
    );
};

export default Comment;