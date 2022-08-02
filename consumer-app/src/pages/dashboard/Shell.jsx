import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import Sidebar from "../../components/navigation/Sidebar";

import { addUser } from "../../actions/index";

const pages = {
  home: "",
  overview: "Overview",
  analytics: "Analytics",
  "video-upload": "Upload",
  content: "Content",
  profile: "Profile",
  settings: "Settings",
  logout: "Sign Out",
};

const Shell = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const [loc] = location.pathname.substr(1).split("/");
    setPage(pages[loc] || "unknown");
  }, [location]);

  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;

        dispatch(addUser(user));
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
    // eslint-disable-next-line
  }, [user]);

  // TODO: loading animation
  if (!user) return null;
  if (!page) return null;

  return (
    <div className="flex bg-gray-100">
      <div className="hidden sm:block w-28 fixed z-40">
        <Sidebar page={page} />
      </div>
      <div className="w-full sm:ml-28">
        <div className="mx-auto max-w-screen-2xl">{children}</div>
      </div>
    </div>
  );
};

export default Shell;
