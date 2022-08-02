import react, { useState, useEffect } from "react";
import Logo from "../../Containers/Logo";
import "../../Containers/index.css";
import Label from "../../Containers/Label";
import InputFeild from "../../Containers/InputFeild";
import Footer from "../../Containers/Footer";
import Button from "../../Containers/Button";
import ForgetPaword from "./ForgetPaword";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { forgetActions } from "../../store/forgetPassword/actions";
import ErrorPopUp from "../../Containers/ErrorPopUp";
const ForgetPassword = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [errorFeild, setErrorFeild] = useState(false);
  const state = useSelector((state) => state.forgetPassword);
  let { varifiedEmail, ErrorMessg } = state;
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const handleChange = (e) => {
    setErrorFeild(false);
    setForgetEmail(e.target.value);
  };
  const handleSubmit = () => {
    if (forgetEmail.length) {
      const validEmail = validateEmail(forgetEmail);
      if (validEmail) {
        forgetEmail && dispatch(forgetActions.varifyEmail(forgetEmail));
      } else {
        setError(`${forgetEmail}is not valid email`);
      }
    } else {
      setErrorFeild(true);
    }
  };
  useEffect(() => {
    if (ErrorMessg) {
      setError(ErrorMessg);
    }
  }, [ErrorMessg]);
  const handleCencel = () => {
    dispatch(forgetActions.CencelErrors());
    setError("");
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
                    initiate resetting your password. Please note that your
                    account administrator will also be notified of your password
                    being reset.
                  </p>
                  <form>
                    <InputFeild
                      labelname="Email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      type="email"
                      handleChange={handleChange}
                    />
                  </form>
                </div>
                <div className="form-footer">
                  <div className="cancel-btn">
                    <Button
                      name="Cancel"
                      className="form-btn"
                      nextArrow="yes"
                      handleClick={() => history.push("/")}
                    />
                  </div>
                  <div className="next-btn">
                    {errorFeild && <span>All fields are mandatory.</span>}
                    <div className="next-btn">
                      <Button
                        name="Reset"
                        className="form-btn"
                        nextArrow="yes"
                        handleClick={handleSubmit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {error && (
              <ErrorPopUp message={error} handleCencel={handleCencel} />
            )}
            {varifiedEmail && (
              <ErrorPopUp
                message="Email has been sent to your account please check it"
                handleCencel={handleCencel}
              />
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};
export default ForgetPassword;
