export const FriendList = () => {

    return (
        <>
            <div className="allfriends">
                <br></br>
                <h2>Friends</h2>
                <div className="friends">
                    {[...posts].map((post) => (
                        <Post post={post} key={post._id} token={token} setNewPost={setPostChanged}/>
                    ))}
                </div>
            </div>
        </>
    );
}