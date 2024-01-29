/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const CommentedPosts = ({commentedPosts}) => {
    return (
        <div className=" flex items-center gap-2 justify-center sm:justify-normal flex-wrap">
          {commentedPosts.map((post, index) => {
            return (
              <Link
                to={`/p/${post._id}`}
                key={index}
                className=" h-[7.18rem] w-[7.18rem] overflow-hidden border-[#363636] border cursor-pointer"
              >
                <img
                  src={post.pictures[0]}
                  className=" h-full w-full object-contain"
                  alt=""
                />
              </Link>
            );
          })}
        </div>
    );
}

export default CommentedPosts;
