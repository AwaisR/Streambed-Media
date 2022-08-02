import React from "react";
import "./index.css";
function ResetPassword() {
  return (
    <div>
      <div className="popup-wrap">
        <div className="popup-box">
          <ul className="swal2-progress-steps">
            <li className="swal2-progress-step swal2-active-progress-step">
              1
            </li>
            <li className="swal2-progress-step-line"></li>
            <li className="swal2-progress-step">2</li>
            <li className="swal2-progress-step-line"></li>
            <li className="swal2-progress-step">3</li>
          </ul>
          <h2>Enter Old Password</h2>
          <div>
            <input className="swal2-input" placeholder="" type="password" />
          </div>
          <div className="swal2-actions">
            <button type="button" className="swal2-styled swal2-confirm">
              Next<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className="swal2-styled swal2-cancel"
              aria-label=""
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <footer className="login-footer">
        <div>
          &copy; All rights Reserved Streambed Media Inc &nbsp;
          {new Date().getFullYear()}
        </div>
        <div>
          <Link to="#">Terms of Service&nbsp;</Link>
          |&nbsp;
          <Link to="#">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default ResetPassword;
