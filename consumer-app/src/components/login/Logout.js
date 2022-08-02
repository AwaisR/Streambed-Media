import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { socket } from "../helpers/socket";
function Logout() {
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    logOut();
  }, []);
  const logOut = () => {
    socket.emit("logout", "logout");
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("youtubeName");
    setNavigate(true);
  };

  if (navigate) {
    return <Redirect to="/" push={true}></Redirect>;
  }
  return (
    <div>
      <p>Loging out... </p>
    </div>
  );
}

export default Logout;
