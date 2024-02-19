/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loggedIn } from "../redux/userSlice";
import IsPosts from "../components/isPosts";
import IsSaved from "../components/isSaved";
import NotFound from "./notFound";

const Profile = ({ settoggleTheme, toggleTheme }) => {
  const inputRef = useRef();
  const { username } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setuserPosts] = useState([]);
  const [user, setuser] = useState({});
  const [isEditProfileImage, setisEditProfileImage] = useState(false);
  const [savedPosts, setsavedPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataFetchingLoading, setdataFetchingLoading] = useState(true);
  const [isPosts, setisPosts] = useState(true);
  const [isFollowers, setisFollowers] = useState(false);
  const [isFollowing, setisFollowing] = useState(false);
  const [isSaved, setisSaved] = useState(false);
  const [isMore, setisMore] = useState(false);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const res = await fetch("/api/logout");
      const data = await res.json();
      if (data.error) {
        return console.log(data.error);
      }
      dispatch(loggedIn(null));
      console.log(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      const res = await fetch(`/api/fetchUserPosts/${username}`);
      const data = await res.json();
      if (!data.error) {
        setdataFetchingLoading(false);
        setuserPosts(data.posts);
        return setuser(data.user);
      }
      setdataFetchingLoading(false);
    };
    fetchUserPosts();
    const fetchUserSavedPosts = async () => {
      const res = await fetch(`/api/fetchUserSavedPosts/${username}`);
      const data = await res.json();
      if (!data.error) {
        setsavedPosts(data);
        return setloading(false);
      }
      setloading(false);
    };
    fetchUserSavedPosts();
  }, [userPosts, username]);

  const handleChange = async (e) => {
    const formData = new FormData();
    formData.append("profileimage", e.target.files[0]);
    setloading(true);
    try {
      const res = await fetch("/api/uploadProfileImage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.error) {
        console.log(typeof data);
        const res2 = await fetch("/api/updateProfileImage", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([data]),
        });
        const data2 = await res2.json();
        if (!data2.error) {
          setloading(false);
          setisEditProfileImage(false);
          dispatch(loggedIn(data2));
        }
      }
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  const removeCurrentPhoto = async () => {
    try {
      const res = await fetch("/api/removeCurrentPhoto", {
        method: "PUT",
      });
      const data = await res.json();
      if (!data.error) {
        console.log(data);
        dispatch(loggedIn(data));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/follow/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const isFollower =
    user.followers &&
    user.followers.filter((follower) => {
      return follower._id === currentUser._id;
    });

  if (dataFetchingLoading) {
    return <p className=" ">Loading...</p>;
  }

  if (!user.username) {
    return <NotFound />;
  }

  return (
    <div className="  flex flex-col p-2 gap-12">
      <div className=" flex items-center gap-5 sm:gap-20">
        <div className=" relative h-20 w-20 sm:h-40 sm:w-40 rounded-full border-2 border-[#262626] group">
          <input
            onChange={handleChange}
            className=" hidden"
            ref={inputRef}
            accept="image/*"
            multiple={false}
            type="file"
            name="profileimage"
          />
          {currentUser.username === username && (
            <div
              onClick={() => {
                setisEditProfileImage(true);
              }}
              className={` bg-[#00000099] z-10 cursor-pointer ${
                !user.profileimage ? "flex" : "group-hover:flex hidden"
              }  absolute top-0 left-0 right-0 bottom-0 rounded-full items-center justify-center`}
            >
              <p className=" text-xl flex items-center gap-2">
                <span>Edit</span> <i className="fa-solid fa-pen" />
              </p>
            </div>
          )}
          {user.profileimage && (
            <img
              src={user.profileimage}
              alt="image"
              className=" h-full w-full rounded-full object-contain"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className=" relative flex gap-3 items-center">
            {isMore && (
              <div
                className={` absolute left-10 top-10 z-10 p-3 ${
                  toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
                }  rounded-xl`}
              >
                <ul className=" ">
                  <Link to="/activity">
                    <li
                      onClick={() => {
                        setisMore(false);
                      }}
                      className={` p-2 ${
                        toggleTheme === "dark"
                          ? "hover:bg-[#363636]"
                          : "hover:bg-white"
                      }  transition-all duration-300 cursor-pointer rounded-lg mb-2 flex items-center gap-3`}
                    >
                      <i className="fa-solid fa-chart-line" />
                      <span>Your activity</span>
                    </li>
                  </Link>
                  <li
                    onClick={() => {
                      setisMore(false);
                      settoggleTheme(
                        toggleTheme === "light" ? "dark" : "light"
                      );
                    }}
                    className={` p-2 ${
                      toggleTheme === "dark"
                        ? "hover:bg-[#363636]"
                        : "hover:bg-white"
                    }  transition-all duration-300 cursor-pointer rounded-lg mb-2 flex items-center gap-3`}
                  >
                    <i className="fa-solid fa-moon" />
                    <span>Switch appearance</span>
                  </li>
                  <hr className=" border-t border-[#363636] mb-1" />
                  <li
                    onClick={() => {
                      logout();
                      setisMore(false);
                    }}
                    className={` p-2 ${
                      toggleTheme === "dark"
                        ? "hover:bg-[#363636]"
                        : "hover:bg-white"
                    }  transition-all duration-300 cursor-pointer rounded-lg`}
                  >
                    <span>Log out</span>
                  </li>
                </ul>
              </div>
            )}
            <p className=" text-lg sm:text-xl">{user.username}</p>
            {currentUser.username === username ? (
              <>
                <Link
                  to="/account/edit"
                  className={`${
                    toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
                  } bg-[#262626] px-3 py-1 cursor-pointer hover:opacity-80 transition-all duration-300 rounded-lg`}
                >
                  <button>Edit profile</button>
                </Link>
                <i
                  onClick={() => {
                    setisMore(!isMore);
                  }}
                  className=" text-lg sm:text-2xl cursor-pointer hover:scale-110 transition-all duration-300 fa-solid fa-gear"
                />
              </>
            ) : (
              <button
                onClick={handleFollow}
                className={`${
                  toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
                } bg-[#262626] px-3 py-1 cursor-pointer hover:opacity-80 transition-all duration-300 rounded-lg`}
              >
                {isFollower.length === 0 ? "Follow" : "Unfollow"}
              </button>
            )}
          </div>
          <div className=" flex gap-4 sm:gap-6">
            <p>{userPosts.length} posts</p>
            <p
              onClick={() => {
                setisFollowers(true);
              }}
              className=" underline cursor-pointer"
            >
              {user.followers.length} followers
            </p>
            <p
              onClick={() => {
                setisFollowing(true);
              }}
              className=" underline cursor-pointer"
            >
              {user.following.length} following
            </p>
          </div>
          <p>{user.name}</p>
        </div>
      </div>
      <div className=" flex flex-col">
        <hr className=" border-t-2 border-[#262626]" />
        <div className="flex gap-8 sm:gap-16  justify-center">
          <p
            onClick={() => {
              setisPosts(true);
              setisSaved(false);
            }}
            className={` flex ${
              isPosts
                ? `${
                    toggleTheme === "dark" ? "border-white" : "border-[#262626]"
                  } border-t-2`
                : "opacity-80"
            } items-center gap-2 cursor-pointer`}
          >
            <i className="fa-solid fa-table-cells" />
            <span>Posts</span>
          </p>
          <p
            onClick={() => {
              setisPosts(false);
              setisSaved(true);
            }}
            className={` flex ${
              isSaved
                ? `${
                    toggleTheme === "dark" ? "border-white" : "border-[#262626]"
                  } border-t-2`
                : "opacity-80"
            } items-center gap-2 cursor-pointer`}
          >
            <i className="fa-regular fa-bookmark" />
            <span>Saved</span>
          </p>
        </div>
      </div>
      {isPosts && <IsPosts {...{ userPosts, username, toggleTheme }} />}
      {isSaved && <IsSaved {...{ username, toggleTheme, savedPosts }} />}
      {isEditProfileImage && (
        <div className=" fixed top-0 bottom-0 left-0 right-0 bg-[#00000099] z-20 flex items-center justify-center">
          <div
            className={` flex flex-col items-center justify-center ${
              toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
            }   rounded-xl w-[300px]`}
          >
            <div className=" h-9 w-9 rounded-full overflow-hidden flex justify-center items-center mb-1 mt-3">
              {user.profileimage ? (
                <img
                  src={user.profileimage}
                  className=" h-full w-full object-contain"
                  alt=""
                />
              ) : (
                <i className=" text-3xl fa-solid fa-user" />
              )}
            </div>
            <p className=" mb-4">Profile photo</p>
            <button
              onClick={() => {
                inputRef.current.click();
              }}
              className=" text-[#027FFE] border-t-2 w-full border-[#363636] py-2"
            >
              {loading ? "Updating..." : "Upload Photo"}
            </button>
            {user.profileimage && (
              <button
                onClick={() => {
                  removeCurrentPhoto();
                  setisEditProfileImage(false);
                }}
                className=" text-red-500 border-t-2 w-full border-[#363636] py-2"
              >
                Remove Current Photo
              </button>
            )}
            <button
              onClick={() => {
                setisEditProfileImage(false);
              }}
              className=" border-t-2 w-full border-[#363636] py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {isFollowers && (
        <div className=" fixed top-0 bottom-0 left-0 right-0 bg-[#00000099] flex items-center justify-center z-20">
          <div
            className={` p-3 ${
              toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
            }  flex flex-col w-[300px] h-fit rounded-xl `}
          >
            <div className=" flex-1 flex flex-col  overflow-y-scroll scrollbar">
              <div
                className={`flex items-center border-b-2 border-[#363636] pb-2 mb-3 justify-between sticky top-0 z-10 ${
                  toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
                }`}
              >
                <div className=""></div>
                <h3 className=" text-left">Followers</h3>
                <i
                  onClick={() => {
                    setisFollowers(false);
                  }}
                  className="fa-solid fa-xmark cursor-pointer hover:scale-110 transition-all duration-300 text-2xl"
                />
              </div>
              <div className="  flex-1">
                {user.followers.map((follower, index) => {
                  return (
                    <div
                      key={index}
                      className={` ${
                        toggleTheme === "dark" ? "bg-[#363636]" : "bg-white"
                      } rounded-lg p-1 mb-2`}
                    >
                      <div className=" flex items-center gap-2">
                        <div className=" h-9 w-9 rounded-full overflow-hidden border border-[#262626]">
                          {follower.profileimage ? (
                            <img
                              src={follower.profileimage}
                              className=" h-full w-full object-contain"
                              alt=""
                            />
                          ) : (
                            <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-xl">
                              {follower.username[0]}
                            </div>
                          )}
                        </div>
                        <Link
                          onClick={() => {
                            setisFollowers(false);
                          }}
                          to={`/${follower.username}`}
                          className=" cursor-pointer"
                        >
                          <p>{follower.username}</p>
                          <p className=" text-sm opacity-80"></p>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {isFollowing && (
        <div className=" fixed top-0 bottom-0 left-0 right-0 bg-[#00000099] flex items-center justify-center z-20">
          <div
            className={` p-3 ${
              toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
            }  flex flex-col w-[300px] h-fit rounded-xl `}
          >
            <div className=" flex-1 flex flex-col  overflow-y-scroll scrollbar">
              <div
                className={`flex items-center border-b-2 border-[#363636] pb-2 mb-3 justify-between sticky top-0 z-10 ${
                  toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
                }`}
              >
                <div className=""></div>
                <h3 className=" text-left">Following</h3>
                <i
                  onClick={() => {
                    setisFollowing(false);
                  }}
                  className="fa-solid fa-xmark cursor-pointer hover:scale-110 transition-all duration-300 text-2xl"
                />
              </div>
              <div className="  flex-1">
                {user.following.map((following, index) => {
                  return (
                    <div
                      key={index}
                      className={` ${
                        toggleTheme === "dark" ? "bg-[#363636]" : "bg-white"
                      } rounded-lg p-1 mb-2`}
                    >
                      <div className=" flex items-center gap-2">
                        <div className=" h-9 w-9 rounded-full overflow-hidden border border-[#262626]">
                          {following.profileimage ? (
                            <img
                              src={following.profileimage}
                              className=" h-full w-full object-contain"
                              alt=""
                            />
                          ) : (
                            <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-xl">
                              {following.username[0]}
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/${following.username}`}
                          onClick={() => {
                            setisFollowing(false);
                          }}
                          className=" cursor-pointer"
                        >
                          <p>{following.username}</p>
                          <p className=" text-sm opacity-80"></p>
                        </Link>
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

export default Profile;
