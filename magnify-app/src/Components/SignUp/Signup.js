import React, { useState, useEffect } from "react";
import Logo from "../../Containers/Logo";
import Label from "../../Containers/Label";
import "../../Containers/index.css";
import InputFeild from "../../Containers/InputFeild";
import Button from "../../Containers/Button";
import Footer from "../../Containers/Footer";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/signup/actions";
import Congratulation from "../../Containers/Congratulation";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import ErrorPopUp from "../../Containers/ErrorPopUp";
import { select } from "./SelectDropdown";
const Signup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const SignupState = useSelector((state) => state.Users);
  var {
    Error,
    companyExist,
    companyAdd,
    companyFalse,
    AddCompany,
    company,
  } = SignupState;
  const [error, setError] = useState(false);
  const [congratu, setCongratu] = useState(false);
  const [selector, showSelector] = useState(false);
  const [fields, setFeilds] = useState(false);
  const [EmptyfieldsError, setEmptyfieldsError] = useState("");
  const [check, setCheck] = useState(false);
  const [validpass, setValidpass] = useState("");
  const [companyName, setCompanyName] = useState(false);
  const [users, setUsers] = useState({
    first_name: "",
    last_name: "",
    corporate_email: "",
    renter_email: "",
    password: "",
    renter_password: "",
    checked: false,
    checkedPolicy: false,
  });
  const [companyfeilds, setCompanyfeilds] = useState({
    company_name: "",
    industry: "",
    company_address: "",
    company_img: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
    PreviewImg: "",
  });
  const select = [
    {
      name: "Aerospace",
    },
    {
      name: "Agriculture",
    },
    {
      name: "Chemical",
    },
    {
      name: "Computer",
    },
    {
      name: "Construction",
    },
    {
      name: "Defence",
    },
    {
      name: "Energy",
    },
  ];
  const handleback = () => {
    setCompanyfeilds({
      industry: "",
      company_address: "",
      company_img: "",
      city: "",
      province: "",
      country: "",
      postal_code: "",
      PreviewImg: "",
    });
    dispatch(userActions.backUrl(false));
    history.push("/");
  };
  useEffect(() => {
    setShow(false);
  }, []);
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const handleChange = (e) => {
    setUsers({ ...users, [e.target.name]: e.target.value });
  };
  const handleChangeCompany = (e) => {
    setCompanyfeilds({ ...companyfeilds, [e.target.name]: e.target.value });
  };
  const handleErrorCencel = () => {
    setError(false);
    setUsers({
      ...users,
      renter_password: "",
      password: "",
    });
  };
  const handleSelectChange = (name) => {
    setCompanyfeilds({
      ...companyfeilds,
      industry: name,
    });
    showSelector(false);
  };
  const handleSelector = () => {
    showSelector(!selector);
  };
  useEffect(() => {
    if (companyExist) {
      setShow(false);
    } else if (AddCompany) {
      setShow(true);
      setFeilds(false);
    }
  }, [companyExist, AddCompany]);

  const handleShow = async () => {
    if (
      companyfeilds.company_name &&
      companyfeilds.company_address &&
      companyfeilds.industry &&
      companyfeilds.city &&
      companyfeilds.province &&
      companyfeilds.country &&
      companyfeilds.postal_code &&
      companyfeilds.company_img
    ) {
      setFeilds(false);
      await dispatch(userActions.AddCompany(companyfeilds));
    } else {
      setFeilds(true);
    }
  };
  const handlSubmit = (e) => {
    e.preventDefault();
    const validEmail = validateEmail(users.corporate_email);
    if (
      users.first_name === "" &&
      users.last_name === "" &&
      users.corporate_email === "" &&
      users.renter_email === "" &&
      users.password === "" &&
      users.renter_password === "" &&
      users.checked == false &&
      users.checkedPolicy == false
    ) {
      setFeilds(true);
      setEmptyfieldsError("All feilds are mandatory");
    } else if (
      users.first_name &&
      users.last_name &&
      users.corporate_email &&
      users.renter_email &&
      users.password &&
      users.renter_password
    ) {
      if (users.corporate_email && !validEmail) {
        setEmptyfieldsError("");
        dispatch(userActions.validateEmail("Email is not valid"));
      } else if (users.corporate_email != users.renter_email) {
        setEmptyfieldsError("");
        dispatch(
          userActions.validateEmail("Email and Re-enter email is not match")
        );
      } else if (users.password !== users.renter_password) {
        setEmptyfieldsError("");
        setError(true);
        setCheck(false);
      } else if (users.password.length < 8) {
        setEmptyfieldsError("");
        setValidpass("Please Enter Password More Then 8 Charecter");
      } else if (users.checked === false) {
        setEmptyfieldsError("Please Check the Terms of Services");
        setFeilds(true);
      } else if (users.checkedPolicy === false) {
        setEmptyfieldsError("Please Check the Privacy Policy");
        setFeilds(true);
      } else {
        setFeilds(false);
        setEmptyfieldsError("");
        dispatch(userActions.SignUpFunction(users, company._id));
      }
    } else {
      setEmptyfieldsError("All feilds are mandatory");
      setFeilds(true);
    }
  };

  useEffect(() => {
    if (SignupState.Signup === true) {
      setCongratu(true);
    }
  }, [SignupState]);
  useEffect(() => {
    if (users.password != users.renter_password) {
      setError(true);
      setCheck(false);
    } else if (users.password.length) {
      setCheck(true);
      setError(false);
    }
  }, [users.renter_password, users.password]);
  const handleChecked = () => {
    setUsers({
      ...users,
      checked: !users.checked,
    });
  };
  const handleCheckedPolicy = () => {
    setUsers({
      ...users,
      checkedPolicy: !users.checkedPolicy,
    });
  };
  const handleCencelError = () => {
    dispatch(userActions.ErrorFunction());
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyfeilds({
        ...companyfeilds,
        company_img: file,
        PreviewImg: URL.createObjectURL(file),
      });
    }
  };
  return (
    <>
      <div className="row no-gutters mb-none">
        <Logo />
        <div className="col-12 col-lg-8 col-md-8  sign-up-section">
          <div className="signup-wrap">
            <div className="container">
              <h1 className="main-title">Sign Up</h1>
              {congratu ? (
                <Congratulation />
              ) : !show ? (
                <div className="content-inner">
                  <h2>Step 1 — Company Profile</h2>
                  <p>
                    Create a corporate profile for your business to create
                    campaigns that will allow you to pay content creators for
                    their analytics.
                  </p>
                  <div>
                    <form>
                      <InputFeild
                        labelname="Company Name"
                        className="form-control"
                        placeholder="Company Name"
                        name="company_name"
                        type="email"
                        handleChange={handleChangeCompany}
                      />
                      <div className="selecter">
                        <Label labelname="Industry" />
                        <div
                          className={
                            selector ? "select-text show" : "select-text"
                          }
                          onClick={handleSelector}
                        >
                          <span>
                            {companyfeilds.industry
                              ? companyfeilds.industry
                              : "Select industry"}
                          </span>
                          {selector ? (
                            <ul className="dropdown-inner">
                              {select.map((item, i) => (
                                <li
                                  key={i}
                                  onClick={() => handleSelectChange(item.name)}
                                >
                                  {item.name}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>

                      <InputFeild
                        labelname="Company Address"
                        className="form-control"
                        placeholder="Company Address"
                        name="company_address"
                        type="text"
                        handleChange={handleChangeCompany}
                      />
                      <div className="row">
                        <div className="col-lg-6">
                          <InputFeild
                            labelname="City"
                            className="form-control"
                            placeholder="City"
                            name="city"
                            type="text"
                            handleChange={handleChangeCompany}
                          />
                        </div>
                        <div className="col-lg-6">
                          <InputFeild
                            labelname="State / Province"
                            className="form-control"
                            placeholder="Province"
                            name="province"
                            type="text"
                            handleChange={handleChangeCompany}
                          />
                        </div>
                        <div className="col-lg-6">
                          <InputFeild
                            labelname="Country"
                            className="form-control"
                            placeholder="Country"
                            name="country"
                            type="text"
                            handleChange={handleChangeCompany}
                          />
                        </div>
                        <div className="col-lg-6">
                          <InputFeild
                            labelname="ZIP / Postal Code"
                            className="form-control"
                            placeholder="Postal Code"
                            name="postal_code"
                            type="text"
                            handleChange={handleChangeCompany}
                          />
                        </div>
                      </div>
                    </form>

                    <div className="upload-image">
                      <label className="form-label" for="customFile">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="customFile"
                        accept="image/x-png,image/jpeg"
                        onChange={handleFileChange}
                      />
                    </div>
                    {companyfeilds.PreviewImg && (
                      <div className="upload-img">
                        {/* <i
                          class="fas fa-times-circle checkIcon cross-icon"
                          onClick={removePreviewImage}
                        ></i> */}
                        <img src={companyfeilds.PreviewImg} />
                      </div>
                    )}
                  </div>

                  {companyAdd && (
                    <ErrorPopUp
                      message={companyExist}
                      handleCencel={handleCencelError}
                    />
                  )}
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
                      {fields && <span>All fields are mandatory.</span>}
                      <Button
                        name="Next"
                        className="form-btn"
                        nextArrow="yes"
                        handleClick={handleShow}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="content-inner">
                  <h2>Step 2 — Create Admin User</h2>
                  <p>
                    Create a user profile for the Admin role of the company
                    profile. You can edit the admin user or add more users with
                    different sets of permissions later in the Settings section.
                  </p>
                  <div className="form">
                    <InputFeild
                      labelname="First Name"
                      className="form-control"
                      placeholder="First Name"
                      name="first_name"
                      type="text"
                      handleChange={handleChange}
                    />
                    <InputFeild
                      labelname="Last Name"
                      className="form-control"
                      placeholder="Last Name"
                      name="last_name"
                      type="text"
                      handleChange={handleChange}
                    />
                    <InputFeild
                      labelname="Corporate email"
                      className="form-control"
                      placeholder="example@email.com"
                      name="corporate_email"
                      type="text"
                      handleChange={handleChange}
                    />
                    <InputFeild
                      labelname="Re-enter email"
                      className="form-control"
                      placeholder="example@email.com"
                      name="renter_email"
                      type="email"
                      handleChange={handleChange}
                    />
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
                        labelname="password"
                        className="form-control"
                        placeholder="••••••••"
                        name="password"
                        value={users.password}
                        type="password"
                        fa-chevron-right
                        handleChange={handleChange}
                      />
                    </div>
                    {EmptyfieldsError && (
                      <ErrorPopUp
                        message={EmptyfieldsError}
                        handleCencel={() => setEmptyfieldsError("")}
                      />
                    )}
                    <div className="input-password not-match">
                      <div className="input-label input-cross">
                        {error ? (
                          <>
                            <span>
                              Passwords do not match. Please try again.
                            </span>
                            <ul className="cross-icon">
                              <li className="cross">
                                <FontAwesomeIcon
                                  icon={faTimesCircle}
                                  onClick={handleErrorCencel}
                                />
                              </li>
                            </ul>
                          </>
                        ) : null}
                        {check === true && (
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
                        labelname="Re-enter password"
                        className="form-control"
                        placeholder="••••••••"
                        name="renter_password"
                        value={users.renter_password}
                        type="password"
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="checkbox creat-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input input-box"
                        id="exampleCheck1"
                        onChange={handleChecked}
                      />
                      <label className="form-check-label " for="exampleCheck1">
                        I agree to Streambed’s{" "}
                        <a href="https://streambedmedia.com/terms">
                          Terms of Service
                        </a>{" "}
                      </label>
                    </div>
                    <div className="checkbox creat-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input input-box"
                        id="exampleCheck2"
                        onChange={handleCheckedPolicy}
                      />
                      <label className="form-check-label " for="exampleCheck2">
                        I agree to Streambed’s{" "}
                        <a href="https://streambedmedia.com/privacy">
                          Privacy Policy.
                        </a>
                      </label>
                    </div>
                  </div>

                  <div className="form-footer profile-footer">
                    <div className="cancel-btn">
                      <Button
                        name="Cancel"
                        className="form-btn"
                        nextArrow="yes"
                        handleClick={handleback}
                      />
                    </div>
                    <div className="next-btn">
                      {fields && <span>All fields are mandatory.</span>}
                      <Button
                        name="Next"
                        className="form-btn"
                        handleClick={handlSubmit}
                        nextArrow="yes"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {Error && (
            <ErrorPopUp message={Error} handleCencel={handleCencelError} />
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
export default Signup;
