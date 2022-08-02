import React from "react";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

function UploadOverView(props) {
  const { share_id, title, collaborator, org_id, sia_url } = props;
  let history = useHistory();

  var linkedInUrl = `https://www.linkedin.com/company/${org_id}/admin/`;
  const goToSiaUrl = () => {
    window.location.replace(`https://siasky.net/${sia_url}`);
  };
  const goToDashboard = () => {
    history.push("/dashboard");
  };

  return (
    <div className="overview-wrap">
      <h4>Upload Overview</h4>
      <div className="overview-box">
        <ul>
          <li>
            <label>Title</label>
            <span>{title}</span>
          </li>
          <li>
            <label>Upload Date</label>
            <span>{moment().format("MMMM Do YYYY")}</span>
          </li>
          <li>
            <label>Collaborators</label>
            <div className="collaborators-right">
              {collaborator?.map((item) => {
                return (
                  <span key={uuidv4()}>
                    <span>{item.role} -&nbsp;</span>
                    <span>{item.user}</span>
                  </span>
                );
              })}
            </div>
          </li>
          <li>
            <label>
              Platforms
              <small>Click icon to view post in new tab</small>
            </label>
            <span>
              <a
                href={`${linkedInUrl}`}
                className="platForm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="facebook icon"
                  src={require("../../assets/images/linkedin.svg")}
                />
                <i className="fa fa-check-circle" aria-hidden="true"></i>
              </a>
            </span>
          </li>
          <li>
            <label>OIP Transaction ID</label>
            <span className="flo-hash-key">
              <span>{share_id?.substring(0, 45)}...</span>
            </span>
          </li>
          <li>
            <label>Sia Storage ID</label>
            <span onClick={goToSiaUrl} className="flo-hash-key">
              <span>
                {`${sia_url ? sia_url : ""}`.substring(0, 10)}
                ...
              </span>
            </span>
          </li>
        </ul>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <button
            onClick={() => {
              goToDashboard();
            }}
            className="btn btn-primary upload-new"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="col-sm-6">
          <button className="btn btn-primary upload-new">
            Go to indexing page
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadOverView;
