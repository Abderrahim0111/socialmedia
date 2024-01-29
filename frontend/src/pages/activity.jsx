/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import LikedPosts from "../components/likedPosts";
import CommentedPosts from "../components/commentedPosts";

const Activity = ({ toggleTheme }) => {
  const [isLikes, setisLikes] = useState(true);
  const [isComments, setisComments] = useState(false);
  const [likedPosts, setlikedPosts] = useState([]);
  const [commentedPosts, setcommentedPosts] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await fetch("/api/fetchLikedPosts");
        const data = await res.json();
        if (!data.error) {
          setlikedPosts(data);
          return setloading(false);
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error.message);
      }
    };
    const fetchCommentedPosts = async () => {
        try {
          const res = await fetch("/api/fetchCommentedPosts");
          const data = await res.json();
          if (!data.error) {
            setcommentedPosts(data);
            return setloading(false);
          }
          setloading(false);
        } catch (error) {
          setloading(false);
          console.log(error.message);
        }
      };
    fetchCommentedPosts()
    fetchLikedPosts();
  }, [likedPosts, commentedPosts]);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="mx-2">
      <div className=" border-2 border-[#363636] max-w-lg mx-auto px-3 pb-3 rounded-xl h-[77.5vh] overflow-y-scroll scrollbar">
        <div className={`flex items-center justify-between border-b-2 pt-3 mb-7 border-[#363636] text-lg ${toggleTheme === 'dark'? 'bg-black': 'bg-white'} z-10 sticky top-0`}>
          <p
            onClick={() => {
              setisLikes(true);
              setisComments(false);
            }}
            className={` cursor-pointer ${
              isLikes
                ? `${
                    toggleTheme === "dark"
                      ? "border-[#F1F2F5]"
                      : "border-[#363636]"
                  } border-b-2 font-semibold`
                : ""
            } pb-2  `}
          >
            Posts I liked
          </p>
          <p
            onClick={() => {
              setisLikes(false);
              setisComments(true);
            }}
            className={` cursor-pointer ${
              isComments
                ? `${
                    toggleTheme === "dark"
                      ? "border-[#F1F2F5]"
                      : "border-[#363636]"
                  } border-b-2 font-semibold`
                : ""
            } pb-2  `}
          >
            Posts I commented
          </p>
        </div>

        { isLikes && <LikedPosts {...{likedPosts}} />}
        { isComments && <CommentedPosts {...{commentedPosts}} />}
      </div>

    </div>
  );
};

export default Activity;
