// frontend/src/components/Comment/CommentsList.jsx

import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import { getAllCommentsForAPost } from "../../services/comments"
import CreateNewComment from './CreateNewComment';

const CommentsList = (props) => {
    const token = window.localStorage.getItem("token")
    const id = window.localStorage.getItem("id")
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(false)
    const [totalComments, setTotalComments] = useState(0)
    const [loadCycle, setLoadCycle] = useState(1)

    useEffect(() => {
        getAllCommentsForAPost(token, props.postId, loadCycle)
        .then((data) => {
            setComments(data.comments)
            setTotalComments(data.totalComments)
            setNewComment(false)
        }
        )
    }, [token, id, newComment])
    //<p>Total comments: {totalComments}</p>

    const loadMoreComments = () => {
        var x = loadCycle
        setLoadCycle(x + 1)
        setNewComment(true)
    }

    return (
        <>
            {[...comments].map((comment) => (
                    <Comment key={comment._id} comment_data={comment} setNewComment={setNewComment} token={token}/>
            ))}
            {totalComments > comments.length ? <button onClick={loadMoreComments}>Show more Comments</button> : null}
            <CreateNewComment 
            post_id={props.postId} setNewComment={setNewComment}/>
        </>
    );
};

export default CommentsList;
