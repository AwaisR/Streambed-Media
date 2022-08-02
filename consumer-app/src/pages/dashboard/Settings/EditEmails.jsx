import React, { useState, useEffect } from "react";
import EmailIcon from "../../../assets/images/icons/Emails.svg";
import Dot from "../../../assets/images/icons/Dot.svg";
import Cross from "../../../assets/images/icons/Cross.svg";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AdditionalEmails, AddOtherEmails } from "../../../actions/index.js";
export default function EditEmails() {
  let dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const { AddtionalEmails } = state;
  // const [password, setPassword] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setPrimaryEmail(AddtionalEmails.primary_email);
    setEmails(AddtionalEmails.email);
  }, [AddtionalEmails]);
  const handleDelete = (email) => {
    let token = localStorage.getItem("token");
    fetch("/users/delete_other-emails", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(AdditionalEmails(data));
          Swal.fire({
            title: "Success",
            text: "Email Deleted Successfully",
            // footer: "<strong>Don't lose it, Don't share it</strong>",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: data.message,
            // footer: "<strong>Don't lose it, Don't share it</strong>",
          });
        }
      });
  };
  const Alerts = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      footer: "<strong>Don't lose it, Don't share it</strong>",
    });
  };
  const hanldeSubmit = () => {
    const token = localStorage.getItem("token");
    fetch("users/edit-other-emails", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({ email: emails }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(AddOtherEmails(true));
        if (data.success) {
          Alerts("Email Updated", data.msg);
        } else {
          Alerts("Error", data.msg);
        }
      });
  };
  const handleEditEmails = (value, index) => {
    emails[index].email = value;
  };
  return (
    <div className="backup-section-main">
      <div className="header-wrap">
        <img src={EmailIcon} alt="Emailicon" />
        <p>Edit associated emails</p>
      </div>
      <hr className="my-4" />
      <div className="EditEmail-content">
        <p>
          Remove verified emails or change primary associated email in your
          list.
          <br />
        </p>
        <div className="flex justify-between items-center">
          <img src={Dot} alt="Dot" />
          <input
            type="text"
            placeholder="Password"
            value={primaryEmail}
            // onChange={(e) => setPrimaryEmail(e.target.value)}
          />
          <img src={Cross} alt="cross" />
        </div>
        <hr className="my-4" />
        <div className="input_outer">
          {emails &&
            emails.forEach((item, i) => {
              if (item.active) {
                return (
                  <div
                    className="flex justify-between items-start addtional-email"
                    key={i}
                  >
                    <img src={Dot} alt="Dot" />
                    <input
                      type="text"
                      defaultValue={item.email}
                      //   value={}
                      onChange={(e) => handleEditEmails(e.target.value, i)}
                    />
                    <img
                      src={Cross}
                      onClick={() => handleDelete(item.email)}
                      className="cursor-pointer"
                      alt="cross"
                    />
                  </div>
                );
              }
            })}
        </div>

        <div className="accept-checkbox-editEmails">
          <input
            type="checkbox"
            id="Accept"
            name="Accept"
            value={checked}
            onChange={(e) => setChecked(!checked)}
          />
          <label for="Accept"> Accept</label>
        </div>
      </div>
      <div className="backup-btn">
        <button>Cancel</button>
        <button onClick={hanldeSubmit} disabled={!checked ? true : false}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
