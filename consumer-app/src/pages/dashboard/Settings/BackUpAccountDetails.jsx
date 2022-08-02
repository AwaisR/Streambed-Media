import React, { useState } from "react";
import LockIcon from "../../../assets/images/icons/Lock.svg";
import Swal from "sweetalert2";
export default function BackUpAccountDetails() {
  const [userPassword, setUserPassword] = useState("");
  const Alerts = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      footer: "<strong>Don't lose it, Don't share it</strong>",
    });
  };
  const getWallet = async (data, result) => {
    let response = await fetch("/users/backup-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        result,
      }),
    });
    const resJson = await response.json();
    return resJson.plaintext;
  };
  const hanldeSubmit = () => {
    let token = localStorage.getItem("token");
    fetch("/users/comparepw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        password: userPassword,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.success) {
          setUserPassword("");
          let plaintext = await getWallet(data, userPassword);
          Alerts("Write this mnemonic down", plaintext);
        } else {
          Alerts("Error", data.msg);
        }
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
  };
  return (
    <div className="backup-section-main">
      <div className="header-wrap">
        <img src={LockIcon} alt="lockImg" />
        <p>Backup Account</p>
      </div>
      <hr className="my-4" />
      <div className="backup-content">
        <p>
          Please enter your password to backup your account and receive your
          mnemonic.
        </p>
        <input
          type="password"
          placeholder="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <hr className="my-4" />
        <p>
          Pressing “Continue” below will present a popup with the generated
          mnemonic for your account. Please copy and save this mnemonic in case
          you ever want to recover your deactivated account.
        </p>
      </div>
      <div className="backup-btn">
        <button onClick={() => setUserPassword("")}>Cancel</button>
        <button onClick={hanldeSubmit} disabled={!userPassword ? true : false}>
          Continue
        </button>
      </div>
    </div>
  );
}
