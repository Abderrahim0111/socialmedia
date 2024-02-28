/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loggedIn } from "../redux/userSlice";
import { api } from "../utils/end";

// eslint-disable-next-line react/prop-types
const Login = ({toggleTheme}) => {
  const [userData, setuserData] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleChange = (e) => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const res = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.error) {
        setloading(false);
        return seterror(data.error);
      }
      setloading(false);
      navigate('/')
      dispatch(loggedIn(data));
    } catch (error) {
      setloading(false);
      seterror(error.message);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className=" flex flex-col max-w-lg mx-auto border border-[#262626] rounded-lg p-6 gap-3 "
    >
      <h1 className="  text-2xl text-center mb-8">Socialsnap</h1>
      <input
        onChange={handleChange}
        className={` rounded-lg p-2 outline-none ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} `}
        type="text"
        name="email"
        placeholder="Email"
        required
      />
      <input
        onChange={handleChange}
        className={` rounded-lg p-2 outline-none ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} `}
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <button className={` bg-[#027FFE]  p-2 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300 ${toggleTheme === 'dark'? '': 'text-white'}`}>
        {loading ? "Loading..." : "Log in"}
      </button>
      <p className=" ">
        Don't have an account?{" "}
        <Link to="/signup" className=" ml-2 cursor-pointer text-[#027FFE]">
          Sign up
        </Link>
      </p>
      {error && <p className=" text-red-500">{error}</p>}
    </form>
  );
};

export default Login;
