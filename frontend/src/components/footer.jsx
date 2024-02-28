/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePost from "./createPost";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../redux/userSlice";
import { api } from "../utils/end";

const Footer = ({ toggleTheme, settoggleTheme }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [toggleSearchBigScreen, settoggleSearchBigScreen] = useState(false);
  const [toggleSearch, settoggleSearch] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [searchTerm, setsearchTerm] = useState("");
  const [isMore, setisMore] = useState(false);
  const dispatch = useDispatch();
  const [users, setusers] = useState([]);

  const handleChange = async (e) => {
    e.preventDefault();
    const term = e.target.value;
    setsearchTerm(term);

    try {
      const res = await fetch(`${api}/fetchUsers?searchTerm=${term}`);
      const data = await res.json();
      setusers(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${api}/logout`);
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
  return (
    <footer
      className={`${
        toggleTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }  sm:top-0 z-10 sm:w-fit sm:flex sm:flex-col sm:items-center lg:items-start sm:justify-between fixed bottom-0 w-full  p-[0.3rem] sm:p-3 border-t-2 sm:border-t-0 sm:border-r-2 border-[#262626]`}
    >
      <ul className=" flex items-center lg:items-start justify-evenly sm:justify-start sm:gap-4 sm:flex-col  sm:h-[70%]">
        <Link
          className={` ${
            toggleTheme === "dark"
              ? "lg:hover:bg-[#262626]"
              : "lg:hover:bg-[#F1F2F5]"
          } transition-all duration-300 rounded-lg py-1 px-3 lg:w-full cursor-pointer`}
          to="/"
        >
          <li
            className="flex items-center gap-3"
            onClick={() => {
              window.scrollTo(0, 0);
              settoggleSearchBigScreen(false);
              setisMore(false);
            }}
          >
            <i className="  cursor-pointer hover:scale-110 transition-all duration-300 text-2xl fa-solid fa-house" />
            {!toggleSearchBigScreen && (
              <span className="hidden lg:block ">Home</span>
            )}
          </li>
        </Link>
        <li
          onClick={() => {
            settoggleSearchBigScreen(!toggleSearchBigScreen);
            setisMore(false);
          }}
          className={` hidden sm:flex items-center gap-3  ${
            toggleTheme === "dark"
              ? "lg:hover:bg-[#262626]"
              : "lg:hover:bg-[#F1F2F5]"
          } transition-all duration-300 rounded-lg py-1 px-3 lg:w-full cursor-pointer`}
        >
          <i className="  cursor-pointer hover:scale-110 transition-all duration-300 text-2xl fa-solid fa-magnifying-glass" />
          {!toggleSearchBigScreen && (
            <span className="hidden lg:block ">Search</span>
          )}
        </li>
        {toggleSearchBigScreen && (
          <div
            className={` hidden sm:block p-3 absolute top-0 bottom-0 left-[4.8rem] ${
              toggleTheme === "dark" ? "bg-black" : "bg-white"
            } border-r-2 border-[#262626] w-80`}
          >
            <h1 className="hidden lg:block  text-2xl mb-8">Search</h1>
            <li
              className={` flex items-center gap-2 ${
                toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
              } p-2 rounded-lg mb-6`}
            >
              {!toggleSearch && (
                <i className=" text-[#8E8E8E] fa-solid fa-magnifying-glass" />
              )}
              <input
                className=" w-full bg-transparent outline-none "
                type="text"
                placeholder=" Search"
                name="search"
                value={searchTerm}
                onChange={handleChange}
                onClick={() => {
                  settoggleSearch(true);
                }}
              />
              {toggleSearch && (
                <i
                  onClick={() => {
                    settoggleSearch(false);
                    setsearchTerm("");
                    setusers([]);
                  }}
                  className=" text-[#C8C8C8] cursor-pointer hover:scale-110 transition-all duration-300 fa-solid fa-circle-xmark"
                />
              )}
            </li>
            <hr className=" border-t-2 border-[#262626] mb-4" />
            <div className=" ">
              {users.map((user, index) => {
                return (
                  <Link
                    to={user.username}
                    key={index}
                    className={` flex cursor-pointer items-center gap-3 ${
                      toggleTheme === "dark" ? "bg-[#363636]" : "bg-[#F1F2F5]"
                    } mb-2 p-2 rounded-lg `}
                  >
                    <div className=" border border-[#262626] rounded-full h-9 w-9 overflow-hidden">
                      {user.profileimage ? (
                        <img
                          src={user.profileimage}
                          className=" h-full w-full object-contain"
                          alt=""
                        />
                      ) : (
                        <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-2xl">
                          {user.username[0]}
                        </div>
                      )}
                    </div>
                    <p>{user.username}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <li
          className={`flex items-center gap-3  ${
            toggleTheme === "dark"
              ? "lg:hover:bg-[#262626]"
              : "lg:hover:bg-[#F1F2F5]"
          } transition-all duration-300 rounded-lg py-1 px-3 lg:w-full cursor-pointer`}
          onClick={() => {
            settoggleSearchBigScreen(false);
            setshowModal(true);
            setisMore(false);
          }}
        >
          <i className="  cursor-pointer hover:scale-110 transition-all duration-300 text-3xl fa-regular fa-square-plus" />
          {!toggleSearchBigScreen && (
            <span className="hidden lg:block ">Create</span>
          )}
        </li>
        <Link
          className={` ${
            toggleTheme === "dark"
              ? "lg:hover:bg-[#262626]"
              : "lg:hover:bg-[#F1F2F5]"
          } transition-all duration-300 rounded-lg py-1 px-3 lg:w-full cursor-pointer`}
          to="/inbox"
        >
          <li
            className="flex items-center gap-3"
            onClick={() => {
              settoggleSearchBigScreen(false);
              setisMore(false);
            }}
          >
            <i className="  cursor-pointer hover:scale-110 transition-all duration-300 text-2xl fa-regular fa-paper-plane" />
            {!toggleSearchBigScreen && (
              <span className="hidden lg:block ">Messages</span>
            )}
          </li>
        </Link>
        <Link
          className={`hidden relative sm:block  ${
            toggleTheme === "dark"
              ? "lg:hover:bg-[#262626]"
              : "lg:hover:bg-[#F1F2F5]"
          } transition-all duration-300 rounded-lg py-1 px-3 w-full cursor-pointer`}
          to="/notifications"
        >
          <li
            className="flex items-center gap-3"
            onClick={() => {
              settoggleSearchBigScreen(false);
              setisMore(false);
            }}
          >
            <i className=" text-2xl  fa-solid fa-bell cursor-pointer hover:scale-110 transition-all duration-300" />
            {!toggleSearchBigScreen && (
              <span className="hidden lg:block ">Notifications</span>
            )}
          </li>
          {/* <div
            className={` bg-red-500 ${
              toggleTheme === "dark" ? "" : "text-white"
            } rounded-full h-3 w-3 text-sm top-0 left-0 absolute  flex items-center justify-center`}
          ></div> */}
        </Link>
        <Link
          onClick={() => {
            settoggleSearchBigScreen(false);
            setisMore(false);
          }}
          className={` flex items-center gap-3  ${
            toggleTheme === "dark"
              ? "lg:hover:bg-[#262626]"
              : "lg:hover:bg-[#F1F2F5]"
          } transition-all duration-300 rounded-lg py-1 px-3 lg:w-full cursor-pointer`}
          to={`/${currentUser.username}`}
        >
          <li className=" cursor-pointer hover:scale-110 transition-all duration-300 overflow-hidden flex items-center justify-center h-7 w-7 rounded-full">
            {currentUser.profileimage ? (
              <img
                src={currentUser.profileimage}
                className=" h-full w-full object-contain"
                alt=""
              />
            ) : (
              <i className="  text-2xl fa-solid fa-user" />
            )}
          </li>
          {!toggleSearchBigScreen && (
            <span className="  hidden lg:block">Profile</span>
          )}
        </Link>
      </ul>
      <div
        onClick={() => {
          settoggleSearchBigScreen(false);
          setisMore(!isMore);
        }}
        className={`hidden relative sm:flex items-center gap-3  ${
          toggleTheme === "dark"
            ? "lg:hover:bg-[#262626]"
            : "lg:hover:bg-[#F1F2F5]"
        } transition-all duration-300 rounded-lg py-1 px-3 w-full cursor-pointer`}
      >
        <i className="  cursor-pointer hover:scale-110 transition-all duration-300 text-2xl fa-solid fa-bars" />
        {!toggleSearchBigScreen && (
          <span className="  hidden lg:block ">More</span>
        )}
      </div>
      {isMore && (
        <div
          className={`absolute left-[60px] w-max bottom-14 p-3 ${
            toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
          } rounded-xl`}
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
                } transition-all duration-300 cursor-pointer rounded-lg mb-2 flex items-center gap-3`}
              >
                <i className="fa-solid fa-chart-line" />
                <span>Your activity</span>
              </li>
            </Link>
            <li
              onClick={() => {
                setisMore(false);
                settoggleTheme(toggleTheme === "light" ? "dark" : "light");
              }}
              className={` p-2 ${
                toggleTheme === "dark" ? "hover:bg-[#363636]" : "hover:bg-white"
              } transition-all duration-300 cursor-pointer rounded-lg mb-2 flex items-center gap-3`}
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
                toggleTheme === "dark" ? "hover:bg-[#363636]" : "hover:bg-white"
              } transition-all duration-300 cursor-pointer rounded-lg`}
            >
              <span>Log out</span>
            </li>
          </ul>
        </div>
      )}
      {showModal && <CreatePost {...{ setshowModal, toggleTheme }} />}
    </footer>
  );
};

export default Footer;
