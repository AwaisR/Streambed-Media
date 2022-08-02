import react, { useState, useEffect } from "react";
import "./setting.css";
import logo from "../../../assests/images/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import ErrorPopUp from "../../../Containers/ErrorPopUp";
import { SettingsAction } from "../../../store/settings/action";
import Label from "../../../Containers/Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Profile from "Containers/Profile";
import {
  Dropdown,
  DropdownToggle,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
const CreateUser = ({
  addshowFeilds,
  userData,
  removeEdit,
  EditFeild,
  newuserFlag,
  homePage,
}) => {
  const dispatch = useDispatch();

  var temp = [];
  const state = useSelector((state) => state.Settings);
  const {
    user,
    showMessage,
    userAdded,
    userDeleted,
    Curentuser,
    toggle,
  } = state;
  const [selector, showSelector] = useState(false);
  const [showFeilds, setShowFeilds] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [showError, setShowError] = useState("");
  const [otherUsers, setOtherUsers] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    userType: "",
    password: "",
    varify_password: "",
  });
  const select = [
    {
      name: "Basic",
    },
    {
      name: "Admin",
    },
  ];
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  useEffect(() => {
    user &&
      user.company_users &&
      user.company_users.map((item) => {
        return temp.push(item.email);
      });
  }, []);

  const handleChange = (e) => {
    setOtherUsers({
      ...otherUsers,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeSelect = (name) => {
    setOtherUsers({
      ...otherUsers,
      userType: name,
    });
  };
  useEffect(() => {
    if (userAdded) {
      setOtherUsers({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        userType: "",
        password: "",
        varify_password: "",
      });
    } else if (userDeleted) {
      setOtherUsers({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        userType: "",
        password: "",
        varify_password: "",
      });
      removeEdit(false);
    }
  }, [userAdded, userDeleted]);
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    let validEmail = await validateEmail(otherUsers.email);
    if (otherUsers.password != otherUsers.varify_password) {
      setShowError("Password and Varify Password is Mismatch");
    } else if (
      otherUsers.first_name &&
      otherUsers.last_name &&
      otherUsers.email
    ) {
      if (validEmail) {
        if (!EditFeild) {
          dispatch(SettingsAction.addNewUser(otherUsers, token));
        } else {
          dispatch(SettingsAction.EditNewUser(otherUsers, token));
        }
      } else {
        setShowError("Email is invalid");
      }
    } else {
      setShowError("All feilds are Required");
    }
  };
  const handledeleted = () => {
    const token = localStorage.getItem("token");
    setShowError("");
    if (EditFeild && deleteUser) {
      setDeleteUser(false);
      dispatch(SettingsAction.deleteUser(otherUsers, token));
    }
  };
  const handleCencelButton = () => {
    const token = localStorage.getItem("token");
    if (EditFeild && otherUsers.id != Curentuser._id) {
      setDeleteUser(true);
      setShowError("Are you sure want to delete this");
    } else {
      homePage();
      removeEdit(false);
      setOtherUsers({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        userType: "",
        password: "",
        varify_password: "",
      });
      setShowFeilds(false);
    }
  };
  useEffect(() => {
    if (EditFeild) {
      setOtherUsers({
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        userType: userData.permission,
        password: "",
        varify_password: "",
      });
    }
  }, [userData]);
  const handleSelector = () => {
    showSelector(!selector);
  };
  useEffect(() => {
    if (newuserFlag) {
      setOtherUsers({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        userType: "",
        password: "",
        varify_password: "",
      });
    }
  }, [newuserFlag]);

  const handleRemoveError = () => {
    dispatch(SettingsAction.removeErrorPopUp());
  };
  const handleCencelDelete = () => {
    setShowError("");
    setDeleteUser(false);
  };
  const handleSidebarPopUp = () => {
    dispatch(SettingsAction.sideBarPopUp());
  };
  return (
    <>
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
        <>
          <div className="new-user-box">
            <div className="box-heading">
              <div className="title">
                {EditFeild ? <h4>Edit User</h4> : <h4>Add New User</h4>}
              </div>
            </div>
            <div className="user-info">
              <form>
                <div className="form-group">
                  <label className="title-label" for="exampleInputEmail1">
                    First Name
                  </label>
                  <input
                    aria-describedby="emailHelp"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="first_name"
                    placeholder="First Name"
                    type="text"
                    value={otherUsers.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="title-label" for="exampleInputEmail1">
                    Last Name
                  </label>
                  <input
                    aria-describedby="emailHelp"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="last_name"
                    placeholder="Last Name"
                    type="text"
                    value={otherUsers.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="title-label" for="exampleInputEmail1">
                    Email
                  </label>
                  <input
                    aria-describedby="emailHelp"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="email"
                    placeholder="email"
                    type="text"
                    value={otherUsers.email}
                    onChange={handleChange}
                  />
                </div>
              </form>
              <div className="user-permission">
                <h3>Permissions</h3>
                <p>
                  Please select a level of permission that this user will be
                  allowed to access.
                </p>
                <p>
                  {" "}
                  <strong>Admin status</strong> allows the user to edit users,
                  create campaigns, view analytics and pay content creators.
                </p>
                <p>
                  <strong> Basic status</strong> allows the user to to view
                  analytics and pay content creators.
                </p>
              </div>
              <div>
                <div className="box-selector">
                  <div className="selecter">
                    <div
                      className={selector ? "select-text show" : "select-text"}
                      onClick={handleSelector}
                    >
                      <span>
                        {otherUsers.userType ? otherUsers.userType : "Admin"}
                      </span>
                      {selector ? (
                        <ul className="dropdown-inner">
                          {select.map((item, i) => (
                            <li
                              key={i}
                              onClick={() => handleChangeSelect(item.name)}
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <form>
                <div className="form-group">
                  <label className="title-label" for="exampleInputEmail1">
                    Password
                  </label>
                  <input
                    aria-describedby="emailHelp"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="password"
                    placeholder="Password"
                    type="Password"
                    value={otherUsers.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="title-label" for="exampleInputEmail1">
                    Verify Password
                  </label>
                  <input
                    aria-describedby="emailHelp"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="varify_password"
                    placeholder="Verify Password"
                    type="Password"
                    value={otherUsers.varify_password}
                    onChange={handleChange}
                  />
                </div>
              </form>
              {showError && (
                <ErrorPopUp
                  message={showError}
                  deleteuser={deleteUser ? deleteUser : null}
                  handleCencelDelete={deleteUser && handleCencelDelete}
                  handleCencel={() => handledeleted()}
                />
              )}
              {showMessage && (
                <ErrorPopUp
                  message={showMessage}
                  handleCencel={handleRemoveError}
                />
              )}
              <div className="main-icon">
                <a className="user-btn" onClick={handleSubmit}>
                  {EditFeild ? "Save Changes" : "Create New User"}
                </a>
                <a className="user-btn cancel" onClick={handleCencelButton}>
                  {EditFeild && otherUsers.id != Curentuser._id
                    ? "Delete User"
                    : "Cancel"}
                </a>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};
export default CreateUser;
