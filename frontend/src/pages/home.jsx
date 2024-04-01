import { useEffect } from "react";
import Post from "../components/post";
import { useState } from "react";
import { api } from "../utils/end";

// eslint-disable-next-line react/prop-types
const Home = ({ toggleTheme }) => {
  const [postsData, setpostsData] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch(`${api}/fetchAllPosts`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.error) {
          setloading(false);
          setpostsData(data);
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error.message);
      }
    };
    fetchAllPosts();
  }, [postsData]);
  if (loading)
    return (
      <div className=" max-w-lg mx-auto  flex flex-col gap-5">
        {[1, 1].map((item, index) => {
          return (
            <div
              key={index}
              className={` mx-3 ${
                toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
              } p-3 rounded-lg h-fit flex flex-col max-w-lg`}
            >
              <ul className=" mb-2 flex gap-3 items-center justify-between">
                <li className=" flex items-center gap-3">
                  <li className={`border  ${toggleTheme == "dark" ? "bg-[#363636] border-[#363636]" : "bg-white border-white"} h-10 w-10 rounded-full overflow-hidden flex items-center justify-center`}></li>
                  <li>
                    <li className={` w-[80px] mb-2 p-2 rounded-md ${toggleTheme == "dark" ? "bg-[#363636]" : "bg-white"} animate-pulse`}></li>

                    <li className=" text-sm flex items-center gap-1">
                      <span className={` w-[40px] p-2 rounded-md ${toggleTheme == "dark" ? "bg-[#363636]" : "bg-white"} animate-pulse`}></span>{" "}
                      <i className="text-[5px] fa-solid fa-circle" />
                      <i className="fa-solid fa-earth-americas" />
                    </li>
                  </li>
                </li>
              </ul>
              <p className={` mb-2 p-2 rounded-md ${toggleTheme == "dark" ? "bg-[#363636]" : "bg-white"} animate-pulse`}></p>

              <div className={` mb-2 relative rounded-md h-[28rem] ${toggleTheme == "dark" ? "bg-[#363636]" : "bg-white"} animate-pulse`}>

              </div>

              <ul className=" flex justify-between items-center">
                <li className=" flex items-center gap-2">
                  <li>
                    <i className="fa-solid fa-thumbs-up" />
                  </li>
                </li>
                <li className=" flex items-center gap-3">
                  <li className="underline cursor-pointer">
                     comments
                  </li>
                </li>
              </ul>
              <hr className=" my-2" />
              <ul className=" flex items-center justify-evenly">
                <li
                  className="cursor-pointer flex items-center gap-2"
                >
                  <i className=" hover:scale-110 duration-300 transition-all text-xl fa-solid fa-thumbs-up" />{" "}
                  <span>Like</span>
                </li>
                <li className=" cursor-pointer flex items-center gap-2">
                  <i className=" hover:scale-110 duration-300 transition-all text-xl fa-regular fa-comment" />{" "}
                  <span>Comment</span>
                </li>
                <li
                  className={`cursor-pointer flex items-center gap-2`}
                >
                  <i
                    className={` hover:scale-110 duration-300 transition-all text-xl fa-regular fa-bookmark`}
                  />{" "}
                  <span>Save</span>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    );
  return (
    <div className=" max-w-lg mx-auto  flex flex-col gap-5">
      {postsData.map((postData, index) => {
        return <Post key={index} {...{ postData, toggleTheme }} />;
      })}
    </div>
  );
};

export default Home;
