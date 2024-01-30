import { useEffect } from "react";
import Post from "../components/post";
import { useState } from "react";

const Home = ({toggleTheme}) => {
  const [postsData, setpostsData] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch("/api/fetchAllPosts");
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
  if (loading) return <p className=" ">Loading...</p>;
  return (
    <div className=" max-w-lg mx-auto  flex flex-col gap-5">
      { postsData.map((postData, index) => {
        return <Post key={index} {...{ postData, toggleTheme }} />;
      })}
    </div>
  );
};

export default Home;
