/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'

const IsSaved = ({ toggleTheme, savedPosts }) => {
    const navigate = useNavigate()

    return (
        <div className=" flex gap-1 flex-wrap">
          {savedPosts.map((post, index) => {
            return (
              <div
                className="relative h-[7.6rem] w-[7.6rem] sm:h-64 sm:w-64 group cursor-pointer border-2 border-[#262626]"
                key={index}
                onClick={() => {
                  navigate(`/p/${post._id}`);
                }}
              >
                <img
                  className="h-full w-full object-contain"
                  src={post.pictures[0]}
                  alt="image"
                />
                <div className={`hidden group-hover:flex bg-[#00000099] ${toggleTheme === 'dark' ? ' ' : ' text-white'}  justify-center gap-10 absolute top-0 bottom-0 left-0 right-0`}>
                  <p className="text-xl flex items-center gap-2">
                    <span>{post.likes.length}</span>
                    <i className="fa-solid fa-heart" />
                  </p>
                  <p className="text-xl flex items-center gap-2">
                    <span>{post.comments.length}</span>
                    <i className="fa-solid fa-comment" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
    );
}

export default IsSaved;
