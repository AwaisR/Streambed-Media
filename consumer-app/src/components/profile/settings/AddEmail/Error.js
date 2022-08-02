import React from "react";
const Error = ({ mesg, handleClick }) => {
  return (
    <>
      <div className={`required-popup error-msg "d-none"}`}>
        <div className="popup_inner">
          <div className="p-content">
            <label>{mesg}</label>
          </div>
          <div className="required-content">
            <button onClick={handleClick} href="#" className="btn btn-primary">
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Error;
