import React from "react";
import Button from "./Button";
const ErrorPopUp = ({
  message,
  handleCencel,
  deleteuser,
  handleCencelDelete,
}) => {
  return (
    <>
      {message.length ? (
        <>
          <div className="error-pop-up">
            <span className="title-label">{message}</span>
            {message.length ? (
              <Button
                name="OK "
                className="form-btn"
                handleClick={handleCencel}
              />
            ) : null}
            {deleteuser ? (
              <Button
                name="Cencel"
                className="form-btn delete"
                handleClick={handleCencelDelete}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
};
export default ErrorPopUp;
