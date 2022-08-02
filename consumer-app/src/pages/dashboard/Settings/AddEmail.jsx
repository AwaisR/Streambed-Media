import React, { useState } from "react";
import EmailIcon from "../../../assets/images/icons/Emails.svg";
import Swal from "sweetalert2";
import { AddOtherEmails } from "../../../actions/index.js";
import { useDispatch } from "react-redux";
export default function AddEmail() {
  const dispatch = useDispatch();
  const Alerts = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      footer: "<strong>Don't lose it, Don't share it</strong>",
    });
  };
  const [userEmail, setUserEmail] = useState({
    email: "",
    verifyEmail: "",
  });
  const handleChangeEmail = (e) => {
    setUserEmail({ ...userEmail, [e.target.name]: e.target.value });
  };
  const handleCencel = () => {
    setUserEmail({
      email: "",
      verifyEmail: "",
    });
  };
  const hanldeSubmit = () => {
    const { email, verifyEmail } = userEmail;
    const token = localStorage.getItem("token");
    if (email !== verifyEmail) {
      Alerts("Error", "Email and verify Emaill does not match ");
    } else {
      fetch("/users/other-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(AddOtherEmails(true));
          if (data.success) {
            Alerts("Email Send", data.message);
            setUserEmail({
              email: "",
              verifyEmail: "",
            });
          } else {
            Alerts("Error", data.message);
          }
        });
    }
  };
  return (
    <div className="backup-section-main">
      <div className="header-wrap">
        <img src={EmailIcon} alt="emailIcon" />
        <p>Add associated email</p>
      </div>
      <hr className="my-4" />
      <div className="deactivates-content">
        <p>
          By adding another email you increase the validity to your identity for
          immutable analytics with Streambed Media. Blah blah blah, ask Jenn for
          copy.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={userEmail.email}
          name="email"
          onChange={handleChangeEmail}
        />
        <input
          type="email"
          placeholder="Verify Email"
          value={userEmail.verifyEmail}
          name="verifyEmail"
          onChange={handleChangeEmail}
        />
        <p>Both fields must match and be a valid email address.</p>
      </div>
      <div className="backup-btn">
        <button onClick={handleCencel}>Cancel</button>
        <button
          onClick={hanldeSubmit}
          disabled={!userEmail.email && !userEmail.verifyEmail ? true : false}
        >
          Send Varification Email
        </button>
      </div>
    </div>
  );
}
