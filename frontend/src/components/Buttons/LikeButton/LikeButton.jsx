const LikeButton = (props) => {

    return (
        <div className="like-btn" onClick={props.handleLikeClick}>
            <i className={props.isLiked ? "fas fa-thumbs-up" : "far fa-thumbs-up"}></i>
            <span>Likes: {props.numberOfLikes}</span>
        </div>
    )
    }

export default LikeButton;