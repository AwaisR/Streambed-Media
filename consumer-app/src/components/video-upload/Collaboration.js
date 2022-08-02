import React, { useState, useEffect } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useDispatch } from "react-redux";
import {
  setCollaborator,
  setVideoStep,
  setUplaodProgress,
  setYoutubeData,
  setTwitterData,
  setTransactionId,
} from "../../actions/index";

import { useHistory } from "react-router-dom";
import Alert from "../shared/Alert";
import axios from "axios";

function Collaboration() {
  const history = useHistory();
  const [dropdownOpen, setOpen] = useState(false);
  const [dropdownOpenCo, setOpenCo] = useState(false);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState("");
  const [hanldeDropDown, sethanldeDropDown] = useState([]);
  const [txid, setTxid] = useState("");
  const [showComp, setShowComp] = useState(false);
  // let CheckVideo = sessionStorage.getItem("magnifyVideo");
  // console.log("CheckVideo", CheckVideo);

  const [company, setCompany] = useState({
    company_id: "",
    company_name: "",
  });
  useEffect(() => {
    const checked = sessionStorage.getItem("magnifyVideo");
    if (checked) {
      setShowComp(checked);
    }
  }, []);
  const SelectCompany = (id, name) => {
    setCompany({
      company_id: id,
      company_name: name,
    });
  };
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });
  useEffect(() => {
    axios
      .get("/company/get-allcompanies", {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          sethanldeDropDown(res.data.data);
        } else {
          console.log("else response", res);
        }
      });
  }, []);
  const [collaboratorList, setCollaboratorList] = useState([
    {
      user: "",
      email: "",
      role: "Co-Creator",
      dropdownOpen: false,
      disable: false,
    },
  ]);

  const [videoCollaborators, setVideoCollaborators] = useState([]);
  const [uploadYoutube, setuploadYoutube] = useState(false);
  const toggle = (event, i) => {
    const list = [...collaboratorList];
    list[i].dropdownOpen = !list[i].dropdownOpen;
    setOpen(!dropdownOpen);
  };
  const changeValue = (e, i) => {
    const list = [...collaboratorList];
    list[i].role = e.currentTarget.textContent;
  };
  const companyDropdwon = () => setOpenCo(!dropdownOpenCo);
  const finishHandler = async () => {
    const index = collaboratorList.length - 1;
    let valid = false;
    if (collaboratorList[index].user.length > 1) {
      setuploadYoutube(false);
      valid = await verifyCollaborator();
      if (!valid) {
        return;
      }
    }
    dispatch(setCollaborator(videoCollaborators));

    if (!valid) {
      uploadToYoutube();
    } else {
      setuploadYoutube(true);
    }
  };
  const handleRemoveData = () => {
    axios({
      method: "delete",
      url: "/api/video-failed",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: { vid: sessionStorage.getItem("vid") },
    }).then((res) => {
      console.log("response", res.data.msg);
    });
  };
  useEffect(() => {
    if (uploadYoutube) {
      uploadToYoutube();
      setuploadYoutube(false);
    }
  }, [videoCollaborators, uploadYoutube]);

  const sendWalletData = (b_obj, videoID) => {
    axios({
      method: "post",
      url: "/api/youtube-flo-blockchain",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        youTubeData: b_obj,
        p_id: videoID,
        userAddress: JSON.parse(localStorage.getItem("userAddress")),
      },
    }).then((res) => {
      setTxid(res.data.txid);
      dispatch(setTransactionId(res.data.txid));
    });
  };

  const handleResponseError = (errorString) => {
    if (errorString.includes("No access, refresh token")) {
      setShowAlertMessage(
        "Authorization failed, make sure you have linked youtube app or authrozed strembed app to manage youtube data"
      );
    } else if (errorString.includes("quota")) {
      setShowAlertMessage(
        "your quota for daily usage of youtube data API is reached for today, please try again tomorrow"
      );
    } else if (errorString.includes("invalid_grant")) {
      setShowAlertMessage(`It seems your youtube account is having issue, and we wont be able to upload your video at the moment. \n 
      Make sure your account is active `);
    }
    if (errorString.includes("No access, refresh token")) {
      sessionStorage.setItem("redirectLink", "/settings/link");
    } else if (errorString.includes("quota")) {
      sessionStorage.setItem("redirectLink", "/dashboard");
    }
    // handlerRedirect();
  };
  const handlerRedirect = () => {
    setShowAlert(false);
    setShowAlertMessage("");
    dispatch(setVideoStep(1));
    dispatch(setUplaodProgress(20));
    history.push("/video-upload");
    sessionStorage.removeItem("redirectLink");
    // handlerRedirect();
  };

  const verifyCollaborator = async () => {
    // validate Email
    /* eslint-disable */
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    var found = false;
    const index = collaboratorList.length - 1;
    // validate user name
    if (collaboratorList[index].user.length < 3) {
      setErrors({
        ...errors,
        name: "Name cannnot be less than three characters",
        email: "",
      });
      return;
    }
    if (collaboratorList[index].email > 3) {
      if (!validEmailRegex.test(collaboratorList[index].email)) {
        setErrors({
          ...errors,
          name: "",
          email: "Not a valid Email",
        });
        return;
      }
    }
    if (!validEmailRegex.test(collaboratorList[index].email)) {
      await axios
        .post(
          "/api/verify-collaborator",
          { collaborator: collaboratorList[index].user },
          {
            headers: {
              "content-type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            collaboratorList[index].email = res.data.email;
          } else {
            setErrors({ ...errors, email: "Not a valid Email", name: "" });
          }
        });

      if (!validEmailRegex.test(collaboratorList[index].email)) {
        setShowAlertMessage(
          "User dont have an account with us, please provide an email to send a verification email to collaborator!"
        );
        setShowAlert(true);

        return false;
      }
    }

    setErrors({ name: "", email: "" });

    collaboratorList.forEach(({ user, email }, i) => {
      if (
        i !== collaboratorList.length - 1 &&
        collaboratorList[index].user === user
      ) {
        setErrors({ name: "Collaborator Name already added", email: "" });

        found = true;
        return;
      } else if (
        i !== collaboratorList.length - 1 &&
        collaboratorList[index].email === email
      ) {
        setErrors({ name: "Collaborator Email already added", email: "" });

        found = true;
        return;
      }
    });

    if (found) return false;

    const list = [...collaboratorList];

    list[index].disable = true;
    const obj = {};
    obj.user = list[index].user;
    obj.email = list[index].email;
    obj.role = list[index].role;
    obj.sendMail = true;
    setVideoCollaborators([...videoCollaborators, obj]);
    dispatch(setCollaborator([...videoCollaborators, obj]));

    list.push({
      user: "",
      email: "",
      role: "Co-Creator",
      dropdownOpen: false,
      disable: false,
    });
    // add new text box only if previous record is verified
    setCollaboratorList(list);

    return true;
  };
  const uploadToYoutube = () => {
    setUploading(true);
    fetch("/api/upload-youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        videoCollaborators: videoCollaborators,
        company: company,
        private_video: showComp,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          setShowAlertMessage(
            "Authorization failed, make sure you have linked youtube app or authrozed strembed app to manage youtube data"
          );
          setShowAlert(true);
          handleRemoveData();
          handleResponseError(data.err);
        } else {
          setYoutubeData(data);
          // walletData(data);
          sendWalletData(data, data.id);
          sessionStorage.setItem("videoTitle", data.snippet.title);
          sessionStorage.setItem("videoid", data.id);
          dispatch(setVideoStep(5));
          dispatch(setUplaodProgress(100));
        }
      })
      .catch((err) => {
        dispatch(setVideoStep(1));
        dispatch(setUplaodProgress(0));
        console.log("Something went wrong", err);
      });
  };

  const uploadToTwitter = () => {
    fetch("/api/upload-twitter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          setShowAlertMessage(data.err);
          setShowAlert(true);
          sessionStorage.setItem("error", "true");
          handleResponseError(data.err);
        } else {
          setTwitterData(data);
          sessionStorage.setItem("videoTitle", data.contentDetails.title);
          dispatch(setVideoStep(5));
          dispatch(setUplaodProgress(100));
        }
      })
      .catch((err) => {
        dispatch(setVideoStep(1));
        dispatch(setUplaodProgress(0));
        console.log("Something went wrong", err);
      });
  };
  const handleInputChange = (event, index) => {
    const { value, name } = event.target;

    const list = [...collaboratorList];
    list[index].user = value;
    setCollaboratorList(list);
  };
  const handleEmailChange = (event, index) => {
    const { value, name } = event.target;

    const list = [...collaboratorList];
    list[index][name] = value;
    setCollaboratorList(list);
  };

  const addCollaborator = async () => {
    // if there is no input showing, just add on
    if (!collaboratorList.length) {
      setCollaboratorList([
        { user: "", email: "", role: "Co-Creator", dropdownOpen: false },
      ]);
      return;
    }
    const valid = await verifyCollaborator();
    if (!valid) {
      return;
    }

    // show input boxes to the user
    const list = [...collaboratorList];
    list.push({
      user: "",
      email: "",
      role: "Co-Creator",
      dropdownOpen: false,
      disable: false,
    });
    setCollaboratorList(list);
  };

  const backHandler = () => {
    dispatch(setVideoStep(3));
    dispatch(setUplaodProgress(30));
  };

  const handleRemove = () => {
    const coll = [...collaboratorList];
    const vcoll = [...videoCollaborators];
    const length = coll.length;
    if (length > 0) {
      if (coll[length - 1].user === "") {
        coll.splice(length - 1, 2);
      } else {
        coll.splice(length - 1, 1);
      }
    } else if (coll.length === 1) {
      coll.user = "";
      coll.role = "Co-Creator";
      coll.dropdownOpen = false;
      coll.disable = false;
    }

    if (vcoll.length === length) {
      vcoll.pop();
    }

    setVideoCollaborators(vcoll);
    setCollaboratorList(coll);
  };

  const renderCollaboratorInput = () => {
    return collaboratorList.map((obj, i) => {
      return (
        <div key={i} className="row">
          <div className="col-sm-4">
            <div className="input-div">
              <input
                name="name"
                disabled={obj.disable}
                value={obj.user}
                type="text"
                className="form-control mb-4"
                placeholder="Name"
                onChange={(e) => {
                  handleInputChange(e, i);
                }}
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="input-div">
              <input
                name="email"
                disabled={obj.disable}
                value={obj.email}
                type="text"
                className="form-control mb-4"
                placeholder="Email"
                onChange={(e) => {
                  handleEmailChange(e, i);
                }}
              />
            </div>
          </div>

          <div className="col-sm-4">
            <div className="custom-dropdown mb-4">
              <ButtonDropdown
                disabled={obj.disable}
                isOpen={obj.dropdownOpen}
                toggle={(e) => toggle(e, i)}
              >
                <DropdownToggle caret>{obj.role}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <div onClick={(e) => changeValue(e, i)}>Co-Creator</div>
                  </DropdownItem>
                  <DropdownItem>
                    {" "}
                    <div onClick={(e) => changeValue(e, i)}>Publisher</div>
                  </DropdownItem>
                  <DropdownItem>
                    {" "}
                    <div onClick={(e) => changeValue(e, i)}>Sponsor</div>
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>
        </div>
      );
    });
  };
  const { name, email } = errors;

  const loaderPopup = () => {
    return (
      <div className="loader-modal">
        <div className="loader-modal-wrap">
          <div className="loader">
            <img src={require("../../assets/images/videoUpload-loader.svg")} />{" "}
          </div>
          Uploading to youtube...
        </div>
      </div>
    );
  };

  return (
    <div className="collaborators-content">
      <h4>Enter the names, emails and the roles of your collaborators</h4>
      <p>
        If they don’t already have an account with us, they will be sent a
        notification to verify their role. You will automatically be designated
        as the “Publisher” so there’s no need to include yourself in this list.
      </p>

      {uploading ? loaderPopup() : null}
      {renderCollaboratorInput()}
      <ul className="collaborator-error">
        <li className="invalid-feedback">{name ? name : null}</li>
        <li className="invalid-feedback">{email ? email : null}</li>
      </ul>

      <div onClick={addCollaborator} className="add-more">
        {collaboratorList.length > 0
          ? "Add more collaborators"
          : "ADD COLLABORATOR"}
      </div>
      {collaboratorList.length > 0 ? (
        <div onClick={handleRemove} className="add-more remove-more mb-3">
          Remove last collaborator
        </div>
      ) : null}
      {showComp === "true" ? null : (
        <div class="row">
          <div class="col-sm-6 offset-3">
            <div className="custom-dropdown mb-4">
              <ButtonDropdown isOpen={dropdownOpenCo} toggle={companyDropdwon}>
                <DropdownToggle caret>
                  {company.company_name
                    ? company.company_name
                    : "Select Company (Optional)"}
                </DropdownToggle>
                <DropdownMenu>
                  {hanldeDropDown &&
                    hanldeDropDown.map((item) => (
                      <DropdownItem value={company.company_id}>
                        <div
                          onClick={(e) =>
                            SelectCompany(item._id, item.company_name)
                          }
                        >
                          {item.company_name}
                        </div>
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-6">
          <button onClick={backHandler} className="btn btn-primary ml-auto">
            Back
          </button>
        </div>
        <div className="col-6">
          <button onClick={finishHandler} className="btn btn-primary">
            FINISH
          </button>
        </div>
      </div>

      {showAlert ? (
        <Alert
          content={showAlertMessage}
          setAlert={(value) => {
            if (sessionStorage.getItem("redirectLink")) {
              handlerRedirect();
            }
            // dispatch(setVideoStep(1));
            // dispatch(setUplaodProgress(20));
            setShowAlert(false);
            setShowAlertMessage("");
          }}
        />
      ) : null}
    </div>
  );
}

export default Collaboration;
