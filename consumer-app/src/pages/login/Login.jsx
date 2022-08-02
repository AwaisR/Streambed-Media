import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Card, CardContent } from "../../components/layouts/Card";
import Input from "../../components/forms/Input";
import Checkbox from "../../components/forms/Checkbox";
import Button from "../../components/common/Button";
import LogoSidebar from "./LogoSidebar";
import Alert from "../../components/shared/Alert";

import { socket } from "../../components/helpers/socket";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  //State for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  // check if the user is verified
  const [verifed, setVerified] = useState(false);

  let token = localStorage.getItem("token");
  if (token === "null" || token == null || token === "undefined" || !token) {
    // history.push("/");
    // return;
  }
  if (token) {
    history.push("/home");
  }

  //Login and send back mnemonic, decrpyt it and set to local storage
  //Local storage is used with publishing videos
  const onLogin = async () => {
    try {
      const response = await fetch("users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.msg);
        window.localStorage.removeItem("token");
        if (data.activated === false) {
          // setVerified(true);
        }
        return;
      } else {
        window.localStorage.setItem("token", JSON.stringify(data.token));
        dispatch({ type: "LOGIN", payload: true });
        socket.emit("login");
        history.push("/home");
      }

      const { mnemonic } = data;

      // handle error response
      const createWalletData = await fetch("users/createWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mnemonic: mnemonic,
          password,
        }),
      });

      const wifJson = await createWalletData.json();

      localStorage.setItem("userAddress", JSON.stringify(wifJson.wif));
    } catch {
      console.log("onLogin error");
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  const setAlert = () => {
    setVerified(false);
  };

  return (
    <div className="flex">
      <LogoSidebar />
      <div className="w-full text-copy min-h-screen py-6 flex flex-col justify-between">
        <div className="w-full h-full flex flex-col justify-center items-center px-6 py-3">
          <Card className="w-full max-w-lg mx-auto">
            <CardContent>
              <div className="py-4">
                <h2 className="text-center text-xl font-semibold">
                  Welcome to Streambed!
                </h2>
                <div className="w-11/12 mx-auto mt-5">
                  <form action="" method="POST" onSubmit={onFormSubmit}>
                    <div className="mb-2">
                      <Input
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => {
                          setEmail(e.target.value.trim());
                        }}
                      />
                    </div>
                    <div className="mb-6">
                      <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                          setPassword(e.target.value.trim());
                        }}
                      />
                    </div>
                    <div className="mb-2 text-center">
                      <Checkbox
                        label="Remember me"
                        labelClassName="text-xs text-copy"
                        className="w-3 h-3"
                        id="rememberMe"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={() => {
                          setRememberMe(!rememberMe);
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      {error.length > 0 ? (
                        <Alert
                          content={error}
                          setAlert={() => {
                            setError("");
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="mb-4">
                      <Button
                        type="submit"
                        theme="primary"
                        className="w-52 block mx-auto"
                      >
                        Sign In
                      </Button>
                    </div>
                    <div className="text-center">
                      <Link
                        className="text-xs hover:text-gray-800"
                        to="/forget-password"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4 text-center text-copy">
            <div>
              <p className="text-xs mb-1">Don’t have an account?</p>
              <Link className="" to="/signup">
                <Button theme="active" className="w-44">
                  Sign Up
                </Button>
              </Link>
            </div>

            <div>
              <p className="text-xs mb-1">Want to recover a deleted account?</p>
              <Link className="" to="/forget-password">
                <Button theme="active" className="w-44">
                  Recover account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-11/12 mx-auto mt-16 mb-3 text-center flex flex-col space-y-2 justify-start items-end lg:space-y-0 lg:flex-row lg:justify-between text-copy text-xs justify-self-end">
          <p>
            Need Help? Contact{" "}
            <Link to="mailto:support@streambedmedia.com">
              support@streambedmedia.com
            </Link>
          </p>
          <div className="lg:text-right">
            <div>
              <a href="https://streambedmedia.com/terms">Terms of Service</a> |{" "}
              <a href="https://streambedmedia.com/privacy">Privacy Policy</a>
            </div>
            <span>
              &copy; All Rights Reserved, Streambed Media Inc{" "}
              {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* <!-- LogIn Popup --> */}
      {verifed ? (
        <div className="login-alert">
          <Alert
            show={verifed}
            content=" It looks like you haven’t verified your email address yet, please check
        your inbox."
            setAlert={setAlert}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Login;
