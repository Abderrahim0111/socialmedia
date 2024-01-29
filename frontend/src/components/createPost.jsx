import { useEffect, useState } from "react";
import Create from "./create";
import Crop from "./crop";
import Share from "./share";

// eslint-disable-next-line react/prop-types
const CreatePost = ({ setshowModal, toggleTheme }) => {
  const [imageUrls, setimageUrls] = useState([]);
  const [imageFiles, setimageFiles] = useState([]);
  const [isCreate, setisCreate] = useState(true);
  const [isCrop, setisCrop] = useState(false);
  const [isShare, setisShare] = useState(false);
  const handleChange = (e) => {
    const selectedImages = Array.from(e.target.files).map((file) => {
      return URL.createObjectURL(file);
    });
    const selectedImageFiles = Array.from(e.target.files);
    setimageUrls([...imageUrls, ...selectedImages]);
    setimageFiles([...imageFiles, ...selectedImageFiles])
    setisCreate(false);
    setisCrop(true);
  };
  useEffect(() => {
    console.log(imageUrls)
    console.log(imageFiles)
  }, [imageUrls, imageFiles])

  return (
    <div className=" bg-[#00000099] fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-10">
      {isCreate && <Create {...{ handleChange, toggleTheme }} />}
      {isCrop && <Crop {...{ setisCreate, setisCrop, setisShare, imageUrls, setimageUrls, imageFiles, setimageFiles, handleChange, toggleTheme }} />}
      {isShare && <Share {...{ setisCrop, setisShare, imageUrls, imageFiles, setshowModal, toggleTheme }} />}
      <i
        onClick={() => {
          setshowModal(false);
        }}
        className="  text-3xl  absolute top-20 right-5 hover:scale-110 transition-all duration-300 cursor-pointer hover:rotate-180 fa-solid fa-xmark fa-bounce"
      />
    </div>
  );
};

export default CreatePost;
