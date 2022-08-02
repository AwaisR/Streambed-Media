import React from "react";
import * as io from "socket.io-client";

const host =
  process.env.REACT_APP_SOCKET_URL ||
  (process.env.NODE_ENV === "production"
    ? /app/.test(window.location.hostname)
      ? "https://app.streambedmedia.com"
      : "https://concept.streambedmedia.com"
    : "http://localhost:4000");

export const socket = io(host, {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("connected"); // true
});
socket.on("disconnect", () => {
  console.log("disconnected"); // false
});
function Socket(props) {
  return <>{props.children}</>;
}

export default Socket;
