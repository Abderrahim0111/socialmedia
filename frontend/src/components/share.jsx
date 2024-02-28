/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../utils/end";

// eslint-disable-next-line react/prop-types
const Share = ({
  setisCrop,
  setisShare,
  imageUrls,
  setshowModal,
  imageFiles,
  toggleTheme,
}) => {
  const [loading, setloading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [postData, setpostData] = useState({
    pictures: [],
    description: "",
    location: "",
    seenBy: "everyone",
  });

  const handleChange = (e) => {
    if (e.target.name === "description" || e.target.name === "location")
      setpostData({ ...postData, [e.target.name]: e.target.value });
    if (e.target.name === "seenBy")
      setpostData({ ...postData, [e.target.name]: e.target.id });
  };

  const handleSubmit = async () => {
    setloading(true);
    const fromData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      fromData.append("files", imageFiles[i]);
    }
    try {
      const res = await fetch(`${api}/uplodaPostFiles`, {
        method: "POST",
        body: fromData,
      });
      const data = await res.json();
      if (!data.error) {
        console.log(data);
        const updatedPostData = { ...postData, pictures: data };
        // setpostData({...postData, pictures: [...data]})
        const res2 = await fetch(`${api}/createPost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPostData),
          credentials: 'include'
        });
        const data2 = await res2.json();
        if (!data2.error) {
          setloading(false);
          setshowModal(false);
        }
      }
      setloading(false);
      setshowModal(false);
    } catch (error) {
      setloading(false);
      setshowModal(false);
      console.log(error.message);
    }
  };

  const handleArrowClick = (direction) => {
    const newIndex =
      direction === "left"
        ? (currentImageIndex - 1 + imageUrls.length) % imageUrls.length
        : (currentImageIndex + 1) % imageUrls.length;

    setCurrentImageIndex(newIndex);
  };
  return (
    <div
      className={`  overflow-y-scroll scrollbar sm:overflow-y-hidden relative transition-opacity duration-300 flex flex-col ${
        toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
      } sm:h-[630px] h-[480px] mx-6 w-full sm:w-[800px] rounded-xl`}
    >
      <div
        className={` p-2 sticky top-0 ${
          toggleTheme === "dark" ? "bg-[#262626]" : "bg-[#F1F2F5]"
        } z-30 flex justify-between items-center`}
      >
        <i
          onClick={() => {
            setisShare(false);
            setisCrop(true);
          }}
          className=" text-xl cursor-pointer hover:scale-110 transition-all duration-300 fa-solid fa-arrow-left"
        />
        <h1 className=" text-lg">Create new post</h1>
        <button
          onClick={handleSubmit}
          className="text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer "
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>
      <hr className=" border-t-2 border-[#363636]" />
      <div className="flex-1 sm:flex">
        <div className="flex-1 sm:h-[583px] relative">
          {imageUrls.length > 1 ? (
            <img
              className=" w-full h-full sm:rounded-bl-xl object-contain"
              src={imageUrls[currentImageIndex]}
              alt=""
            />
          ) : (
            <img
              className=" w-full h-full sm:rounded-bl-xl object-contain"
              src={imageUrls[0]}
              alt=""
            />
          )}
          {imageUrls.length > 1 && (
            <>
              <i
                onClick={() => handleArrowClick("left")}
                className=" absolute top-36 sm:top-[16rem] left-2 z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-left"
              />
              <i
                onClick={() => handleArrowClick("right")}
                className=" absolute top-36 sm:top-[16rem] right-2 z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-right"
              />
              <div className="absolute bottom-2 w-full flex justify-center gap-[0.35rem] z-10 ">
                {imageUrls.map((_, index) => (
                  <i
                    key={index}
                    className={`text-sm hover:scale-110 transition-all duration-300 cursor-pointer text-[#027FFE] fa-circle ${
                      index === currentImageIndex ? "fa-solid" : "fa-regular"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className=" h-fit p-3 flex-[0.6] flex flex-col gap-4">
          <div className=" flex items-center gap-2">
            <div className=" overflow-hidden h-9 w-9 border border-[#363636] flex items-center justify-center rounded-full">
              {currentUser.profileimage ? (
                <img
                  src={currentUser.profileimage}
                  className=" h-full w-full object-contain"
                  alt=""
                />
              ) : (
                <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-2xl">
                  {currentUser.username[0]}
                </div>
              )}
            </div>
            <p>{currentUser.name}</p>
          </div>
          <textarea
            className=" bg-transparent border-r-2 border-b-2 border-[#363636] outline-none w-full"
            name="description"
            placeholder="Write a caption"
            onChange={handleChange}
          ></textarea>
          <div className=" flex items-center justify-between">
            <input
              className=" bg-transparent outline-none w-full"
              type="text"
              name="location"
              placeholder="Add location"
              onChange={handleChange}
            />
            <i className=" text-lg fa-solid fa-location-dot" />
          </div>
          <h3 className=" text-lg">Default audience:</h3>
          <p className=" opacity-80">
            You can now set a default audience.
            <br />
            This will be your audience for future posts, but you can change it
            for a particular post at any time.
          </p>
          <div className=" hover:bg-[#363636] transition-all duration-300 p-2 rounded-lg flex items-center justify-between">
            <label className=" flex-1 cursor-pointer" htmlFor="everyone">
              Everyone
            </label>
            <input
              className=" cursor-pointer"
              type="radio"
              name="seenBy"
              id="everyone"
              checked={postData.seenBy === "everyone"}
              onChange={handleChange}
            />
          </div>
          <div className=" hover:bg-[#363636] transition-all duration-300 p-2 rounded-lg flex items-center justify-between">
            <label className=" flex-1 cursor-pointer" htmlFor="friends">
              Friends
            </label>
            <input
              className=" cursor-pointer"
              type="radio"
              name="seenBy"
              id="friends"
              checked={postData.seenBy === "friends"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
