import { useRef } from "react";

// eslint-disable-next-line react/prop-types
const Create = ({ handleChange, toggleTheme }) => {
  const inputRef = useRef(null);
  return (
    <div className={`  relative transition-opacity duration-300 flex flex-col ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} sm:h-[630px] h-[480px] mx-6 w-full sm:w-[600px] rounded-xl`}>
      <h1 className=" text-lg text-center p-2">Create new post</h1>
      <hr className=" border-t-2 border-[#363636]" />
      <div className=" flex flex-col items-center justify-center gap-4 flex-1">
        <div className=" mb-2 relative translate-x-[-25px] ">
          <i className="fa-regular fa-image transform rotate-[-5deg] text-6xl" />
          <i className="fa-brands fa-youtube absolute top-[15px] left-9 transform rotate-[5deg] text-6xl" />
        </div>
        <h3 className=" text-lg">Drag photos and videos here</h3>
        <input
          onChange={handleChange}
          ref={inputRef}
          accept="image/*"
          multiple
          className=" hidden"
          type="file"
          name="files"
        />
        <button
          onClick={() => {
            inputRef.current.click();
          }}
          className=" bg-[#027FFE] rounded-lg py-1 px-2 cursor-pointer hover:opacity-80 transition-all duration-300"
        >
          Select from device
        </button>
      </div>
    </div>
  );
};

export default Create;
