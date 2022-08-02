import React, { useState } from "react";
import Deactivate from "../../../assets/images/icons/Deactivate.svg";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
export default function DeactivateDetails() {
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [checked, setChecked] = useState(false);
  let history = useHistory();
  const Alerts = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      footer: "<strong>Don't lose it, Don't share it</strong>",
    });
  };
  const hanldeSubmit = () => {
    const token = localStorage.getItem("token");
    if (!checked) {
      Alerts("Error", "Please Checked the checkbox");
      return;
    }
    if (password !== verifyPassword) {
      Alerts("Error", "password and verify password does not match ");
    } else {
      fetch("/users/deactivate-account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({ password: password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Alerts("Account Diactivate", data.msg);
            setPassword("");
            localStorage.removeItem("token");
            history.push("/");

            setVerifyPassword("");
          } else {
            Alerts("Error", data.msg);
          }
        });
    }
  };
  return (
    <div className="backup-section-main">
      <div className="header-wrap">
        <img src={Deactivate} alt="deactivate" />
        <p>Deactivate Streambed Account</p>
      </div>
      <hr className="my-4" />
      <div className="deactivates-content">
        <p>
          Please note that deactivating your account would permanently delete
          your account with Streambed.
          <br />
        </p>
        <p> Please enter your password to continue.</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        <p>Both fields must match and be a valid email address.</p>
        <div className="accept-checkbox">
          <input
            type="checkbox"
            id="Accept"
            name="Accept"
            value={checked}
            onChange={() => setChecked(!checked)}
          />
          <label for="Accept"> Accept</label>
        </div>
      </div>
      <div className="backup-btn">
        <button onClick={() => setPassword("")}>Cancel</button>
        <button
          onClick={hanldeSubmit}
          disabled={!password && !verifyPassword && !checked ? true : false}
        >
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
