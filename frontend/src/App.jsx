import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Notifications from "./pages/notifications";
import Profile from "./pages/profile";
import Inbox from "./pages/inbox";
import Login from "./pages/login";
import { useSelector } from "react-redux";
import Signup from "./pages/signup";
import PostDetails from "./components/postDetails";
import NotFound from "./pages/notFound";
import Edit from "./pages/edit";
import { useState } from "react";
import Activity from "./pages/activity";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [toggleTheme, settoggleTheme] = useState("dark");
  return (
    <BrowserRouter>
      {currentUser ? (
        <>
          <Header {...{ toggleTheme }} />
          <div
            className={`${
              toggleTheme === "dark"
                ? "bg-black text-white"
                : "bg-white text-black"
            }  sm:pt-8 py-24 min-h-screen sm:pl-[5rem] lg:pl-[11rem]`}
          >
            <Routes>
              <Route path="/" element={<Home {...{ toggleTheme }} />} />
              <Route
                path="/notifications"
                element={<Notifications {...{ toggleTheme }} />}
              />
              <Route
                path="/activity"
                element={<Activity {...{ toggleTheme }} />}
              />
              <Route path="/inbox" element={<Inbox {...{ toggleTheme }} />} />
              <Route
                path="/p/:postId"
                element={<PostDetails {...{ toggleTheme }} />}
              />
              <Route
                path="/account/edit"
                element={<Edit {...{ toggleTheme }} />}
              />
              <Route
                path="/:username"
                element={<Profile {...{ settoggleTheme, toggleTheme }} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer {...{ settoggleTheme, toggleTheme }} />
        </>
      ) : (
        <div
          className={`${
            toggleTheme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          } min-h-screen pt-20 px-3`}
        >
          <Routes>
            <Route path="*" element={<Login {...{ toggleTheme }} />} />
            <Route path="/signup" element={<Signup {...{ toggleTheme }} />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
