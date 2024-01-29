/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import Discard from "./discard";

const Crop = ({
  setisCreate,
  setisCrop,
  setisShare,
  imageUrls,
  setimageUrls,
  imageFiles,
  setimageFiles,
  handleChange,
  toggleTheme
}) => {
  const [isDiscard, setisDiscard] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEdit, setisEdit] = useState(false);
  const inputRef = useRef(null);

  const handleArrowClick = (direction) => {
    const newIndex =
      direction === "left"
        ? (currentImageIndex - 1 + imageUrls.length) % imageUrls.length
        : (currentImageIndex + 1) % imageUrls.length;

    setCurrentImageIndex(newIndex);
    setisEdit(false)
  };
  const deleteImage = (e) => {
    const filtredImages = imageUrls.filter((imageUrl, index) => {
      return index !== e;
    });
    const filtredImageFiles = imageFiles.filter((imageFile, index) => {
      return index !== e;
    });
    if (imageUrls.length === 1) {
      return setisDiscard(true);
    }
    setimageUrls(filtredImages);
    setimageFiles(filtredImageFiles)
    console.log(filtredImages);
  };
  const addImage = () => {
    inputRef.current.click();
  };

  return (
    <div className={`  relative transition-opacity duration-300 flex flex-col ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} sm:h-[630px] h-[480px] mx-6 w-full sm:w-[600px] rounded-xl`}>
      <div className=" p-2 flex justify-between items-center">
        <i
          onClick={() => {
            setisDiscard(true);
          }}
          className=" text-xl cursor-pointer hover:scale-110 transition-all duration-300 fa-solid fa-arrow-left"
        />
        <h1 className=" text-lg">Crop</h1>
        <button
          onClick={() => {
            setisCrop(false);
            setisShare(true);
          }}
          className="text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer "
        >
          Next
        </button>
      </div>
      <hr className=" border-t-2 border-[#363636]" />
      <div className="flex-1  h-full w-full overflow-hidden relative">
        {imageUrls.length > 1 ? (
          <img
            className=" w-full h-full rounded-b-xl object-contain"
            src={imageUrls[currentImageIndex]}
            alt=""
          />
        ) : (
          <img
            className=" w-full h-full rounded-b-xl object-contain"
            src={imageUrls[0]}
            alt=""
          />
        )}
        {imageUrls.length > 1 && (
          <>
            <i
              onClick={() => handleArrowClick("left")}
              className=" absolute top-48 sm:top-[16rem] left-2 z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-left"
            />
            <i
              onClick={() => handleArrowClick("right")}
              className=" absolute top-48 sm:top-[16rem] right-2 z-10 text-3xl text-[#027FFE] hover:scale-110 transition-all duration-300 cursor-pointer fa-solid fa-chevron-right"
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
        <i
          onClick={() => {
            setisEdit(!isEdit);
          }}
          className={`absolute bottom-2 z-10 right-2 border-2 border-[#363636] hover:scale-110 transition-all duration-300 cursor-pointer ${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} h-8 w-8 rounded-full flex items-center justify-center fa-regular fa-images`}
        />
        {isEdit && (
          <div className=" absolute flex flex-wrap ml-2 gap-3 bottom-12 right-2 h-fit w-fit bg-[#00000099] rounded-xl p-2">
            {imageUrls.map((imageUrl, index) => {
              return (
                <div key={index} className=" relative h-20 w-20">
                  <img
                    className=" h-20 w-20 object-contain bg-white"
                    src={imageUrl}
                    alt=""
                  />
                  <i
                    onClick={() => {
                      deleteImage(index);
                    }}
                    className="absolute top-[2px] right-[2px] h-5 w-5 bg-red-500 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center rounded-full fa-solid fa-xmark"
                  />
                </div>
              );
            })}
            <div
              onClick={addImage}
              className="cursor-pointer border border-[#262626] h-12 w-12 flex items-center justify-center rounded-full"
            >
              <i className=" text-4xl hover:scale-110 transition-all duration-300 text-[#909090] fa-solid fa-plus" />
            </div>
            <input
              type="file"
              ref={inputRef}
              multiple
              accept="image/*"
              onChange={handleChange}
              name="files"
              className=" hidden"
            />
          </div>
        )}
      </div>
      {isDiscard && (
        <Discard {...{ setisDiscard, setisCreate, setisCrop, setimageUrls, setimageFiles, toggleTheme }} />
      )}
    </div>
  );
};

export default Crop;
