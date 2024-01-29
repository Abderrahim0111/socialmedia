/* eslint-disable react/prop-types */
import moment from "moment";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loggedIn } from "../redux/userSlice";

const Post = ({ postData, toggleTheme }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentImageIndex, setcurrentImageIndex] = useState(0);
  const [comment, setcomment] = useState("");
  const [isComment, setisComment] = useState(false);
  const [isLikes, setisLikes] = useState(false);
  const dispatch = useDispatch()
  const likeRef = useRef();
  
  const handleArrowClick = (direction) => {
    const newIndex =
      direction === "left"
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

  const isLike = postData.likes.find((like) => {
    return like._id === currentUser._id;
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

  return (
    <div className={` mx-3 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} p-3 rounded-lg h-fit flex flex-col max-w-lg`}>
      <ul className=" mb-2 flex gap-3 items-center justify-between">
        <li className=" flex items-center gap-3">
          <li className=" h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
            {postData.user.profileimage ? (
              <img
                src={postData.user.profileimage}
                className=" h-full w-full object-contain"
                alt=""
              />
            ) : (
              <i className="  text-2xl fa-solid fa-user" />
            )}
          </li>
          <li>
            <Link to={`/${postData.user.username}`}>
              <li>{postData.user.name}</li>
            </Link>
            <li className=" text-sm flex items-center gap-1">
              <span>{moment(postData.createdAt).fromNow()}</span>{" "}
              <i className="text-[5px] fa-solid fa-circle" />{" "}
              {postData.seenBy === "everyone" && (
                <i className="fa-solid fa-earth-americas" />
              )}
              {postData.seenBy === "friends" && (
                <i className="fa-solid fa-user-group" />
              )}
              {postData.seenBy === "mee" && <i className="fa-solid fa-lock" />}
            </li>
          </li>
        </li>
      </ul>
      <p className=" mb-2">{postData.description}</p>

      <div className=" mb-2 relative h-[28rem]">
        {postData.pictures.length === 0 ? (
          <img
            src={postData.pictures[0]}
            className=" h-full w-full object-contain"
            alt=""
          />
        ) : (
          <img
            src={postData.pictures[currentImageIndex]}
            className=" h-full w-full object-contain"
            alt=""
          />
        )}
        {postData.pictures.length > 1 && (
          <>
            <i
              onClick={() => {
                handleArrowClick("left");
              }}
              className=" absolute top-[calc(50%-20px)] left-1 z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-left"
            />
            <i
              onClick={() => {
                handleArrowClick("right");
              }}
              className=" absolute top-[calc(50%-20px)] right-1  z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-right"
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
          </>
        )}
      </div>

      <ul className=" flex justify-between items-center">
        <li className=" flex items-center gap-2">
          <li>
            <i className="fa-solid fa-thumbs-up" />
          </li>
          <li
            className=" underline cursor-pointer"
            onClick={() => {
              setisLikes(true);
            }}
          >
            {postData.likes.length}
          </li>
        </li>
        <li className=" flex items-center gap-3">
          <li onClick={() => {
            setisComment(true)
          }} className="underline cursor-pointer">{postData.comments.length} comments</li>
        </li>
      </ul>
      <hr className=" my-2" />
      <ul className=" flex items-center justify-evenly">
        <li
          onClick={() => {
            likeRef.current.click();
          }}
          className={`${
            isLike ? "text-[#027FFE]" : " "
          } cursor-pointer flex items-center gap-2`}
        >
          <i className=" hover:scale-110 duration-300 transition-all text-xl fa-solid fa-thumbs-up" />{" "}
          <input
            ref={likeRef}
            className="hidden"
            onChange={handleLikes}
            type="checkbox"
            name=""
            id=""
          />
          <span>{!isLike?'Like': 'Liked'}</span>
        </li>
        <li
          onClick={() => {
            setisComment(true);
          }}
          className=" cursor-pointer flex items-center gap-2"
        >
          <i className=" hover:scale-110 duration-300 transition-all text-xl fa-regular fa-comment" />{" "}
          <span>Comment</span>
        </li>
        <li onClick={savePost} className={`${isSaved ? 'text-[#027FFE]': ''} cursor-pointer flex items-center gap-2`}>
          <i className={` hover:scale-110 duration-300 transition-all text-xl ${!isSaved?'fa-regular': 'fa-solid'} fa-bookmark`} />{" "}
          <span>{!isSaved?'Save': 'Saved'}</span>
        </li>
      </ul>
      {isComment && (
        <div className=" fixed top-0 bottom-0 left-0 right-0 bg-[#00000099] flex items-center justify-center z-20">
          <div className={` p-3 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'}  flex flex-col w-[500px] h-[600px] rounded-xl `}>
            <div className=" flex-1 flex flex-col scrollbar  overflow-y-scroll scrollbar">
              <div className={`flex items-center border-b-2 border-[#363636] pb-2 mb-3 justify-between sticky top-0 z-10 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'}`}>
                <div className=""></div>
                <h3 className=" text-left">Add a comment</h3>
                <i
                  onClick={() => {
                    setisComment(false);
                  }}
                  className="fa-solid fa-xmark cursor-pointer hover:scale-110 transition-all duration-300 text-2xl"
                />
              </div>
              <div className="  flex-1">
                {postData.comments.map((comment, index) => {
                  return (
                    <div
                      key={index}
                      className={` ${toggleTheme === 'dark'? 'bg-[#363636]': 'bg-white'} rounded-lg p-1 mb-2`}
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
                          <p className=" text-sm opacity-80">{moment(comment.timestamp).fromNow()}</p>
                        </div>
                      </div>
                      <p className=" break-words">{comment.comment}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=" flex items-center border-t-2 border-[#363636] pt-3">
              <textarea
                className=" flex-1 bg-transparent outline-none"
                placeholder="Write a comment..."
                name="comment"
                onChange={handleChange}
                value={comment}
              />
              <i
                onClick={addComment}
                className=" text-2xl fa-solid fa-paper-plane cursor-pointer hover:scale-110 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
      {isLikes && (
        <div className=" fixed top-0 bottom-0 left-0 right-0 bg-[#00000099] flex items-center justify-center z-20">
          <div className={` p-3 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'}  flex flex-col w-[300px] h-fit rounded-xl `}>
            <div className=" flex-1 flex flex-col  overflow-y-scroll scrollbar">
              <div className={`flex items-center border-b-2 border-[#363636] pb-2 mb-3 justify-between sticky top-0 z-10 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'}`}>
                <div className=""></div>
                <h3 className=" text-left">Likes</h3>
                <i
                  onClick={() => {
                    setisLikes(false);
                  }}
                  className="fa-solid fa-xmark cursor-pointer hover:scale-110 transition-all duration-300 text-2xl"
                />
              </div>
              <div className="  flex-1">
                {postData.likes.map((like, index) => {
                  return (
                    <div
                      key={index}
                      className={` ${toggleTheme === 'dark'? 'bg-[#363636]': 'bg-white'} rounded-lg p-1 mb-2`}
                    >
                      <div className=" flex items-center gap-2">
                        <div className=" h-9 w-9 rounded-full">
                          <img
                            src={like.profileimage}
                            className=" h-full w-full object-contain"
                            alt=""
                          />
                        </div>
                        <div className="">
                          <p>{like.username}</p>
                          <p className=" text-sm opacity-80">
                            
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
