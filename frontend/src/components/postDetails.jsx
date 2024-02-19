/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../redux/userSlice";
import NotFound from "../pages/notFound";

const PostDetails = ({ toggleTheme }) => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inpRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setcomment] = useState("");
  const [postData, setpostData] = useState({});
  const [currentImageIndex, setcurrentImageIndex] = useState(0);
  const [loading, setloading] = useState(true);
  const [isdelete, setisdelete] = useState(false);
  const [newComment, setnewComment] = useState("");
  const [editComment, seteditComment] = useState(false);
  const [notfound, setnotfound] = useState(false);

  const handleArrowClick = (direction) => {
    const newIndex =
      direction == "left"
        ? (currentImageIndex - 1 + postData.pictures.length) %
          postData.pictures.length
        : (currentImageIndex + 1) % postData.pictures.length;

    setcurrentImageIndex(newIndex);
  };

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.error) {
        const userRes = await fetch(`/api/fetchUser/${currentUser._id}`);
        const userData = await userRes.json();
        return dispatch(loggedIn(userData));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletePost = async () => {
    try {
      const res = await fetch(`/api/deletePost/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.error) {
        navigate("/");
      }
      setisdelete(false);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteComment = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirm) {
      return;
    }
    try {
      const res = await fetch(`/api/deleteComment/${postId}/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCommentFn = async (commentId) => {
    try {
      const res = await fetch(`/api/editComment/${postId}/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newComment: newComment }),
      });
      const data = await res.json();
      if (!data.error) {
        setnewComment("");
        seteditComment(false);
      }
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const isLike =
    postData.likes &&
    postData.likes.find((like) => {
      return like.toString() === currentUser._id;
    });

  const isSaved = currentUser.saves.includes(postData._id);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/fetchPost/${postId}`);
        const data = await res.json();
        if (!data.error) {
          setloading(false);
          setpostData(data);
        } else {
          setloading(false);
          setnotfound(true);
        }
      } catch (error) {
        setloading(false);
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postId, postData]);

  if (loading) {
    return <p className=" ">Loading...</p>;
  }

  if (notfound) {
    return <NotFound />;
  }

  return (
    <div className=" flex items-center justify-center">
      <div
        className={` flex mt-10 sm:mt-16 flex-col sm:flex-row w-full shadow-xl sm:max-w-3xl ${
          toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
        } overflow-hidden rounded-xl h-[34rem] sm:overflow-y-visible overflow-y-scroll scrollbar mx-2`}
      >
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
          <div
            className={` sticky ${
              toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
            } z-10 border-b-2 border-[#363636] p-2  top-0 flex items-center justify-between`}
          >
            <div className=" flex items-center gap-3">
              <div className=" overflow-hidden border border-[#363636] rounded-full flex items-center justify-center h-9 w-9">
                {postData.user.profileimage ? (
                  <img
                    src={postData.user.profileimage}
                    className=" h-full w-full object-contain"
                    alt=""
                  />
                ) : (
                  <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-2xl">
                    {postData.user.username[0]}
                  </div>
                )}
              </div>
              <Link
                className=" cursor-pointer underline"
                to={`/${postData.user.username}`}
              >
                <p>{postData.user.username}</p>
              </Link>
            </div>
            {postData.user._id === currentUser._id && (
              <i
                onClick={() => {
                  setisdelete(!isdelete);
                }}
                className=" text-red-500 text-xl cursor-pointer duration-300 transition-all hover:scale-110 fa-solid fa-trash relative"
              />
            )}
            {isdelete && (
              <div
                className={` absolute right-3 top-12  ${
                  toggleTheme === "dark" ? "bg-[#363636]" : "bg-white"
                } border border-[#363636] rounded-xl`}
              >
                <button
                  onClick={deletePost}
                  className=" w-full p-3 border-b-2 border-[#262626] text-red-500"
                >
                  Delete post
                </button>
                <button
                  onClick={() => {
                    setisdelete(false);
                  }}
                  className=" w-full p-3"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 px-2 overflow-y-scroll scrollbar ">
            <div className=" flex items-center gap-3">
              <div className=" overflow-hidden border border-[#363636] rounded-full h-9 flex items-center justify-center w-9">
                {postData.user.profileimage ? (
                  <img
                    src={postData.user.profileimage}
                    className=" h-full w-full object-contain"
                    alt=""
                  />
                ) : (
                  <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-2xl">
                    {postData.user.username[0]}
                  </div>
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
                    className={`${
                      toggleTheme === "dark" ? "bg-[#363636]" : "bg-white"
                    } rounded-lg p-1 mb-2`}
                  >
                    <div className=" flex items-center justify-between">
                      <div className=" flex items-center gap-2">
                        <div className=" h-9 w-9 rounded-full overflow-hidden border border-[#262626]">
                          {comment.user.profileimage ? (
                            <img
                              src={comment.user.profileimage}
                              className=" h-full w-full object-contain"
                              alt=""
                            />
                          ) : (
                            <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-2xl">
                              {comment.user.username[0]}
                            </div>
                          )}
                        </div>
                        <div className="">
                          <p>{comment.user.username}</p>
                          <p className=" text-sm opacity-80">{}</p>
                        </div>
                      </div>
                      {comment.user._id === currentUser._id && (
                        <div className=" flex items-center gap-3">
                          <i
                            onClick={() => {
                              seteditComment(true);
                            }}
                            className="fa-regular fa-pen-to-square text-lg text-[#027FFE] cursor-pointer duration-300 transition-all hover:scale-110"
                          />
                          <i
                            onClick={() => {
                              deleteComment(comment._id);
                            }}
                            className=" text-red-500 text-lg cursor-pointer duration-300 transition-all hover:scale-110 fa-solid fa-trash"
                          />
                        </div>
                      )}
                      {editComment && (
                        <div className=" bg-[#00000099] fixed top-0 bottom-0 right-0 left-0 z-20 flex items-center justify-center">
                          <div
                            className={`${
                              toggleTheme === "dark"
                                ? "bg-[#363636]"
                                : "bg-[#F1F2F5]"
                            } p-3 rounded-xl flex flex-col gap-3 w-[300px]`}
                          >
                            <div className=" flex items-center justify-between border-b border-[#262626] pb-2">
                              <div className=""></div>
                              <h4 className=" text-lg">Update comment</h4>
                              <i
                                onClick={() => {
                                  seteditComment(false);
                                }}
                                className="fa-solid fa-xmark cursor-pointer duration-300 transition-all hover:scale-110 text-2xl"
                              />
                            </div>
                            <textarea
                              onChange={(e) => {
                                setnewComment(e.target.value);
                              }}
                              name="newComment"
                              placeholder="New comment.."
                              className=" bg-transparent outline-none"
                              value={newComment}
                            />
                            <button
                              disabled={!newComment}
                              onClick={() => {
                                editCommentFn(comment._id);
                              }}
                              className=" bg-[#027FFE] disabled:opacity-70 disabled:cursor-not-allowed p-1 rounded-xl cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )}
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
                <i
                  onClick={() => {
                    inpRef.current.focus();
                  }}
                  className=" text-2xl cursor-pointer transition-all duration-300 hover:scale-110  fa-regular fa-comment"
                />
              </div>
              <i
                onClick={savePost}
                className={` text-2xl ${
                  isSaved ? "text-[#027FFE] fa-solid" : "fa-regular"
                }  fa-bookmark cursor-pointer transition-all duration-300 hover:scale-110`}
              />
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
