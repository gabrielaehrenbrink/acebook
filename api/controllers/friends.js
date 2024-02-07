// api/controllers/friends.js

const Friend = require("../models/friend");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");

const befriend = async (req, res) => {
  try {
    const currentUserId = req.user_id;
    const friendUserId = new mongoose.Types.ObjectId(req.params.id); // ID of the user to befriend

    // find the Friend document for the current user. If it doesn't exist, create one.
    const friendDoc = await Friend.findOneAndUpdate(
      { user_id: currentUserId },
      { $addToSet: { friends: friendUserId } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Friend added successfully", friendDoc });
  } catch (error) {
    console.error("Error befriending user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const unfriend = async (req, res) => {
  try {
    const currentUserId = req.user_id;
    const friendUserId = new mongoose.Types.ObjectId(req.params.id); // The ID of the user to unfriend

    // find the Friend document for the current user and remove the friend's user_id from the friends array.
    const friendDoc = await Friend.findOneAndUpdate(
      { user_id: currentUserId },
      { $pull: { friends: friendUserId } },
      { new: true }
    );

    if (!friendDoc) {
      return res.status(404).json({ message: "Friend document not found." });
    }

    res.status(200).json({ message: "Friend removed successfully", friendDoc });
  } catch (error) {
    console.error("Error unfriending user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFriendStatus = async (req, res) => {
  try {
    // console.log("req.params.id:", req.params.id); // This will print the ID to the terminal

    const currentUserId = req.user_id;
    const potentialFriendId = new mongoose.Types.ObjectId(req.params.id);

    // Find the Friend document for the current user
    const friendDoc = await Friend.findOne({ user_id: currentUserId });

    // Check if the potential friend's ID is in the current user's friends array
    const isFriend = friendDoc ? friendDoc.friends.some(friendId => friendId.equals(potentialFriendId)) : false;

    res.status(200).json({ isFriend });
  } catch (error) {
    console.error("Error checking friendship status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const FriendsController = {
  befriend: befriend,
  unfriend: unfriend,
  getFriendStatus: getFriendStatus,
};


module.exports = FriendsController;
