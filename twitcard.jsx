// src/Components/Home/MiddlePart/TwitCard/TwitCard.jsx
import React, { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import {
  createRetweet,
  deleteTweet,
  likeTweet,
  restoreTweet,
  editTweet,
} from "../../../../Store/Tweet/Action";
import { useLocation, useNavigate } from "react-router-dom";
import ReplyModal from "./ReplyModal";
import { formatTweetTime } from "../../../../Utils/TimeUtils";

const TwitCard = ({ twit }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  // Local UI state (kept in sync when twit prop changes)
  const [isLiked, setIsLiked] = useState(twit?.isLiked || twit?.liked || false);
  const [likes, setLikes] = useState(twit?.totalLikes || 0);
  const [isRetwit, setIsRetwit] = useState(
    twit?.retwitUsersId?.includes(auth.user?.id) || false
  );
  const [retwit, setRetwit] = useState(twit?.totalRetweets || 0);
  const [openReplyModel, setOpenReplyModel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(twit?.content || "");

  useEffect(() => {
    setIsLiked(twit?.isLiked || twit?.liked || false);
    setLikes(twit?.totalLikes || 0);
    setIsRetwit(twit?.retwitUsersId?.includes(auth.user?.id) || false);
    setRetwit(twit?.totalRetweets || 0);
    if (!isEditing) setEditContent(twit?.content || "");
  }, [twit, auth.user?.id]);

  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openDeleteMenu = Boolean(anchorEl);

  const user = twit?.user || {};

  const handleOpenDeleteMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseDeleteMenu = () => setAnchorEl(null);

  const handleLikeTweet = (num) => {
    if (twit?.deleted) return;
    dispatch(likeTweet(twit.id));
    setIsLiked(!isLiked);
    setLikes((prev) => prev + num);
  };

  const handleCreateRetweet = () => {
    if (twit?.deleted) return;
    dispatch(createRetweet(twit.id));
    setRetwit((prev) => (isRetwit ? prev - 1 : prev + 1));
    setIsRetwit(!isRetwit);
  };

  const handleDeleteTwit = () => {
    dispatch(deleteTweet(twit.id));
    // optimistic UI change:
    twit.deleted = true;
    handleCloseDeleteMenu();
  };

  const handleRestoreTwit = () => {
    dispatch(restoreTweet(twit.id));
    handleCloseDeleteMenu();
  };

  const handleStartEdit = () => {
    setEditContent(twit?.content || "");
    setIsEditing(true);
    handleCloseDeleteMenu();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(twit?.content || "");
  };

  const handleSaveEdit = () => {
    const newContent = (editContent || "").trim();
    if (!newContent || newContent === twit.content) {
      setIsEditing(false);
      return;
    }
    dispatch(
      editTweet(twit.id, {
        content: newContent,
        image: twit.image || null,
      })
    );
    setIsEditing(false);
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 ${
        twit?.deleted ? "opacity-50" : ""
      }`}
    >
      {auth.user?.id !== user.id &&
        location.pathname === `/profile/${auth.user?.id}` && (
          <div className="flex items-center font-semibold text-gray-700 py-2">
            <RepeatIcon />
            <p className="ml-3">You Retweet</p>
          </div>
        )}

      <div className="flex space-x-5">
        <Avatar
          onClick={() => user.id && navigate(`/profile/${user.id}`)}
          alt="Avatar"
          src={user.image || ""}
          className="cursor-pointer"
        />

        <div className="w-full">
          <div className="flex justify-between items-center">
            <div
              onClick={() => user.id && navigate(`/profile/${user.id}`)}
              className="flex cursor-pointer items-center space-x-2"
            >
              <span className="font-semibold">
                {user.fullName || "Unknown User"}
              </span>
              {user.fullName && (
                <span className="text-gray-600">
                  @{user.fullName.toLowerCase().split(" ").join("_")}
                </span>
              )}
              <span className="text-gray-500 text-sm">
                · {formatTweetTime(twit.createdAt)}
              </span>
              {user.verified && (
                <img
                  className="ml-2 w-5 h-5"
                  src="https://abs.twimg.com/responsive-web/client-web/verification-card-v2@3x.8ebee01a.png"
                  alt="verified"
                />
              )}
            </div>

            <div>
              <Button onClick={handleOpenDeleteMenu}>
                <MoreHorizIcon
                  id="basic-button"
                  aria-controls={openDeleteMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDeleteMenu ? "true" : undefined}
                />
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openDeleteMenu}
                onClose={handleCloseDeleteMenu}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                {user.id === auth.user?.id && !twit.deleted && (
                  <MenuItem onClick={handleStartEdit}>Edit</MenuItem>
                )}
                {user.id === auth.user?.id && !twit.deleted && (
                  <MenuItem onClick={handleDeleteTwit}>Delete</MenuItem>
                )}
                {user.id === auth.user?.id && twit.deleted && (
                  <MenuItem onClick={handleRestoreTwit}>Restore</MenuItem>
                )}
                <MenuItem onClick={() => navigate(`/twit/${twit.id}`)}>
                  Details
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div className="mt-2">
            <div
              className="cursor-pointer"
              onClick={() => !isEditing && navigate(`/twit/${twit.id}`)}
            >
              {!isEditing ? (
                <p className="mb-2 p-0">{twit.content}</p>
              ) : (
                <div className="mb-3">
                  <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                    maxLength={280}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
              {twit.image && (
                <img
                  className="w-[28rem] border border-gray-400 p-5 rounded-md"
                  src={twit.image}
                  alt="tweet-img"
                />
              )}
              {twit.video && (
                <div className="flex flex-col items-center w-full border border-gray-400 rounded-md">
                  <video
                    className="max-h-[40rem] p-5"
                    controls
                    src={twit.video}
                  />
                </div>
              )}
            </div>

            <div className="py-5 flex flex-wrap justify-between items-center">
              <div className="space-x-3 flex items-center text-gray-600">
                <span
                  className="cursor-pointer rounded-full hover:bg-gray-100 p-2 transition"
                  onClick={() => setOpenReplyModel(true)}
                >
                  <ChatBubbleOutlineIcon />
                </span>
                {twit.totalReplies > 0 && <p>{twit.totalReplies}</p>}
              </div>

              <div
                className={`${
                  isRetwit ? "text-pink-600" : "text-gray-600"
                } space-x-3 flex items-center`}
              >
                <RepeatIcon
                  className="cursor-pointer"
                  onClick={handleCreateRetweet}
                />
                {retwit > 0 && <p>{retwit}</p>}
              </div>

              <div
                className={`${
                  isLiked ? "text-red-600" : "text-gray-600"
                } space-x-3 flex items-center`}
              >
                {isLiked ? (
                  <FavoriteIcon onClick={() => handleLikeTweet(-1)} />
                ) : (
                  <FavoriteBorderIcon onClick={() => handleLikeTweet(1)} />
                )}
                {likes > 0 && <p>{likes}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReplyModal
        twitData={twit}
        open={openReplyModel}
        handleClose={() => setOpenReplyModel(false)}
      />
    </div>
  );
};

export default TwitCard;
