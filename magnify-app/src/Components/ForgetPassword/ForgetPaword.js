import react, { useState, useEffect } from "react";
import Logo from "../../Containers/Logo";
import "../../Containers/index.css";
import Label from "../../Containers/Label";
import InputFeild from "../../Containers/InputFeild";
import Footer from "../../Containers/Footer";
import Button from "../../Containers/Button";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { forgetActions } from "../../store/forgetPassword/actions";
import ErrorPopUp from "../../Containers/ErrorPopUp";
import { useSelector, useDispatch } from "react-redux";
const ForgetPaword = (props) => {
  const history = useHistory();
  const parmas = useParams();
  var { email, expiryToken, expiryTime } = parmas;
  const state = useSelector((state) => state.forgetPassword);
  let { varifiedEmail, ErrorMessg, passwordUpdate } = state;
  const dispatch = useDispatch();
  const [errorCheck, setErrorCheck] = useState(false);
  const [errorCheckTrue, setErrorCheckTrue] = useState(false);
  const [error, setError] = useState(false);
  const [validpass, setValidpass] = useState("");
  const [newPassword, setNewPassword] = useState({
    password: "",
    varifyPassword: "",
  });
  const handleback = () => {
    history.push("/");
  };
  const handleChange = (e) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    passwordUpdate &&
      setTimeout(() => {
        localStorage.removeItem("token");
        history.push("/");
      }, [5000]);
  }, [passwordUpdate]);
  useEffect(() => {
    if (newPassword.password !== newPassword.varifyPassword) {
      setErrorCheck(true);
      setErrorCheckTrue(false);
    } else if (newPassword.varifyPassword.length) {
      setErrorCheck(false);
      setErrorCheckTrue(true);
    }
  }, [newPassword.varifyPassword]);
  const handleClick = () => {
    if (newPassword.password.length < 8) {
      setValidpass("Please Enter Password More Then 8 Charecter");
    } else if (
      newPassword.password &&
      newPassword.varifyPassword &&
      errorCheckTrue
    ) {
      dispatch(
        forgetActions.resetPassword(newPassword, email, expiryToken, expiryTime)
      );
    } else {
      setError(true);
    }
  };
  const handleCencel = () => {
    dispatch(forgetActions.CencelErrors());
  };
  return (
    <>
      <div className="row no-gutters mb-none">
        <Logo />
        <div className="col-12 col-lg-8 col-md-8">
          <div className="ForgetPassword signup-wrap">
            <div className="container">
              <h1 className="main-title">Forget Password</h1>
              <div className="content-inner">
                <div className="reset-password">
                  <h2>Reset password</h2>
                  <p>
                    To reset your password, enter the email associated with your
                    account. You will receive an email and follow the prompts to
                    initiate resetting your password.
                  </p>
                  <p>
                    Please note that your account administrator will also be
                    notified of your password being reset.
                  </p>
                  <form>
                    <div className="input-password input-pop-up">
                      <div className="info-icon">
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        <div className="requirements-pop-up">
                          <span className="title-label">
                            Password Requirements
                          </span>
                          <ul className="pop-up">
                            <li>8 characters or more</li>
                            <li>Uppercase character</li>
                            <li>Lowercase character</li>
                            <li>Number</li>
                            <li>Symbol</li>
                          </ul>
                        </div>
                      </div>
                      <InputFeild
                        labelname="New Password"
                        className="form-control"
                        placeholder="••••••••"
                        name="password"
                        type="password"
                        fa-chevron-right
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="input-password not-match">
                      <div className="input-label input-cross">
                        {errorCheck && (
                          <>
                            <span>
                              Passwords do not match. Please try again.
                            </span>
                            <ul className="cross-icon">
                              <li className="cross">
                                <FontAwesomeIcon
                                  icon={faTimesCircle}
                                  // onClick={handleErrorCencel}
                                />
                              </li>
                            </ul>
                          </>
                        )}
                        {errorCheckTrue && (
                          <>
                            <ul className="cross-icon">
                              <li className="currect">
                                <FontAwesomeIcon icon={faCheckCircle} />
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                      <InputFeild
                        labelname="Verify New Password"
                        className="form-control"
                        placeholder="••••••••"
                        name="varifyPassword"
                        type="password"
                        handleChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="form-footer">
                  <div className="cancel-btn">
                    <Button
                      name="Cancel"
                      className="form-btn"
                      nextArrow="yes"
                      handleClick={handleback}
                    />
                  </div>
                  <div className="next-btn">
                    {error && <span>All fields are mandatory.</span>}
                    <div className="next-btn">
                      <Button
                        name="Reset"
                        className="form-btn"
                        nextArrow="yes"
                        handleClick={handleClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {passwordUpdate && (
            <ErrorPopUp
              message="Your password has been updated and your account will redirect to the login page"
              handleCencel={handleCencel}
            />
          )}
          {ErrorMessg && (
            <ErrorPopUp message={ErrorMessg} handleCencel={handleCencel} />
          )}
          {validpass && (
            <ErrorPopUp
              message={validpass}
              handleCencel={() => setValidpass("")}
            />
          )}
          <Footer />
        </div>
      </div>
    </>
  );
};
export default ForgetPaword;
