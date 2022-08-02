import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useDispatch } from "react-redux";
import { setCollaborator } from "../../actions/index";
import { useHistory } from "react-router-dom";
import axios from "axios";
import TwitterOverView from "./TwitterOverView";

function Collaborator(props) {
  const history = useHistory();
  try {
    if (!props.location.state?.twitter) {
      history.push("/");
    }
  } catch (error) {}

  if (props.location.state) {
    var { tweet } = props?.location?.state;
  }
  const [dropdownOpen, setOpen] = useState(false);
  const dispatch = useDispatch();

  // const [uploading, setUploading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState("");
  const [twitterPost, setTwitterPost] = useState({
    success: false,
    handle: "",
    post: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });
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
  const [txid, setTxid] = useState("");

  const toggle = (event, i) => {
    const list = [...collaboratorList];
    list[i].dropdownOpen = !list[i].dropdownOpen;
    setOpen(!dropdownOpen);
  };
  const changeValue = (e, i) => {
    const list = [...collaboratorList];
    list[i].role = e.currentTarget.textContent;
  };

  const finishHandler = async () => {
    const index = collaboratorList.length - 1;
    let valid = false;
    if (collaboratorList[index].user.length > 1) {
      valid = await verifyCollaborator();
      if (!valid) {
        return;
      }
    }
    dispatch(setCollaborator(videoCollaborators));

    // TODO upload to twitter here
    addCollborator();
  };

  const twitterFloBlockChain = (b_obj, id_str) => {
    axios({
      method: "post",
      url: "/api/twitter/twitter-flo-blockchain",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        b_obj: b_obj,
        p_id: id_str,
        userAddress: JSON.parse(localStorage.getItem("userAddress")),
      },
    }).then((res) => {
      setTxid(res.data.txid);
    });
  };

  const addCollborator = async () => {
    if (!tweet) {
      return history.push("/");
    }
    axios({
      method: "post",
      url: "/api/twitter/add-collaborator",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        collaborator: videoCollaborators,
        t_id: tweet.id,
        t_str_id: tweet.id_str,
      },
    }).then((res) => {
      const { tweet } = res.data;

      // data for blockchain
      const b_obj = {};

      b_obj.title = tweet.post;
      b_obj.url = `https://twitter.com/${tweet.handle}/status/${tweet.id_str}`;
      b_obj.displayName = tweet.name;
      b_obj.id = tweet.id_str;
      b_obj.fileName = "";
      sessionStorage.setItem("p_id", tweet.id_str);
      // walletData(b_obj);

      twitterFloBlockChain(b_obj, tweet.id_str);

      setTwitterPost({
        success: true,
        handle: tweet.handle,
        post: tweet.post,
      });
    });
  };

  const verifyCollaborator = async () => {
    // validate Email
    //eslint-disable-next-line
    const validEmailRegex = RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    var coll_exist = false;
    const index = collaboratorList.length - 1;

    // step 1
    // check if name entered is less than three char
    // if less than three char return
    if (collaboratorList[index].user.length < 3) {
      setErrors({
        ...errors,
        name: "Name cannnot be less than three characters",
        email: "",
      });
      setShowAlertMessage("Name cannnot be less than three characterscc");
      setShowAlert(true);
      return;
    }

    // step 2
    // check if user exist's

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
          coll_exist = true;
        } else {
          coll_exist = false;
          return false;
        }
      })
      .catch((error) => {
        console.log("something went wrong /api/verify-collaborator");
      });

    var valid = true;

    if (!coll_exist) {
      if (collaboratorList[index].email.length > 3) {
        if (!validEmailRegex.test(collaboratorList[index].email)) {
          setErrors({
            ...errors,
            name: "",
            email: "Not a valid Email",
          });

          valid = false;
          return false;
        } else {
          valid = true;
          // return true;
        }
      } else {
        setShowAlertMessage(
          "User dont have an account with us, please provide an email to send a verification email to collaborator!"
        );
        setShowAlert(true);
        valid = false;

        return false;
      }
    }

    // validate user name

    if (!valid) {
      setShowAlertMessage(
        "User dont have an account with us, please provide an email to send a verification email to collaborator!"
      );
      setShowAlert(true);
      return;
    }
    setErrors({ name: "", email: "" });
    var found = false;

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
    // const index = list.length - 1;

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
  // walletData(data);

  const handleInputChange = (event, index) => {
    const { value } = event.target;

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
    // console.log("End", list);
  };

  const backHandler = () => {
    // TODO! go to back screen
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

  // const loaderPopup = () => {
  //   return (
  //     <div className="loader-modal">
  //       <div className="loader-modal-wrap">
  //         <div className="loader">
  //           <img
  //             alt="loader"
  //             src={require("../../assets/images/videoUpload-loader.svg")}
  //           />{" "}
  //         </div>
  //         Uploading to twitter...
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="upload-wrap collaborators-new">
      <div className="upload-platforms">
        {twitterPost.success ? (
          <TwitterOverView
            p_id={tweet.id_str}
            collaborator={videoCollaborators}
            handle={twitterPost.handle}
            title={twitterPost.post}
            txid={txid}
          />
        ) : (
          <div className="collaborators-content">
            <div className="collaborators-inner">
              <h4>
                Enter the Name, username/email and the roles of your
                collaborators
              </h4>
              <p>
                If they don’t already have an account with us, they will be sent
                a notification to verify their role. You will automatically be
                designated as the “Publisher” so there’s no need to include
                yourself in this list.
              </p>
            </div>

            {/* {uploading ? loaderPopup() : null} */}
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
              <div onClick={handleRemove} className="add-more remove-more mb-5">
                Remove last collaborator
              </div>
            ) : null}
            <div className="row">
              <div className="col-6">
                <button
                  onClick={backHandler}
                  className="btn btn-primary ml-auto"
                >
                  Back
                </button>
              </div>
              <div className="col-6">
                <button onClick={finishHandler} className="btn btn-primary">
                  FINISH
                </button>
              </div>
            </div>
          </div>
        )}

        {showAlert ? (
          <div className="required-popup">
            <div className="popup_inner">
              <h5>Error</h5>
              <div className="p-content">
                <p>{showAlertMessage}</p>
              </div>
              <div className="required-content">
                <button
                  onClick={() => {
                    setShowAlert(false);
                  }}
                  className="btn btn-primary"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Collaborator;
