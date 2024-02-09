// CreateNewPost.jsx

import React, { useState, useRef, useEffect } from "react";
import { createPost } from "../../services/posts";
import "./CreateNewPost.css";

const CreateNewPost = ({ token, setPostChanged }) => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState("");
    

    const handleImageChange = (event) => {
        console.log(event.target.files[0]);
        setImage(event.target.files[0]); // Update state with selected images
    };

    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("message", message);
        
        formData.append("images", image);
        
        formData.append("user_id", window.localStorage.getItem("id"));


        // const postData = {
        //     message: message,
        //     user_id: window.localStorage.getItem("id"),
        // };

        try {
            const result = await createPost(token, formData);
            setPostChanged(true)
            setMessage("")
            setImage("")
            // console.log(result);
            // Optionally, you can update the state or perform any other actions after creating the post.
        } catch (error) {
            console.error(error.message);
        }
    };

    const textAreaRef = useRef(null)
    useEffect(() => {
        textAreaRef.current.style.height = "auto"
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }, [message])

    return (
        <div className="feed-container">
            <form className="feed-form" onSubmit={handleSubmit}>
                <label className="feed-label">
                    What's on your mind? 
                </label>
                <div className='input-and-button-container'>
                    <textarea
                        className="feed-input"
                        name="message"
                        type="text"
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required={true}
                        ref={textAreaRef}
                        onKeyDown={(e) => {
                            if (e && e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                if (message.trim() !== '') {
                                    handleSubmit(e);
                                }
                            }
                        }}
                    />
                    <button className="feed-button" type="submit">
                        Share
                    </button>
                </div>
                <div className="upload-a-picture">
                    <button>{!image ? "Add a photo" : `Photo Added\n${image.name}`}</button>
                    <input
                        name="images"
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
            </form>
        </div>
    );
};

export default CreateNewPost;
