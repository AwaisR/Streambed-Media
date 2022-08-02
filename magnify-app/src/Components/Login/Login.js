import react, { useState, useEffect } from "react";
import "../../Containers/index.css";
import Button from "../../Containers/Button";
import Footer from "../../Containers/Footer";
import Logo from "../../Containers/Logo";
import InputFeild from "../../Containers/InputFeild";
import { useHistory } from "react-router-dom";
import ErrorPopUp from "../../Containers/ErrorPopUp";
import { userLogin } from "../../store/login/action";
import { useSelector, useDispatch } from "react-redux";
const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const loginUser = useSelector((state) => state.loginUser);
  var { loginError, userData, isLogin } = loginUser;
  const [show, setShow] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignUp = () => {
    history.push("/signup");
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      dispatch(userLogin.loginFuntion(loginData));
    } else {
      setShow("Enter username and password");
    }
  };
  const handleCencel = () => {
    dispatch(userLogin.cencelPopUp());
    setShow("");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    token && history.push("/dashboard");
  }, [isLogin]);
  return (
    <>
      <div>
        <div className="row no-gutters mb-none">
          <Logo />
          <div className=" col-sm-12 col-lg-8 col-md-8 ">
            <div className="content-wrap">
              <div className="container">
                <div className="content-inner">
                  <h1>Welcome to Streambed Magnify</h1>
                  <form onSubmit={handleSignIn}>
                    <InputFeild
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      type="email"
                      handleChange={handleChange}
                    />
                    <InputFeild
                      className="form-control"
                      placeholder="Password"
                      name="password"
                      type="password"
                      handleChange={handleChange}
                    />
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input input-box"
                        id="exampleCheck1"
                      />
                      <label className="form-check-label" for="exampleCheck1">
                        Remember me
                      </label>
                    </div>
                    <Button
                      name="Sign in"
                      type="submit"
                      className="form-btn sign-btn"
                      // handleClick={handleSignIn}
                    />
                  </form>
                  {show && (
                    <ErrorPopUp message={show} handleCencel={handleCencel} />
                  )}
                  {loginError && (
                    <ErrorPopUp
                      message={loginError}
                      handleCencel={handleCencel}
                    />
                  )}
                  <a
                    className="forgot"
                    onClick={() => history.push("/forget-password")}
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="sign-up">
                  <span className="main-title">Don’t have an account?</span>
                  <Button
                    name="Sign up"
                    className="form-btn"
                    handleClick={handleSignUp}
                  />
                </div>
                <div className="sign-up">
                  <span className="main-title">What is Streambed Magnify?</span>
                  <Button name="Learn More" className="form-btn" />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
