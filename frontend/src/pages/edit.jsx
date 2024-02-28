import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../redux/userSlice";
import { api } from "../utils/end";

// eslint-disable-next-line react/prop-types
const Edit = ({toggleTheme}) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [user, setuser] = useState({});
  const [loading, setloading] = useState(true);
  const [loadingg, setloadingg] = useState(false);
  const [profileimage, setprofileimage] = useState("");
  const [profileData, setprofileData] = useState({});
  const inputRef = useRef();
  const handleChange = (e) => {
    setprofileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloadingg(true);
    if (profileData.profileimage) {
      const formData = new FormData();
      formData.append("profileimage", profileData.profileimage);
      try {
        const res = await fetch(`${api}/uploadProfileImage`, {
          method: "POST",
          body: formData, 
        });
        const data = await res.json();
        if (!data.error) {
          setprofileData({ ...profileData, profileimage: data });
          const res2 = await fetch(`${api}/updateProfile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...profileData, profileimage: data }),
            credentials: 'include',
          });
          const data2 = await res2.json();
          if (!data2.error) {
            setloadingg(false);
            dispatch(loggedIn(data2));
            return console.log(data2);
          }
        }
        setloadingg(false);
      } catch (error) {
        console.log(error);
        setloadingg(false);
      }
    } else {
      try {
        const res = await fetch(`${api}/updateProfile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
          credentials: 'include'
        });
        const data = await res.json();
        if (!data.error) {
          setloadingg(false);
          dispatch(loggedIn(data));
          return console.log(data);
        }
        setloadingg(false);
      } catch (error) {
        console.log(error);
        setloadingg(false);
      }
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${api}/fetchUser/${currentUser._id}`, {credentials: 'include'});
        const data = await res.json();
        if (!data.error) {
          setuser(data);
          setprofileimage(data.profileimage);
          setloading(false);
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error);
      }
    };
    fetchUser();
  }, [currentUser._id]);
  if (loading) return <p className="  ">Loading...</p>;
  return (
    <form
      onSubmit={handleSubmit}
      className=" flex  flex-col max-w-lg mx-auto border border-[#262626] rounded-lg p-6 gap-3 "
    >
      <h1 className="  text-2xl text-center mb-8">Edit profile</h1>
      <div className=" flex justify-center">
        <div
          onClick={() => {
            inputRef.current.click();
          }}
          className=" relative h-20 w-20 sm:h-40 sm:w-40 rounded-full border-2 border-[#262626] group"
        >
          <input
            onChange={(e) => {
              setprofileimage(URL.createObjectURL(e.target.files[0]));
              setprofileData({
                ...profileData,
                profileimage: e.target.files[0],
              });
            }}
            className=" hidden"
            ref={inputRef}
            accept="image/*"
            multiple={false}
            type="file"
            name="profileimage"
          />
          <div
            className={` bg-[#00000099] z-10 cursor-pointer ${
              !user.profileimage ? "flex" : "group-hover:flex hidden"
            }  absolute top-0 left-0 right-0 bottom-0 rounded-full items-center justify-center`}
          >
            <p className=" text-xl flex items-center gap-2">
              <span>Edit</span> <i className="fa-solid fa-pen" />
            </p>
          </div>
          {profileimage && <img
            src={profileimage}
            alt="image"
            className=" h-full w-full rounded-full object-contain"
          />}
        </div>
      </div>
      <input
        onChange={handleChange}
        className={` rounded-lg p-2 outline-none ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} `}
        type="text"
        name="email"
        placeholder="Email"
        defaultValue={user.email}
      />
      <input
        onChange={handleChange}
        className={` rounded-lg p-2 outline-none ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} `}
        type="text"
        name="name"
        placeholder="Full name"
        defaultValue={user.name}
      />
      <input
        onChange={handleChange}
        className={` rounded-lg p-2 outline-none ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} `}
        type="text"
        name="username"
        placeholder="Username"
        defaultValue={user.username}
      />
      <input
        onChange={handleChange}
        className={` rounded-lg p-2 outline-none ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} `}
        type="password"
        name="password"
        placeholder="Password"
      />
      <button className=" bg-[#027FFE]  p-2 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300">
        {loadingg ? "Loading..." : "Update"}
      </button>
    </form>
  );
};

export default Edit;
