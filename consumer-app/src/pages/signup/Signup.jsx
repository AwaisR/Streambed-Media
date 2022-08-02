import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { Card, CardContent } from "../../components/layouts/Card";
import Input from "../../components/forms/Input";
import Checkbox from "../../components/forms/Checkbox";
import Button from "../../components/common/Button";
import LogoSidebar from "./LogoSidebar";
import Alert from "../../components/shared/Alert";

import LogoIcon from "../../components/icons/LogoIcon";

const Signup = () => {
  const location = useHistory();

  /**************************STATE SECTION************************/
  //**Display Name States */
  const [username, setUsername] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  //**Password States */
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passErrorMessage, setPassErrorMessage] = useState("");

  //**Email States */
  const [email, setEmail] = useState("");
  const [reEmail, setReEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  // Terms and condition message display
  const [termsMessage, setTermsMessage] = useState("");

  const [reg_success, setRegSuccess] = useState(false);
  const [agree_terms, setAgreeTerms] = useState(false);

  const [processing, setProcessing] = useState(false);

  const validateForm = (e) => {
    if (email !== reEmail) {
      setEmailErrorMessage("Emails do not match!");
      setUsernameErrorMessage("");
    } else if (password !== rePassword) {
      setEmailErrorMessage("");
      setPassErrorMessage("Passwords do not match!");
    } else if (!agree_terms) {
      setTermsMessage("You must agree to Terms & Condition first");
    } else {
      setPassErrorMessage("");
      sendUser();
    }
  };

  const sendUser = () => {
    setProcessing(true);

    fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        console.log("message", message);
        if (message.error) {
          const { errors } = message.error;
          const { error } = message;
          if (error) {
            setUsernameErrorMessage(error);
          }
          if (errors.displayName) {
            setUsernameErrorMessage(errors.displayName.message);
          }
          if (errors.email) {
            setEmailErrorMessage(errors.email.message);
          }
          if (errors.password) {
            setPassErrorMessage(errors.password.message);
          }
        }
        if (message.success) {
          setUsernameErrorMessage("");
          setRegSuccess(true);
          setTimeout(() => {
            setRegSuccess(false);
            location.push("/");
          }, 4000);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    validateForm(e);
  };

  /*************The placeholders are fontawesome unicode, allows them to show in the placeholder field *****************/
  /*************Password fields get set to state to compare before submit*/
  return (
    <div className="flex">
      <LogoSidebar />
      <div className="w-full min-h-screen py-6 flex flex-col justify-between">
        <div className="w-full h-full flex flex-col justify-center items-center px-6 py-3">
          <Card className="w-full max-w-xl mx-auto">
            <CardContent className="py-5 mx-auto max-w-lg">
              <h2 className="text-center text-lg font-semibold text-primary">
                Unlock a world of collaborative creativity.
              </h2>
              <div className="w-11/12 mx-auto mt-5">
                <form action="" method="POST" onSubmit={onFormSubmit}>
                  <div className="mb-2">
                    <Input
                      name="username"
                      type="text"
                      placeholder="Username"
                      onChange={(e) => {
                        setUsername(e.target.value.trim());
                      }}
                      required
                    />
                  </div>
                  <div>
                    {usernameErrorMessage.length > 0 ? (
                      <Alert
                        content={usernameErrorMessage}
                        setAlert={() => {
                          setUsernameErrorMessage("");
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      onChange={(e) => {
                        setEmail(e.target.value.trim());
                      }}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      name="confirmEmail"
                      type="email"
                      placeholder="Confirm Email"
                      onChange={(e) => {
                        setReEmail(e.target.value.trim());
                      }}
                      required
                    />
                  </div>
                  <div>
                    {emailErrorMessage.length > 0 ? (
                      <Alert
                        content={emailErrorMessage}
                        setAlert={() => {
                          setEmailErrorMessage("");
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => {
                        setPassword(e.target.value.trim());
                      }}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => {
                        setRePassword(e.target.value.trim());
                      }}
                      required
                    />
                  </div>
                  <div>
                    {passErrorMessage.length > 0 ? (
                      <Alert
                        content={passErrorMessage}
                        setAlert={() => {
                          setPassErrorMessage("");
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="mb-2 text-center">
                    <div>
                      {termsMessage.length > 0 ? (
                        <Alert
                          content={termsMessage}
                          setAlert={() => {
                            // setAgreeTerms(!agree_terms);
                            setTermsMessage("");
                          }}
                        />
                      ) : null}
                    </div>
                    <Checkbox
                      label="I agree to Streambed Media's Terms & Conditions and Privacy Policy"
                      labelClassName="text-xs text-copy"
                      className="w-3 h-3"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={agree_terms}
                      onChange={() => {
                        setAgreeTerms(!agree_terms);
                      }}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <Button
                      type="submit"
                      theme="primary"
                      className="w-52 block mx-auto"
                    >
                      Sign Up
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4 text-center text-copy">
            <div>
              <p className="text-xs mb-1">Already have an account?</p>
              <Link className="" to="/login">
                <Button theme="active" className="w-44" disabled={processing}>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {reg_success ? (
          <div className="fixed z-50 w-screen h-screen top-0 left-0 flex items-center justify-center bg-gray-500 opacity-25">
            <Card className="bg-white max-w-xl mx-auto">
              <CardContent>
                <div>
                  <Link href="#">
                    <LogoIcon />
                  </Link>
                </div>
                <div className="mt-3">
                  <p>
                    Thank you for registering <span> {username}</span>!
                    <br />
                    An email has been sent to <br />
                    <span>{email}</span>
                  </p>
                  <p>Please verify your email address to continue.</p>
                  <p>
                    You will now be redirected to the
                    <Link href="#"> Login Page</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="w-11/12 mx-auto mt-16 mb-3 text-center flex flex-col space-y-2 justify-start items-end lg:space-y-0 lg:flex-row lg:justify-between text-copy text-xs justify-self-end">
          <p>
            Need Help? Contact{" "}
            <Link to="mailto:support@streambedmedia.com">
              support@streambedmedia.com
            </Link>
          </p>
          <p className="lg:text-right">
            <div>
              <a href="https://streambedmedia.com/terms">Terms of Service</a> |{" "}
              <a href="https://streambedmedia.com/privacy">Privacy Policy</a>
            </div>
            <span>
              &copy; All Rights Reserved, Streambed Media Inc{" "}
              {new Date().getFullYear()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
