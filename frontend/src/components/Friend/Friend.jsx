import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Friend = ({friend}) => {
    // using the userId, get that user object
    // get user.image and user.full_name

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate(`/profile/${friend.user_id}`);
    };

    return (
        <div>
            <a onClick={navigateToProfile} className="friend-container">
                <img src={friend.profile_pic} alt="" className='profile-pic'/>
                <h4>{friend.full_name}</h4>
            </a>
        </div>
    );
}