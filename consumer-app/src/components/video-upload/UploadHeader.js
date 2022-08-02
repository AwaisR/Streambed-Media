import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { classNames } from "classnames";
function UploadHeader() {
  const progress = useSelector((state) => state.videoupload.progress);
  return (
    <div className="upload-head">
      <div className="upload-steps">
        <h3>CREATE POST</h3>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow="33.333"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <ul className="steps-list">
          <li>
            <span className="step-count">1</span> Identify
          </li>
          <li>
            <span className="step-count">2</span> Select
          </li>
          <li>
            <span className="step-count">3</span> Roles
          </li>
          <li>
            <span className="step-count">4</span> Publish
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UploadHeader;
