import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = ({toggleTheme}) => {
  const [toggleSearch, settoggleSearch] = useState(false);
  const [searchTerm, setsearchTerm] = useState("");
  const [isSearch, setisSearch] = useState(false);
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(true);
  const [notifications, setnotifications] = useState([]);
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
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await fetch(`/api/fetchCurrentUser`);
      const data = await res.json();
      if (!data.error) {
        setloading(false);
        setnotifications(data.notification);
      }
      setloading(false);
    };
    fetchCurrentUser();
  }, [notifications]);
  if(loading) return
  return (
    <header className={` ${toggleTheme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} z-20 sm:hidden fixed top-0 left-0 right-0  flex justify-between p-3 border-b-2 border-[#262626]`}>
        <Link to="/" className=" relative ">
          <h1 className=" text-xl sm:text-2xl">Instagram</h1>
        </Link>
      <ul className=" flex gap-3 items-center">
        <li className={` relative flex items-center gap-2 ${toggleTheme === 'dark'?'bg-[#262626]' : 'bg-[#F1F2F5]'} py-1 px-2 rounded-lg`}>
          {!toggleSearch && (
            <i className=" text-[#8E8E8E] fa-solid fa-magnifying-glass" />
          )}
          <input
            className=" w-40 sm:w-56 bg-transparent outline-none "
            type="text"
            placeholder=" Search"
            name="search"
            value={searchTerm}
            onChange={handleChange}
            onClick={() => {
              settoggleSearch(true);
              setisSearch(true);
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
          {isSearch && (
            <div className={` overflow-y-scroll scrollbar absolute top-[40px] right-[-20px] ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} border-2 border-[#363636] rounded-lg px-2 h-96 w-80`}>
              <div className={` flex items-center justify-between ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} mb-2 sticky top-0 z-10`}>
                <div className=""></div>
                <i
                  onClick={() => {
                    setisSearch(false);
                    setusers([])
                    setsearchTerm('')
                  }}
                  className=" text-2xl fa-solid fa-xmark  cursor-pointer hover:scale-110 transition-all duration-300"
                />
              </div>
              {users.map((user, index) => {
                return (
                  <Link
                    onClick={() => {
                      setisSearch(false);
                    }}
                    to={user.username}
                    key={index}
                    className={` flex cursor-pointer items-center gap-3 ${toggleTheme === 'dark'? 'bg-[#363636]': 'bg-white'} mb-2 p-2 rounded-lg`}
                  >
                    <div className=" rounded-full h-9 w-9 overflow-hidden">
                      <img
                        src={user.profileimage}
                        className=" h-full w-full object-contain"
                        alt=""
                      />
                    </div>
                    <p>{user.username}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </li>
        <Link className=" relative" to="/notifications">
          <li>
            <i className=" text-2xl  fa-solid fa-bell cursor-pointer hover:scale-110 transition-all duration-300" />
          </li>
          <div className={` bg-red-500 ${toggleTheme === 'dark'? '': 'text-white'} rounded-full h-4 w-4 text-sm top-0 left-2 absolute  flex items-center justify-center`}>
            {notifications.length}
          </div>
        </Link>
      </ul>
    </header>
  );
};

export default Header;
