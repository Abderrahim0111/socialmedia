import { Link } from "react-router-dom";
import MessageSelf from "../components/messageSelf";
import MessageOther from "../components/messageOther";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Inbox = ({toggleTheme}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setsearchTerm] = useState("");
  const [users, setusers] = useState([]);
  const [content, setcontent] = useState("");
  const [isNewMessage, setisNewMessage] = useState(false);
  const [messages, setmessages] = useState([]);
  const [chats, setchats] = useState([]);
  const [chat, setchat] = useState({});
  const [loading, setloading] = useState(true);
  const [selectedUser, setselectedUser] = useState("");
  const [isClicked, setisClicked] = useState(false);
  const handleChange = async (e) => {
    e.preventDefault();
    const term = e.target.value;
    setsearchTerm(term);

    try {
      const res = await fetch(`/api/fetchUsers?searchTerm=${term}`);
      const data = await res.json();
      setusers(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = async () => {
    const res = await fetch("/api/accesChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: selectedUser }),
    });
    const data = await res.json();
    if (!data.error) {
      setchats(data);
      setisNewMessage(false)
      console.log(data);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("/api/fetchChats");
      const data = await res.json();
      if (!data.error) {
        setchats(data);
        setloading(false);
      }
      setloading(false);
    };
    fetchChats();
  }, [chats]);
  const fetchMessages = async (chatId) => {
    const res = await fetch(`/api/fetchAllMessages/${chatId}`);
    const data = await res.json();
    if (!data.error) {
      setmessages(data);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          chatId: chat._id,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        fetchMessages(chat._id);
        setcontent("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchChat = async (chatId) => {
    const res = await fetch(`/api/fetchChat/${chatId}`);
    const data = await res.json();
    if (!data.error) {
      setchat(data);
    }
  };
  const chatwith =
    chat &&
    chat.users &&
    chat.users.find((user) => {
      return user.username !== currentUser.username;
    });
  const chatwithusername = chatwith ? chatwith.username : "";

  const userphoto =
    chat &&
    chat.users &&
    chat.users.find((user) => {
      return user.username === chatwithusername;
    });
  const profileImageSrc = userphoto ? userphoto.profileimage : "";

  if (loading) return <p className=" ">Loading...</p>;
  return (
    <div className=" flex min-h-screen sm:ml-[-18px] mt-[-32px]">
      <div className={`${isClicked && "hidden"} sm:block p-3 border-r-2 border-[#262626] w-full sm:w-80`}>
        <div className={` px-3 pt-3 sticky top-[55px] sm:top-0 z-10 ${toggleTheme === 'dark'? 'bg-black': 'bg-white'}`}>
          <div className=" flex items-center justify-between mb-5">
            <p className=" text-xl font-semibold">{currentUser.username}</p>
            <i
              onClick={() => {
                setisNewMessage(true);
              }}
              className="duration-300 transition-all cursor-pointer hover:scale-110 text-xl fa-regular fa-pen-to-square"
            />
          </div>
          <p className=" text-lg pb-3">Messages</p>
        </div>
        {chats.length > 0 &&
          chats.map((chat, index) => {
            const ddd = chat.users.find((user) => {
              return user._id !== currentUser._id;
            });
            return (
              <div
                onClick={() => {
                  fetchMessages(chat._id);
                  fetchChat(chat._id);
                  setisClicked(true);
                }}
                key={index}
                className={` flex  items-center gap-3 mb-3 p-2 rounded-lg ${toggleTheme === 'dark'? 'hover:bg-[#363636]': 'hover:bg-[#F1F2F5]'} duration-300 transition-all cursor-pointer`}
              >
                <div className=" border border-[#363636] h-11 w-11 rounded-full overflow-hidden">
                  <img
                    src={ddd.profileimage}
                    className=" h-full w-full object-contain"
                    alt=""
                  />
                </div>
                <div className="">
                  <p>{ddd.username}</p>
                  <p className=" opacity-80 text-xs w-52 overflow-hidden text-ellipsis line-clamp-1">
                    {chat.latestMessage && chat.latestMessage.message}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      {isClicked ? (
        <div className={`flex-1 ${isClicked? "flex": "hidden"} h-[calc(100vh-120px)] sm:h-screen  sm:flex flex-col gap-8`}>
          <div className={`flex items-center sticky top-[58px] sm:top-0 z-10 ${toggleTheme === 'dark'? 'bg-black': 'bg-white'} border-b-2 border-[#262626] gap-3 p-2`}>
          <i onClick={() => {
            setisClicked(false)
          }} className=" flex sm:hidden text-2xl fa-solid fa-arrow-left cursor-pointer hover:scale-110 transition-all duration-300" />
            <div className=" h-9 w-9 rounded-full overflow-hidden border border-[#363636]">
              <img
                src={profileImageSrc}
                className=" h-full w-full object-contain"
                alt=""
              />
            </div>
            <p>{chatwithusername}</p>
          </div>
          <div className=" flex-1 overflow-y-scroll scrollbar">
          <div className="flex flex-col items-center mt-8">
            <div className="  border border-[#363636] rounded-full h-20 w-20 overflow-hidden">
              <img
                src={profileImageSrc}
                className=" h-full w-full object-contain"
                alt=""
              />
            </div>
            <p className=" mt-1">{chatwithusername}</p>
            <Link to={`/${chatwithusername}`}>
              <button className={` px-4 py-1 mt-4 mb-6 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} rounded-lg cursor-pointer `}>
                View profile
              </button>
            </Link>
          </div>
          <div className=" flex flex-col gap-2 px-2 mb-2">
            {messages.length > 0 &&
              messages.map((message, index) => {
                if (message.sender._id === currentUser._id) {
                  return <MessageSelf  {...{ message, toggleTheme }} />;
                } else {
                  return <MessageOther  {...{ message, toggleTheme }} />;
                }
              })}
          </div>

          </div>
          <div className=" p-2 mb-2">
            <form
              onSubmit={sendMessage}
              className="flex items-center justify-between py-2 px-4 border border-[#262626] rounded-3xl"
            >
              <input
                onChange={(e) => {
                  setcontent(e.target.value);
                }}
                value={content}
                type="text"
                name="message"
                placeholder="Message..."
                className=" w-full bg-transparent outline-none"
              />
              <button>
                <i className="fa-solid fa-paper-plane" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden  sm:flex flex-col items-center justify-center">
          <h3 className=" text-xl">Your messages</h3>
          <p className=" opacity-80 text-center">
            Send private photos and messages to a friend
          </p>
          <button
            onClick={() => {
              setisNewMessage(true);
            }}
            className={` mt-6 bg-[#0295F6] ${toggleTheme === 'dark'? '': 'text-white'} rounded-lg px-3 py-1 cursor-pointer hover:opacity-80 transition-all duration-300`}
          >
            Send message
          </button>
        </div>
      )}
      {isNewMessage && (
        <div className=" bg-[#00000099] fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center">
          <div className={`${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} px-2 flex flex-col rounded-xl overflow-y-scroll scrollbar w-[300px] sm:w-[400px] h-[500px]`}>
            <div className={`flex sticky top-0 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} z-10 justify-between p-2 items-center`}>
              <div className=""></div>
              <h3 className=" text-xl">New message</h3>
              <i
                onClick={() => {
                  setisNewMessage(false);
                  setselectedUser("");
                }}
                className=" text-2xl hover:scale-110 duration-300 transition-all cursor-pointer fa-solid fa-xmark"
              />
            </div>
            <div className="flex items-center gap-3 border-y-2 border-[#363636] mb-5 p-2">
              <p>To:</p>
              <input
                value={searchTerm}
                onChange={handleChange}
                type="text"
                name="searchTerm"
                placeholder="Search..."
                className="w-full outline-none bg-transparent"
              />
            </div>
            <div className=" p-1 flex-1">
              {users.length > 0 ? (
                users.map((user, index) => {
                  return (
                    <div
                      onClick={() => {
                        setselectedUser(user._id);
                      }}
                      key={index}
                      className={`flex items-center gap-2 ${
                        selectedUser === user._id
                          ? "bg-[#3697F0] hover:bg-[#3697F0]"
                          : `${toggleTheme === 'dark'? 'hoverbg-[#363636]': 'hover:bg-white'}`
                      } transition-all duration-300 mb-2 rounded-lg px-1 py-2 cursor-pointer`}
                    >
                      <div className=" border border-[#363636] rounded-full h-8 w-8 overflow-hidden">
                        <img
                          src={user.profileimage}
                          className=" h-full w-full object-contain"
                          alt=""
                        />
                      </div>
                      <p>{user.username}</p>
                    </div>
                  );
                })
              ) : (
                <p className=" opacity-80 text-sm">No account found.</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedUser}
              className={` bg-[#3697F0] ${
                selectedUser
                  ? "cursor-pointer"
                  : "opacity-80 cursor-not-allowed"
              } w-full rounded-xl p-2 mb-3 hover:opacity-80 duration-300 transition-all`}
            >
              Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
