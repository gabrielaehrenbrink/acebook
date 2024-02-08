// frontend/src/components/Comment/CreateNewComment.jsx

import React, { useEffect, useRef, useState } from 'react';
import { getUser } from "../../services/users"
import { submitComment } from "../../services/comments";
import "./newComment.css"

const CreateNewComment = (props) => {
    const [text, setText] = useState('');
    const [user, setUser] = useState({});
    const [token, setToken] = useState(window.localStorage.getItem("token"))
    const id = window.localStorage.getItem("id")
    const [error, setError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault();
        // const timestamp = new Date().toISOString(); // Generate timestamp
        // author: user.full_name, 
        const charLimit = 200
        if (text.length > charLimit) {
            return setError(`Over character limit of ${charLimit}`)
        }
        const comment = {userId: id, commentText: text, postId: props.post_id }; 
        setText(''); // Reset the text field after submitting
        submitComment(comment, token)
            .then((data) => {
                console.log(data)
                props.setNewComment(true)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getUser(token, id)
            .then((data) => {
                setUser(data.user)
                setToken(data.token);
                window.localStorage.setItem("token", data.token);
            })
            .catch((error) => {
                console.error(error)
            })
    }, [token, id])

    const textAreaRef = useRef(null)
    useEffect(() => {
        textAreaRef.current.style.height = "auto"
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }, [text])

    return (
        <div className='user-comment'>
            <img src={user.profile_pic} alt="" className='profile-pic'/>
            <form className="comment-form" onSubmit={handleSubmit}>
            <textarea className="comment-text-area"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (text.trim() !== '') {
                            handleSubmit(e);
                        }
                    }
                }}
                placeholder="Write a comment..."
                rows={1}
                ref={textAreaRef}
                required={true}
            />
                {/* <button type="submit">Submit Comment!</button> */}
            </form>
            {error ? (<p className='error-message'>{error}</p>) : null}
        </div>
    );
};

export default CreateNewComment;

