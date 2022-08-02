import React, { useEffect, useState } from "react";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
export default function Profile() {
  const [data, setData] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${url}/users_mag/user_data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setData(data.data);
          } else {
            console.log("error", data.error);
          }
        });
    }
  }, []);
  return (
    <div className="profile">
      <div className="profile-img">
        <img
          src={`${process.env.REACT_APP_URL}/${
            data && data.company && data.company.company_img
          }`}
        />
      </div>
      <div className="profile-info">
        <h3>{data && data.company && data.company.company_name}</h3>
        <p>Current User: {data && data.first_name + " " + data.last_name}</p>
      </div>
    </div>
  );
}
