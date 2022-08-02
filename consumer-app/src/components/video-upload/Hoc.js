import React from "react";
import UploadHeader from "./UploadHeader";

function Hoc(props) {
  return (
    <div>
      <UploadHeader />
      <div className="upload-platforms">
        <div className="platform-content-wrap">{props.children}</div>
      </div>
    </div>
  );
}

export default Hoc;
