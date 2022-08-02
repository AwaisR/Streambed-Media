import react, { useState, useEffect } from "react";
import "./setting.css";
import logo from "../../../assests/images/logo.svg";
import Editicon from "../../../assests/images/Editicon.svg";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditProfile from "./EditProfile";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "Containers/index.css";
import UserAccounts from "./UserAccounts";
import { useSelector, useDispatch } from "react-redux";
import CreateUser from "./CreateUser";
import ErrorPopUp from "../../../Containers/ErrorPopUp";
import { SettingsAction } from "../../../store/settings/action";
import Sidebar from "Components/Dashboard/Sidebar/Sidebar";
import Profile from "Containers/Profile";
import moment from "moment";
import {
  Dropdown,
  DropdownToggle,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
require("dotenv").config();
const Setting = ({ settings }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Settings);
  const { user, showMessage, Curentuser, toggle } = state;
  const history = useHistory();
  const [showEdit, setShowEdit] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  // const [toggle, setToggle] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [filtUser, setFiltUser] = useState([]);
  const [filtUserBasic, setFiltUserBasic] = useState([]);
  const [coprateProfile, setCoprateProfile] = useState({
    company_name: "",
    image: "",
    Description: "",
    imageShow: false,
    descriptionShow: false,
    companyName: false,
    previewImage: "",
  });
  const handleShowEdit = () => {
    setShowEdit(true);
    setShowEditUser(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(SettingsAction.getUser(token));
    dispatch(SettingsAction.getCurentUser(token));
  }, []);
  const EditShowCopSidebar = (data, name, Editdata) => {
    if (name === "image") {
      dispatch(SettingsAction.sideBarPopUp());
      setCoprateProfile({
        imageShow: true,
      });
    } else if (name === "description") {
      dispatch(SettingsAction.sideBarPopUp());
      setCoprateProfile({
        description: Editdata,
        descriptionShow: true,
      });
    } else {
      dispatch(SettingsAction.sideBarPopUp());
      setCoprateProfile({
        company_name: name,
        companyName: true,
      });
    }

    setShowSideBar(data);
  };
  const handleHideCop = () => {
    setShowSideBar(false);
  };
  const handleChangeCompany = (e) => {
    setCoprateProfile({
      ...coprateProfile,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (e) => {
    setCoprateProfile({
      ...coprateProfile,
      image: e.target.files[0],
      previewImage: URL.createObjectURL(e.target.files[0]),
    });
  };
  const handleUpdateComp = (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    dispatch(SettingsAction.updateCompany(coprateProfile, token));
  };
  const handleCencelPOP = () => {
    dispatch(SettingsAction.removeErrorPopUp());
  };
  useEffect(() => {
    const filterUsersAdmin =
      user &&
      user.company_users &&
      user.company_users.filter((obj) => {
        return obj.userType === "Admin";
      });
    const filterUsersBasic =
      user &&
      user.company_users &&
      user.company_users.filter((obj) => {
        return obj.userType === "Basic";
      });
    setFiltUserBasic(filterUsersBasic);
    setFiltUser(filterUsersAdmin);
  }, [user]);
  const homePage = () => {
    setShowEdit(false);
    setShowEditUser(false);
    setShowSideBar(false);
  };
  const handleSidebarPopUp = () => {
    dispatch(SettingsAction.sideBarPopUp());
  };
  return (
    <>
      <Sidebar />
      <div className="main-outer setting">
        {/* main-contant */}
        {!showEdit && setShowEditUser ? (
          <div className="main-contant">
            {/*main-heading */}
            <div className="main-heading">
              <div className="title">
                <h1>Settings </h1>
              </div>
              <div className="main-icon"></div>
            </div>
            {/* graph-box */}
            <div className="graph-box">
              <div className="box-heading">
                <div className="title">
                  <h4>Corporate Profile</h4>
                </div>
                <div className="main-icon">
                  {Curentuser.userType == "Admin" && (
                    <img src={Editicon} onClick={() => setShowEdit(true)} />
                  )}
                </div>
              </div>
              <div className="company-outer">
                <div className="company-info">
                  <div className="company-text">
                    <div className="company-name">
                      <h3>Company Name</h3>
                      <h2>{user && user.company_name}</h2>
                    </div>
                    <div className="company-des ">
                      <h3>Description</h3>
                      <p>{user && user.description}</p>
                    </div>
                    <div className="company-des">
                      <h3>Account Created</h3>
                      <h4>{moment(user && user.createdAt).format("ll")}</h4>
                    </div>
                  </div>
                </div>
                <div className="company-image">
                  <div className="company-name">
                    <h3>Company Photo</h3>
                    <div className="company-logo">
                      <img
                        src={`${process.env.REACT_APP_URL}/${
                          user && user.company_img
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !showEditUser ? (
          <EditProfile EditShowCopSidebar={EditShowCopSidebar} />
        ) : (
          <UserAccounts homePage={homePage} />
        )}

        {/* right-bar-fixed */}
        {!showSideBar ? (
          <div className={toggle ? "right-bar active" : "right-bar"}>
            <div className={toggle ? "mobile-btn change-btn" : "mobile-btn"}>
              {!toggle ? (
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className="toggle-btn bar-icon"
                  onClick={() => handleSidebarPopUp()}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="cross-icon"
                  onClick={() => handleSidebarPopUp()}
                />
              )}
            </div>
            {/* profile */}
            <Profile />
            <div className="graph-box">
              <div className="box-heading">
                <div className="title">
                  <h4>Corporate Users</h4>
                </div>
                <div className="box-selector">
                  <img src={Editicon} />
                </div>
              </div>
              {/* user-detail */}
              <div className="user-outer">
                <div className="title">
                  <h5>Admin</h5>
                </div>
                {filtUser &&
                  filtUser.map((obj, i) => (
                    <div className="user-detail" key={i}>
                      <div className="user-info">
                        <h5>{obj.first_name + " " + obj.last_name}</h5>
                        <p>{obj.userType}</p>
                      </div>
                    </div>
                  ))}

                <div className="title">
                  <h5>Basic User</h5>
                </div>
                {filtUserBasic &&
                  filtUserBasic.map((item, i) => (
                    <div className="user-detail" key={i}>
                      <div className="user-info">
                        <h5>{item.first_name + " " + item.last_name}</h5>
                        <p>{item.userType} User</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="edit-btn">
                {Curentuser.userType === "Admin" ? (
                  <button
                    type="button"
                    className=" btn btn-success"
                    onClick={handleShowEdit}
                  >
                    Edit Users
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className={toggle ? "right-bar active" : "right-bar"}>
            <div className={toggle ? "mobile-btn change-btn" : "mobile-btn"}>
              {!toggle ? (
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className="toggle-btn bar-icon"
                  onClick={() => handleSidebarPopUp()}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="cross-icon"
                  onClick={() => handleSidebarPopUp()}
                />
              )}
            </div>
            <Profile />
            <div className="graph-box">
              <div className="box-heading">
                <div className="title">
                  <h4>
                    {coprateProfile.companyName ||
                    coprateProfile.imageShow ||
                    coprateProfile.descriptionShow
                      ? "Update Company"
                      : "Corporate Users"}
                  </h4>
                </div>
                <div className="box-selector">
                  <img src={Editicon} />
                </div>
              </div>
              {/* user-detail */}
              <div className="user-info">
                <form>
                  {coprateProfile.companyName && (
                    <div className="form-group">
                      <label className="title-label" for="exampleInputEmail1">
                        Company Name
                      </label>
                      <input
                        aria-describedby="emailHelp"
                        className="form-control"
                        id="exampleInputEmail1"
                        name="company_name"
                        placeholder="Company Name"
                        type="text"
                        value={coprateProfile.company_name}
                        onChange={handleChangeCompany}
                      />
                    </div>
                  )}
                  {coprateProfile.imageShow && (
                    <div className="form-group">
                      <div className="upload-image full-width">
                        <label className="form-label" for="customFile">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="customFile"
                          accept="image/x-png,image/jpeg"
                          onChange={handleFileChange}
                        />
                      </div>
                      {coprateProfile.previewImage && (
                        <div className="upload-img">
                          <img
                            style={{ width: "100%" }}
                            src={coprateProfile.previewImage}
                          />{" "}
                        </div>
                      )}
                    </div>
                  )}

                  {coprateProfile.descriptionShow && (
                    <div className="form-group">
                      <label className="title-label" for="exampleInputEmail1">
                        Description
                      </label>
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="description"
                          value={coprateProfile.description}
                          onChange={handleChangeCompany}
                        />
                      </Form.Group>
                    </div>
                  )}
                </form>
                {showMessage && (
                  <ErrorPopUp
                    message={showMessage}
                    handleCencel={handleCencelPOP}
                  />
                )}
              </div>
              <div className="edit-btn">
                <button
                  type="button"
                  className=" btn btn-success"
                  onClick={handleUpdateComp}
                >
                  Update
                </button>
                <button
                  type="button"
                  className=" btn btn-success cancle"
                  onClick={handleHideCop}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Setting;
