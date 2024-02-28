import { useEffect, useState } from "react";
import moment from "moment";
import { api } from "../utils/end";

// eslint-disable-next-line react/prop-types
const Notifications = ({ toggleTheme }) => {
  const [loading, setloading] = useState(true);
  const [notifications, setnotifications] = useState([]);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await fetch(`${api}/fetchCurrentUser`);
      const data = await res.json();
      if (!data.error) {
        setloading(false);
        setnotifications(data.notification);
      }
      setloading(false);
    };
    fetchCurrentUser();
  }, [notifications]);
  if (loading) return <p className=" ">Loading...</p>;
  return (
    <div className="  max-w-lg mx-auto">
      {notifications.map((notification, index) => {
        return (
          <div
            className={` ${
              toggleTheme === "dark" ? "bg-[#363636]" : "bg-[#F1F2F5]"
            } p-2 rounded-lg m-2`}
            key={index}
          >
            <div className="flex items-center gap-3">
              <div className=" rounded-full h-10 w-10 overflow-hidden border border-[#262626]">
                {notification.user.profileimage ? (
                  <img
                    src={notification.user.profileimage}
                    className=" h-full w-full object-contain"
                    alt=""
                  />
                ) : (
                  <div className=" items-center justify-center flex h-full w-full font-bold uppercase text-xl">
                    {notification.user.username[0]}
                  </div>
                )}
              </div>
              <div className=" flex flex-col">
                <p>{notification.user.username}</p>
                <p className=" text-sm opacity-80">
                  {moment(notification.timestamp).fromNow()}
                </p>
              </div>
            </div>
            <p className=" mt-3">{notification.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
