/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../redux/userSlice";

const PostDetails = ({toggleTheme}) => {
  const { postId } = useParams();
  const dispatch = useDispatch()
  const inpRef = useRef()
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setcomment] = useState("");
  const [postData, setpostData] = useState({});
  const [currentImageIndex, setcurrentImageIndex] = useState(0);
  const [loading, setloading] = useState(true);
  
  const handleArrowClick = (direction) => {
    const newIndex =
      direction == "left"
        ? (currentImageIndex - 1 + postData.pictures.length) %
          postData.pictures.length
        : (currentImageIndex + 1) % postData.pictures.length;

    setcurrentImageIndex(newIndex);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/fetchPost/${postId}`);
        const data = await res.json();
        if (!data.error) {
          setloading(false);
          setpostData(data);
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postId, postData]);

  const handleLikes = async () => {
    try {
      const res = await fetch(`/api/updateLikes/${postData._id}`, {
        method: "PUT",
      });
      const data = await res.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const isLike =
    postData.likes &&
    postData.likes.find((like) => {
      return like.toString() === currentUser._id;
    });

  const handleChange = (e) => {
    setcomment(e.target.value);
  };

  const addComment = async () => {
    try {
      const res = await fetch(`/api/addComment/${postData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });
      const data = await res.json();
      if (!data.error) {
        setcomment("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const savePost = async () => {
    try {
      const res = await fetch(`/api/savePost/${postData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      if(!data.error){
        const userRes = await fetch(`/api/fetchUser/${currentUser._id}`)
        const userData = await userRes.json()
        return dispatch(loggedIn(userData))
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const isSaved = currentUser.saves.includes(postData._id);

  if (loading) {
    return <p className=" ">Loading...</p>;
  }

  return (
    <div className=" flex items-center justify-center">
      <div className={` flex mt-16 flex-col sm:flex-row w-full shadow-xl sm:max-w-3xl ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} overflow-hidden rounded-xl h-[34rem] sm:overflow-y-visible overflow-y-scroll scrollbar mx-2`}>
        <div className="flex-1 relative">
          {postData.pictures.length === 0 ? (
            <img
              src={postData.pictures[0]}
              className=" h-full w-full object-contain"
              alt=""
            />
          ) : (
            <img
              className=" h-full w-full object-contain"
              src={postData.pictures[currentImageIndex]}
              alt=""
            />
          )}
          {postData.pictures.length > 1 && (
            <div className="">
              <i
                onClick={() => {
                  handleArrowClick("left");
                }}
                className=" absolute top-[calc(50%-20px)] left-2 z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-left"
              />
              <i
                onClick={() => {
                  handleArrowClick("right");
                }}
                className=" absolute top-[calc(50%-20px)] right-2  z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-right"
              />
              <div className=" flex items-center gap-1 absolute bottom-2 justify-center w-full">
                {postData.pictures.map((picture, index) => {
                  return (
                    <i
                      key={index}
                      className={`text-sm hover:scale-110 transition-all duration-300 cursor-pointer text-[#027FFE] fa-circle ${
                        index === currentImageIndex ? "fa-solid" : "fa-regular"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="  flex-1 flex flex-col gap-3 ">
          <div className={` sticky ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} z-10 border-b-2 border-[#363636] p-2  top-0 flex items-center justify-between`}>
            <div className=" flex items-center gap-3">
              <div className=" overflow-hidden rounded-full flex items-center justify-center h-9 w-9">
                {postData.user.profileimage ? (
                  <img
                    src={postData.user.profileimage}
                    className=" h-full w-full object-contain"
                    alt=""
                  />
                ) : (
                  <i className="  text-2xl fa-solid fa-user" />
                )}
              </div>
              <Link
                className=" cursor-pointer underline"
                to={`/${postData.user.username}`}
              >
                <p>{postData.user.username}</p>
              </Link>
            </div>
          </div>

          <div className="flex-1 px-2 overflow-y-scroll scrollbar ">
            <div className=" flex items-center gap-3">
              <div className=" overflow-hidden rounded-full h-9 flex items-center justify-center w-9">
                {postData.user.profileimage ? (
                  <img
                    src={postData.user.profileimage}
                    className=" h-full w-full object-contain"
                    alt=""
                  />
                ) : (
                  <i className="  text-2xl fa-solid fa-user" />
                )}
              </div>
              <Link
                className=" cursor-pointer underline"
                to={`/${postData.user.username}`}
              >
                <p>{postData.user.username}</p>
              </Link>
            </div>
            <p>{postData.description}</p>
            <p>{postData.location}</p>
            <div className=" w-full mt-8">
              
              {postData.comments.map((comment, index) => {
                return (
                  <div
                    key={index}
                    className={`${toggleTheme === 'dark'? 'bg-[#363636]': 'bg-white'} rounded-lg p-1 mb-2`}
                  >
                    <div className=" flex items-center gap-2">
                      <div className=" h-9 w-9 rounded-full">
                        <img
                          src={comment.user.profileimage}
                          className=" h-full w-full object-contain"
                          alt=""
                        />
                      </div>
                      <div className="">
                        <p>{comment.user.username}</p>
                        <p className=" text-sm opacity-80">{}</p>
                      </div>
                    </div>
                    <p className=" break-words">{comment.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className=" p-2 border-b-2 border-y-2 border-[#363636]">
            <div className=" flex items-center justify-between mb-3">
              <div className="flex items-center gap-5">
                <i
                  onClick={handleLikes}
                  className={` text-2xl cursor-pointer transition-all duration-300 hover:scale-110  fa-solid fa-thumbs-up ${
                    isLike ? "text-[#027FFE]" : ""
                  }`}
                />
                <i onClick={() => {
                  inpRef.current.focus()
                }} className=" text-2xl cursor-pointer transition-all duration-300 hover:scale-110  fa-regular fa-comment" />
                
              </div>
              <i onClick={savePost} className={` text-2xl ${isSaved ? 'text-[#027FFE] fa-solid': 'fa-regular'}  fa-bookmark cursor-pointer transition-all duration-300 hover:scale-110`} />
            </div>
            <p>{postData.likes.length} likes</p>
            <p className=" opacity-80 text-xs">
              {moment(postData.createdAt).fromNow()}
            </p>
          </div>

          <div className="px-2 flex gap-2 items-center justify-between">
            <textarea
              className=" bg-transparent flex-1 outline-none"
              name="comment"
              placeholder="Add a comment..."
              onChange={handleChange}
              value={comment}
              ref={inpRef}
            />
            <button
              onClick={addComment}
              className="text-[#027FFE] cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
