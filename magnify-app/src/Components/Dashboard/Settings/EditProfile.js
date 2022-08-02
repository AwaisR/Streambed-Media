import react, { useState } from "react";
import "./setting.css";
import logo from "../../../assests/images/logo.svg";
import Sidebar from "../Sidebar/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownToggle,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
const EditProfile = ({ EditShowCopSidebar }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Settings);
  const { user } = state;
  const handleEditCop = (companyName, Editdata) => {
    EditShowCopSidebar(true, companyName, Editdata);
  };
  return (
    <>
      <div className="main-outer edit-profile">
        {/* main-contant */}
        <div className="main-contant">
          {/*main-heading */}
          <div className="main-heading">
            <div className="title">
              <h1>Edit Corporate Profile </h1>
            </div>
            <div className="main-icon"></div>
          </div>
          {/* graph-box */}
          <div className="graph-box">
            <div className="profile-logo">
              <div className="profile-img">
                <img
                  src={`${process.env.REACT_APP_URL}/${
                    user && user.company_img
                  }`}
                />
              </div>
              <div className="profile-text">
                <h3> {user && user.company_name}</h3>
              </div>
            </div>
            <div className="profile-info-outer">
              <div className="profile-item">
                <div className="item-data">
                  <h3>Company Name</h3>
                  <p> {user && user.company_name}</p>
                </div>
                <div
                  className="item-link"
                  onClick={() => handleEditCop(user && user.company_name)}
                >
                  <img src="/static/media/Editicon.c99c8b68.svg" />
                </div>
              </div>
              <div className="profile-item">
                <div className="item-data">
                  <h3>Profile Photo</h3>
                  <p></p>
                </div>
                <div
                  className="item-link"
                  onClick={() => handleEditCop("image")}
                >
                  <img src="/static/media/Editicon.c99c8b68.svg" />
                </div>
              </div>
              <div className="profile-item">
                <div className="item-data">
                  <h3>Description</h3>
                  <p>
                    <p> {user && user.description}</p>
                  </p>
                </div>
                <div
                  className="item-link"
                  onClick={() =>
                    handleEditCop("description", user && user.description)
                  }
                >
                  <img src="/static/media/Editicon.c99c8b68.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditProfile;
