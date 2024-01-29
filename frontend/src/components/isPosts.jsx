/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import CreatePost from "./createPost";
import { useState } from "react";
import { useSelector } from "react-redux";

const IsPosts = ({ userPosts, toggleTheme, username }) => {
  const {currentUser} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const [showModal, setshowModal] = useState(false);
  return (
    <>
      {userPosts.length === 0 && username === currentUser.username ?  (
        <div className=" flex flex-col items-center mt-5 gap-5">
          <i className=" border-2 text-[#262626] border-[#262626] h-14 w-14 flex items-center justify-center rounded-full text-3xl fa-solid fa-camera" />
          <h1 className=" text-3xl font-bold">Share Photos</h1>
          <p className=" text-sm text-center">
            When you share photos, they will appear on your <br />
            profile.
          </p>
          <button
            onClick={() => {
              setshowModal(true);
            }}
            className="text-[#027FFE]"
          >
            Share your first photo
          </button>
          {showModal && <CreatePost {...{ setshowModal, toggleTheme }} />}
        </div>
      ) : (
        <div className=" flex gap-1 flex-wrap">
          {userPosts.map((userPost, index) => {
            return (
              <div
                className="relative h-[7.6rem] w-[7.6rem] sm:h-64 sm:w-64 group cursor-pointer border-2 border-[#262626]"
                key={index}
                onClick={() => {
                  navigate(`/p/${userPost._id}`);
                }}
              >
                <img
                  className="h-full w-full object-contain"
                  src={userPost.pictures[0]}
                  alt="image"
                />
                <div className={`hidden group-hover:flex bg-[#00000099] ${toggleTheme === 'dark' ? ' ' : ' text-white'}  justify-center gap-10 absolute top-0 bottom-0 left-0 right-0`}>
                  <p className="text-xl flex items-center gap-2">
                    <span>{userPost.likes.length}</span>
                    <i className="fa-solid fa-heart" />
                  </p>
                  <p className="text-xl flex items-center gap-2">
                    <span>{userPost.comments.length}</span>
                    <i className="fa-solid fa-comment" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default IsPosts;
