import React, { useState, useEffect } from "react";

import { socket } from "../../../helpers/socket";
import { useParams } from "react-router-dom";
import axios from "axios";
import Error from "./Error";
const AddEmails = () => {
  const [userEmails, setUserEmails] = useState([]);
  const [openInput, setOpenInput] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputDialog, setInputDialog] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [errorMesg, setErrorMesg] = useState("");
  const [addButton, setAddButton] = useState(true);
  const [active, setActive] = useState();
  const [mesg, setMesg] = useState("");
  const [loader, setLoader] = useState(false);
  const token = window.localStorage.getItem("token");
  let params = useParams();
  const emailActive = async () => {
    try {
      let { userID, activeToken, expiryTime } = params;
      const url = `/users/account/emailActive/${userID}/${activeToken}/${expiryTime}`;
      let res = await axios.get(url, {
        headers: { authorization: token },
      });
      setActive(res.data);
      console.log("res = ", res);
    } catch (error) {
      console.log("error = ", error);
      return false;
    }
  };
  const getData = () => {
    fetch("/users/other-emails", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserEmails(data));
  };
  useEffect(() => {
    emailActive();
    getData();
    // eslint-disable-next-line
  }, []);

  const handleClick = () => {
    setActive("");
    getData();
  };

  const handlePopUp = (email) => {
    setInputDialog(true);
    setDeleteEmail(email);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/users/other-emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({ email: inputEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserEmails(data);
          setInputEmail("");
          setOpenInput(false);
          setAddButton(true);
          setLoader(true);
        } else {
          setErrorMesg(data.message);
          setAddButton(true);
        }
      });
  };
  const handleDelete = (e) => {
    setInputDialog(false);
    fetch("/users/delete_other-emails", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({ email: deleteEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserEmails(data);
        } else {
          setErrorMesg(data.message);
        }
      });
  };
  const closeInput = () => {
    setInputEmail("");
    setOpenInput(false);
    setAddButton(true);
  };
  const handleOpenInput = () => {
    if (userEmails && userEmails.email && userEmails.email.length === 5) {
      setErrorMesg("Maximun number of add emails are reached ");
    } else {
      setOpenInput(true);
      setAddButton(false);
    }
  };
  useEffect(() => {
    socket.on("message", function (data) {
      setLoader(false);
      setMesg(data.message);
    });
    // eslint-disable-next-line
  }, [socket]);
  const handleError = () => {
    setMesg("");
  };
  const handleMesg = () => {
    setErrorMesg("");
  };
  return (
    <>
      <div className="edit-content ">
        <div>
          <h1>Your Account</h1>
        </div>
        <form className="email-form">
          <div className="form-group">
            <label className="p-email-label"> Primary Email</label>
            <div className="edit-input">
              <input
                value={userEmails.primary_email}
                name="displayname"
                className="form-control"
                type="text"
                disabled
              />
            </div>
          </div>
          <div className="form-group">
            <label className="p-email-label secondary">Secondary Emails</label>
            <label className="p-email-label small">
              <small>(you can add upto five emails)</small>
            </label>

            {userEmails &&
              userEmails.email &&
              userEmails.email.map((item, i) => (
                <div className="edit-input secondary-email" key={i}>
                  <input
                    value={item.email}
                    name="name"
                    className="form-control"
                    type="text"
                    disabled
                  />
                  <i
                    onClick={() => handlePopUp(item.email)}
                    className="fas fa-times-circle"
                    aria-hidden="true"
                  ></i>
                  {item.active ? (
                    <i className="fas fa-check fa-check-m"></i>
                  ) : null}
                </div>
              ))}
          </div>
          {openInput ? (
            <div className="form-group">
              <div className="edit-input">
                <input
                  value={inputEmail}
                  name="displayname"
                  className="form-control"
                  type="text"
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                <i
                  onClick={() => closeInput()}
                  className="fas fa-times-circle"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          ) : null}
        </form>
      </div>

      <div
        className="add-email-btns"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <button
          onClick={() => handleOpenInput()}
          href="#"
          className="btn btn-primary"
          disabled={addButton ? false : true}
        >
          Add Email
        </button>

        <button
          onClick={(e) => handleSubmit(e)}
          href="#"
          className="btn btn-primary"
          disabled={inputEmail ? false : true}
        >
          Save
        </button>
      </div>
      {errorMesg.length ? (
        <Error mesg={errorMesg} handleClick={handleMesg} />
      ) : (
        <div className={`required-popup ${!inputDialog ? "d-none" : null}`}>
          <div className="popup_inner">
            <div className="p-content msg">
              <label>Are you sure want to delete this email</label>
            </div>
            <div className="p-content">
              <label>{deleteEmail}</label>
            </div>
            <div
              className="required-content confirm-msg"
              style={{
                flexDirection: "row",
              }}
            >
              <button
                onClick={(e) => handleDelete()}
                href="#"
                className="btn btn-primary"
              >
                OK
              </button>

              <button
                onClick={() => setInputDialog(false)}
                href="#"
                className="btn btn-primary"
              >
                Cencel
              </button>
            </div>
          </div>
        </div>
      )}
      {mesg.length ? <Error mesg={mesg} handleClick={handleError} /> : ""}
      {active ? <Error mesg={active.message} handleClick={handleClick} /> : ""}
      {loader ? (
        <div className="tweet-loader">
          <div className="content-loader">
            <img
              alt="content-loader"
              src={require("~/assets/images/content-loader.svg")}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddEmails;
