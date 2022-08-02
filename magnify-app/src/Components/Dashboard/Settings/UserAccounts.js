import react, { useState } from "react";
import "./setting.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assests/images/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import ErrorPopUp from "../../../Containers/ErrorPopUp";
import CreateUser from "./CreateUser";
import { SettingsAction } from "../../../store/settings/action";
import {
  Dropdown,
  DropdownToggle,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
const UserAccounts = ({ homePage, sideBarPopUp }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Settings);
  const { user, userDeletedSecond, showMessageSecond, Curentuser } = state;
  const [addshowFeilds, setAddshowFeilds] = useState(false);
  const [EditFeild, setEditFeild] = useState(false);
  const [newuserFlag, setNewuserFlag] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    permission: "",
  });
  const removeEdit = (data) => {
    setAddshowFeilds(data);
    setEditFeild(false);
    setUserData({
      first_name: "",
      last_name: "",
      permission: "",
    });
  };
  const handleOtherEdits = (id, first_name, last_name, email, userType) => {
    setUserData({
      id: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      permission: userType,
    });
    dispatch(SettingsAction.sideBarPopUp());
    setNewuserFlag(false);
    setEditFeild(true);
    setAddshowFeilds(true);
  };
  const handleAddusers = () => {
    dispatch(SettingsAction.sideBarPopUp());
    setAddshowFeilds(true);
    setEditFeild(false);
    setNewuserFlag(true);
  };
  const handleDelete = (id, name) => {
    setUserData({
      id: id,
    });
    setDeletePopUp(`Are you sure want to delete this user ${name}`);
  };
  const handleDeleteUser = () => {
    const token = localStorage.getItem("token");
    dispatch(SettingsAction.deleteUserSecond(userData, token));
    setDeletePopUp("");
  };
  const handleRemoveError = () => {
    dispatch(SettingsAction.removeErrorPopUp());
  };

  return (
    <>
      <div className="main-outer user-account">
        {/* main-contant */}
        <div className="main-contant">
          {/*main-heading */}
          <div className="main-heading">
            <div className="title">
              <h1>User Accounts </h1>
            </div>
            <div className="main-icon">
              <a onClick={() => handleAddusers()} className="user-btn">
                Add New User
                <p>
                  <FontAwesomeIcon icon={faPlus} />
                </p>
              </a>
            </div>
          </div>
          {/* graph-box */}
          <div className="graph-box">
            <div className="profile-info-outer">
              {user &&
                user.company_users &&
                user.company_users.map((users, i) => {
                  return (
                    <div className="profile-item" key={i}>
                      <div className="item-data">
                        <h3>Name</h3>
                        <p>{users.first_name + " " + users.last_name}</p>
                      </div>
                      <div className="item-data">
                        <h3>Permissions</h3>
                        <p>{users.userType}</p>
                      </div>
                      <div className="item-link">
                        {Curentuser.email != users.email ? (
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            onClick={() =>
                              handleDelete(
                                users._id,
                                users.first_name + " " + users.last_name
                              )
                            }
                          />
                        ) : null}

                        {deletePopUp && (
                          <ErrorPopUp
                            message={deletePopUp}
                            deleteuser={true}
                            handleCencelDelete={() => setDeletePopUp("")}
                            handleCencel={() => handleDeleteUser()}
                          />
                        )}
                        {userDeletedSecond && (
                          <ErrorPopUp
                            message={showMessageSecond}
                            handleCencel={handleRemoveError}
                          />
                        )}
                        <img
                          src="/static/media/Editicon.c99c8b68.svg"
                          onClick={() =>
                            handleOtherEdits(
                              users._id,
                              users.first_name,
                              users.last_name,
                              users.email,
                              users.userType
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <CreateUser
          addshowFeilds={addshowFeilds}
          userData={userData}
          removeEdit={removeEdit}
          EditFeild={EditFeild}
          newuserFlag={newuserFlag}
          homePage={homePage}
        />
      </div>
    </>
  );
};
export default UserAccounts;
