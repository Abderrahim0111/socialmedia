// eslint-disable-next-line react/prop-types
const Discard = ({ setisDiscard, setisCreate, setisCrop, setimageUrls, setimageFiles, toggleTheme }) => {
  return (
    <div className="bg-[#00000099] fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-10">
      <div className={` w-96 absolute h-fit py-4 ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} rounded-xl flex flex-col items-center justify-center`}>
        <h1 className=" text-xl mb-1">Discard post?</h1>
        <p className=" opacity-80 mb-2">
          If you leave, your edits won't be saved
        </p>
        <button
          onClick={() => {
            setisCrop(false);
            setisCreate(true);
            setisDiscard(false)
            setimageUrls([]);
            setimageFiles([])
          }}
          className=" cursor-pointer text-red-500 border-y p-3 border-[#363636] my-4 w-full"
        >
          Discard
        </button>
        <button
          className=" cursor-pointer w-full"
          onClick={() => {
            setisDiscard(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Discard;
