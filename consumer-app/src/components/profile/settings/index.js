import React, { useEffect } from "react";
import "./index.css";

import EditProfile from "./edit-profile/index";
import { useParams } from "react-router-dom";
import LinkedAccount from "./linked-account";
import Deactivate from "./deactivate-account/index";
import AddEmails from "./AddEmail/AddEmails";

function Settings({ match, link }) {
  let { topicId } = useParams();

  useEffect(() => {
    link(topicId);
    // eslint-disable-next-line
  }, [topicId]);
  return (
    <div className="tab-content">
      {topicId === "edit" ? (
        <EditProfile />
      ) : topicId === "link" ? (
        <LinkedAccount />
      ) : topicId === "deactivate" ? (
        <Deactivate />
      ) : topicId === "addEmail" ? (
        <AddEmails />
      ) : (
        <EditProfile />
      )}
    </div>
  );
}

export default Settings;
