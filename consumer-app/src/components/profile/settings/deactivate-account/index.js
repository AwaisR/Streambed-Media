import React from "react";
import "./index.css";
function Deactivate() {
  return (
    <div className="deactivate-content">
      <h3>Deactivate Account</h3>
      <p>
        Deactivating your account will erase all your account details and close
        it. You can recover your account and access your data later using the{" "}
        <span href="#">mnemonic</span>.
        <i className="fa fa-question-circle-o" aria-hidden="true"></i>
      </p>
      <button href="#" className="btn btn-outline-primary">
        DEACTIVATE ACCOUNT
      </button>
    </div>
  );
}

export default Deactivate;
