import React, { useState, useEffect } from "react";
// import img from "../../../../assets/images/select-icon.png";
import axios from "axios";
import Alert from "../../../shared/Alert";
import { useDispatch } from "react-redux";
import { addUser } from "../../../../actions/index";
import { useHistory } from "react-router-dom";

function EditProfile() {
  const history = useHistory();
  const dispatch = useDispatch();
  let aboutEdit = React.useRef();
  const [profileData, setProfileData] = useState({
    displayName: "",
    userName: "",
    email: "",
    re_email: "",
    password: "",
    re_password: "",
    dateofBirth: {
      day: "",
      month: "",
      year: "",
    },
    about: "",
  });
  const [user, setUser] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setalertMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordAlert, setCurrentPasswordAlert] = useState("");

  const [inputDialog, setInputDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState(false);
  const [emailInput, setEmailInput] = useState(false);
  const [emailUpdate, setEmailUpdate] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [newEmail, setNewEmail] = useState({
    email: "",
    re_email: "",
  });
  const [isPwdMatch, setPwdMatch] = useState(false);

  const [edit, setEdit] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {};
    if (profileData.password) {
      if (profileData.password !== profileData.re_password) {
        setalertMessage("Password do not match");
        setShowAlert(true);
        return;
      } else {
        data.password = profileData.password;
      }
    }

    if (user.displayName !== profileData.displayName.trim()) {
      data.name = profileData.displayName.trim();
    }

    if (newEmail.email.trim().length && user.email !== newEmail.email.trim()) {
      /* eslint-disable */
      const reg = `/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i`;
      const validEmailRegex = RegExp(reg);
      const isValidEmail = validEmailRegex.test(newEmail.email.trim());
      // check if user has already enter email
      if (!isValidEmail) {
        setalertMessage("Invalid Email");
        setShowAlert(true);
        return;
      }
      data.email = newEmail.email.trim();
    }

    if (profileData.about) {
      data.about = profileData.about;
    }
    if (
      profileData.dateofBirth.day &&
      profileData.dateofBirth.month &&
      profileData.dateofBirth.year
    ) {
      data.DoB = profileData.dateofBirth;
    }
    const token = window.localStorage.getItem("token");

    if (!Object.keys(data).length) {
      setalertMessage("Nothing to change");
      setShowAlert(true);
      return;
    }

    if (currentPassword.length < 1) {
      setCurrentPasswordAlert(true);
      return;
    }

    data.currentPassword = currentPassword;

    fetch("/users/editprofile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((message) => {
        getUser();
        setCurrentPassword("");
        dispatch(
          addUser({
            displayName: profileData.displayName,
            email: user.email,
          })
        );
        if (message.emailUpdate) {
          setTimeout(() => {
            history.push("/logout");
          }, 4000);
          setEmailUpdate(true);
        } else {
          setalertMessage(message.msg);
          setShowAlert(true);
        }
      });
  };
  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;
        setUser(user);

        let _tempProfile = {};
        // TODO update set profile data
        setProfileData({ ...profileData, ...user });
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  const emailAlert = () => {
    return (
      <div className="required-popup ">
        <div className="popup_inner">
          <h5>Changes Saved</h5>
          <div className="p-content">
            <p>An email has been sent to </p>
            <p>{user.email}</p>
            <p>
              your email will be updated once you have verified your new
              address.
            </p>
          </div>
          <div className="required-content">
            <button
              onClick={() => {
                setEmailUpdate(false);
                history.push("/logout");
              }}
              href="#"
              className="btn btn-primary"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    getUser();
  }, []);
  const handleChange = (e) => {
    /* eslint-disable */
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );

    switch (e.target.name) {
      case "name":
        setProfileData({ ...profileData, displayName: e.target.value });
        break;
      case "email":
        const isValidEmail = validEmailRegex.test(e.target.value.trim());

        if (!isValidEmail) {
          setValidEmail(false);
        } else {
          if (e.target.value === newEmail.re_email) {
            setValidEmail(true);
          } else {
            setValidEmail(false);
          }
        }
        setNewEmail({ ...newEmail, email: e.target.value });
        break;
      case "re-email":
        if (!validEmailRegex.test(e.target.value.trim())) {
          setValidEmail(false);
        } else {
          if (e.target.value === newEmail.email) {
            setValidEmail(true);
          } else {
            setValidEmail(false);
          }
        }
        setNewEmail({ ...newEmail, re_email: e.target.value });
        break;
      case "password":
        setProfileData({ ...profileData, password: e.target.value });
        break;
      case "re-password":
        setProfileData({ ...profileData, re_password: e.target.value });
        break;

      case "about":
        setProfileData({ ...profileData, about: e.target.value });
        break;
      default:
        break;
    }
  };

  const setBirthDate = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    switch (field) {
      case "day":
        if (value < 0 || value > 31 || value.length > 2) return;
        break;
      case "month":
        if (value < 0 || value > 12 || value.length > 2) return;
        break;
      case "year":
        if (value > new Date().getFullYear() - 10) return;
        break;
      default:
        break;
    }

    setProfileData({
      ...profileData,
      dateofBirth: {
        ...profileData.dateofBirth,
        [e.target.name]: e.target.value,
      },
    });
  };

  useEffect(() => {
    if (edit) {
      aboutEdit.current.focus();
    }
  }, [edit]);
  const handleCurrentPassword = (value) => {
    setCurrentPasswordAlert(value);
    document.getElementById("btn-save").click();
  };
  const onTextChange = (e) => {
    setCurrentPassword(e.target.value);
  };
  const userNameInput = () => {
    return (
      <div className={`required-popup ${!inputDialog ? "d-none" : null}`}>
        <div className="popup_inner">
          <div className="p-content">
            <label>Please enter your new username</label>
          </div>
          <div className="required-content">
            <div className="form-group">
              <input
                className="form-control"
                placeholder="@username"
                value={profileData.displayName}
                name="name"
                onChange={handleChange}
              />
            </div>

            <button
              onClick={() => setInputDialog(false)}
              href="#"
              className="btn btn-primary"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const userEmailInput = () => {
    return (
      <div className={`required-popup ${!emailInput ? "d-none" : null}`}>
        <div className="popup_inner">
          <div className="p-content">
            <label>Please enter your new Email</label>
          </div>
          <div className="required-content">
            <div className="form-group">
              <input
                value={newEmail.email}
                name="email"
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="form-control"
                type="email"
              />
              <input
                value={newEmail.re_email}
                name="re-email"
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="form-control"
                type="email"
              />
            </div>
            <div className="alert-btns-bottom">
              <button
                onClick={() => {
                  setNewEmail({ email: "", re_email: "" });
                  setProfileData({ ...profileData, email: user.email });
                  setEmailInput(false);
                }}
                href="#"
                className="btn btn-primary"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setProfileData({ ...profileData, email: newEmail.email });
                  setEmailInput(false);
                }}
                href="#"
                className="btn btn-primary"
                disabled={!validEmail}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const userpasswordInput = () => {
    return (
      <div className={`required-popup ${!passwordInput ? "d-none" : null}`}>
        <div className="popup_inner">
          <div className="p-content">
            <label>Please enter your new password</label>
          </div>
          <div className="required-content">
            <div className="form-group">
              <input
                value={profileData.password}
                name="password"
                onChange={(e) => {
                  handleChange(e);
                  if (
                    profileData.re_password &
                    (profileData.re_password !== e.target.value)
                  ) {
                    setPwdMatch(true);
                  } else {
                    setPwdMatch(false);
                  }
                }}
                placeholder="**********"
                className="form-control"
                type="password"
              />
              <div className="password-rel">
                <input
                  value={profileData.re_password}
                  name="re-password"
                  onChange={(e) => {
                    handleChange(e);
                    if (profileData.password !== e.target.value) {
                      setPwdMatch(true);
                    } else {
                      setPwdMatch(false);
                    }
                  }}
                  placeholder="**********"
                  className={`form-control  ${
                    isPwdMatch ? "is-invalid" : null
                  }`}
                  type="password"
                />
                <span
                  className={`password-invalid ${isPwdMatch ? "" : "d-none"}`}
                >
                  <img
                    alt="cross-icon input"
                    src={require("../../../../assets/images/cross-icon-input.png")}
                  />
                </span>
              </div>

              <div className="invalid-feedback">(Password do not match)</div>
            </div>

            <button
              onClick={() => {
                setPasswordInput(false);
                if (profileData.password) {
                  if (profileData.password !== profileData.re_password) {
                    setPwdMatch(true);
                    return;
                  }
                }
              }}
              href="#"
              className="btn btn-primary center"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const setDate = (el, value) => {
    const event = new Event("change");
    const elem = document.getElementById(el);
    elem.addEventListener(
      "change",
      function (e) {
        setBirthDate(e);
      },
      false
    );
    const val = document.getElementById(el).value;
    if (val == 0 && value < 0) return;
    document.getElementById(el).value = (parseInt(val) + value).toLocaleString(
      "en-US",
      {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }
    );
    // Dispatch the event.
    elem.dispatchEvent(event);
  };

  return (
    <>
      <div id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="edit"
          role="tabpanel"
          aria-labelledby="edit-tab"
        >
          <div className="edit-content">
            <div className="profile-avatar">
              <div className="avatar">
                <img
                  alt="avatar"
                  src={require("../../../../assets/images/avatar.png")}
                />
              </div>
              <div className="text-center">
                <span href="#" className="change-bitmoji">
                  Change Bitmoji
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <form>
              <div className="form-group">
                <label>Display Name</label>
                <div className="edit-input">
                  <input
                    value={profileData.displayName}
                    name="displayname"
                    className="form-control"
                    type="text"
                    disabled
                  />
                  <i
                    onClick={() => setInputDialog(true)}
                    className="fa fa-pencil"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="form-group">
                <label>Username</label>
                <div className="edit-input">
                  <input
                    value={profileData.displayName}
                    name="name"
                    className="form-control"
                    type="text"
                    disabled
                  />
                  <i
                    onClick={() => setInputDialog(true)}
                    className="fa fa-pencil"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="edit-input">
                  <input
                    value={profileData.email}
                    name="email"
                    onChange={handleChange}
                    placeholder="email@gmail.com"
                    className="form-control"
                    type="email"
                    disabled
                  />
                  <i
                    onClick={() => {
                      setEmailInput(true);
                    }}
                    className="fa fa-pencil"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="edit-input">
                  <input
                    name="password"
                    placeholder="**********"
                    className="form-control"
                    type="password"
                    disabled
                  />
                  <i
                    onClick={() => {
                      setPasswordInput(true);
                    }}
                    className="fa fa-pencil"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>

              <div className="form-group date-fields">
                <label>Birthday(optional)</label>
                <div className="edit-input">
                  <div className="input-date quantity-form">
                    <input
                      id="input-day"
                      name="day"
                      placeholder="dd"
                      className="form-control"
                      type="number"
                      value={profileData.dateofBirth.day || ""}
                      onChange={(e) => {
                        setBirthDate(e);
                      }}
                    />
                    <div className="form_caret">
                      <i
                        onClick={(e) => {
                          const value = parseInt(
                            document.getElementById("input-day").value
                          );
                          if (value < 0 || value > 30 || value.length > 2)
                            return;

                          setDate("input-day", 1);
                        }}
                        className="fas fa-caret-up qty-plus"
                      ></i>
                      <i
                        onClick={(e) => {
                          const value = parseInt(
                            document.getElementById("input-day").value
                          );
                          if (value < 0 || value > 31 || value.length > 2)
                            return;
                          setDate("input-day", -1);
                        }}
                        className="fas fa-caret-down qty-minus"
                      ></i>
                    </div>
                  </div>
                  <div className="input-date quantity-form">
                    <input
                      id="input-month"
                      name="month"
                      placeholder="mm"
                      className="form-control"
                      type="number"
                      value={profileData.dateofBirth.month || ""}
                      onChange={(e) => {
                        setBirthDate(e);
                      }}
                    />
                    <div className="form_caret">
                      <i
                        onClick={(e) => {
                          const value = parseInt(
                            document.getElementById("input-month").value
                          );
                          if (value < 0 || value > 11 || value.length > 2)
                            return;
                          setDate("input-month", 1);
                        }}
                        className="fas fa-caret-up qty-plus"
                      ></i>
                      <i
                        onClick={(e) => {
                          const value = parseInt(
                            document.getElementById("input-month").value
                          );
                          if (value < 0 || value > 11 || value.length > 2)
                            return;

                          setDate("input-month", -1);
                        }}
                        className="fas fa-caret-down qty-minus"
                      ></i>
                    </div>
                  </div>
                  <div className="input-date quantity-form">
                    <input
                      id="input-year"
                      name="year"
                      placeholder="yyyy"
                      className="form-control"
                      type="number"
                      value={profileData.dateofBirth.year || ""}
                      onChange={(e) => {
                        setBirthDate(e);
                      }}
                    />
                    <div className="form_caret">
                      <i
                        onClick={(e) => {
                          const value = parseInt(
                            document.getElementById("input-year").value
                          );
                          if (value > new Date().getFullYear() - 10) return;
                          setDate("input-year", 1);
                        }}
                        className="fas fa-caret-up qty-plus"
                      ></i>
                      <i
                        onClick={(e) => {
                          const value = parseInt(
                            document.getElementById("input-year").value
                          );
                          // if (value > new Date().getFullYear() - 10) return;

                          setDate("input-year", -1);
                        }}
                        className="fas fa-caret-down qty-minus"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>About</label>
                <div className="edit-input">
                  <textarea
                    id="about-edit"
                    name="about"
                    className="form-control"
                    resize="none"
                    rows="5"
                    disabled={!edit}
                    ref={aboutEdit}
                    onChange={handleChange}
                    value={profileData.about}
                  ></textarea>
                  <i
                    onClick={() => {
                      // setPasswordInput(true);
                      aboutEdit.current.focus();

                      // document.getElementById("about-edit").focus();
                      setEdit(true);
                    }}
                    className="fa fa-pencil"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>

              <div className="form-group"></div>
              <div className="save-button">
                <button
                  id="btn-save"
                  onClick={(e) => handleSubmit(e)}
                  className="btn btn-primary"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
        {currentPasswordAlert ? (
          <Alert
            content="Please enter your current password to confirm changes"
            setAlert={handleCurrentPassword}
            textBox={true}
            onTextChange={onTextChange}
            textboxData={currentPassword}
          />
        ) : null}
        {showAlert ? (
          <Alert
            content={alertMessage}
            setAlert={() => {
              setShowAlert(2 > 3);
            }}
          />
        ) : null}
      </div>
      {emailUpdate ? emailAlert() : null}
      {userNameInput()}
      {passwordInput ? userpasswordInput() : null}
      {emailInput ? userEmailInput() : null}
    </>
  );
}

export default EditProfile;
