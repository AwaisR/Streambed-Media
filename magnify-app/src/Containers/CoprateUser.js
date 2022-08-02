import React, { useState, useEffect } from "react";
import "../Components/Dashboard/Overview/overview.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { SettingsAction } from "../store/settings/action";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CoprateUser = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Settings);
  const { user } = state;
  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(SettingsAction.getUser(token));
  }, []);
  return (
    <>
      <div className="graph-box">
        <div className="box-heading">
          <div className="title">
            <h4>Corporate Users</h4>
            <p>Latest online users</p>
          </div>
          <div className="box-selector">
            <a href="">
              <FontAwesomeIcon icon={faEye} />
            </a>
          </div>
        </div>
        {/* user-detail */}
        {user.company_users
          ? user.company_users.map((users, i) => (
              <div className="user-outer" key={i}>
                <div className="user-detail">
                  <div className="user-info">
                    <h5>{users.first_name + " " + users.last_name}</h5>
                    <p>{users.userType}</p>
                  </div>
                  {users.userType === "Admin" && (
                    <div className="user-status">
                      <div>
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          title="Coming Soon"
                          className="toggle-btn bar-icon "
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          : ""}
      </div>
    </>
  );
};
export default CoprateUser;
