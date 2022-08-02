import React, { useState } from "react";
import LockIcon from "../../../assets/images/icons/Lock.svg";
import Swal from "sweetalert2";
export default function ResetPassword() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    verifyPassword: "",
  });
  const handleChangePassword = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const Alerts = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      footer: "<strong>Don't lose it, Don't share it</strong>",
    });
  };
  const handleCencel = () => {
    setPasswords({
      oldPassword: "",
      newPassword: "",
      verifyPassword: "",
    });
  };
  const hanldeSubmit = () => {
    const token = localStorage.getItem("token");
    const { oldPassword, newPassword, verifyPassword } = passwords;
    let data = {
      currentPassword: oldPassword,
      password: newPassword,
    };
    if (newPassword !== verifyPassword) {
      Alerts("Error", "New Password and verify Password does not match ");
    } else {
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
          console.log("message", message);
          if (message.success) {
            setPasswords({
              oldPassword: "",
              newPassword: "",
              verifyPassword: "",
            });
            Alerts("Password Changed", message.msg);
          } else {
            Alerts("Error", message.msg);
          }
        });
    }
  };
  return (
    <div className="backup-section-main">
      <div className="header-wrap">
        <img src={LockIcon} alt="lockimage" />
        <p>Change Password</p>
      </div>
      <hr className="my-4" />
      <div className="reset-content">
        <p className="mt-6 mb-3">Please confirm old password.</p>
        <input
          type="password"
          placeholder="Old password"
          name="oldPassword"
          onChange={handleChangePassword}
          value={passwords.oldPassword}
        />
        <hr className="my-4" />
        <p className="mb-3">Please confirm old password.</p>
        <input
          type="password"
          placeholder="New password"
          onChange={handleChangePassword}
          className="mb-5"
          value={passwords.newPassword}
          name="newPassword"
        />
        <input
          type="password"
          placeholder="Verify new password"
          onChange={handleChangePassword}
          name="verifyPassword"
          className="mb-6"
          value={passwords.verifyPassword}
        />
        <p>Both new password fields must match.</p>
      </div>
      <div className="backup-btn">
        <button onClick={() => handleCencel()}>Cancel</button>
        <button onClick={hanldeSubmit}>Save Changes</button>
      </div>
    </div>
  );
}
