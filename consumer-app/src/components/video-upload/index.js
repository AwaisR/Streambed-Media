import React, { useState } from "react";
import "./index.css";
import PlateForm from "./PlateForm";
import Collaboration from "./Collaboration";
import UploadOverView from "./UploadOverView";
import Hoc from "./Hoc";
import YoutubeModal from "./YoutubeModal";

import { useDispatch, useSelector } from "react-redux";
import { setVideoStep } from "../../actions";

function VideoUpload() {
  const dispatch = useDispatch();
  const step1 = useSelector((state) => state.videoupload.step);
  return (
    <div>
      <div className="upload-wrap">
        <div className="container" id="video-upload-tour">
          {step1 === 1 ? (
            <div id="video-upload-tour">
              <Hoc>
                <PlateForm />
              </Hoc>
            </div>
          ) : null}
          {step1 === 3 ? <YoutubeModal /> : null}
          {step1 === 4 ? (
            <Hoc>
              <Collaboration />
            </Hoc>
          ) : null}
          {step1 === 5 ? (
            <Hoc>
              <UploadOverView />
            </Hoc>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
