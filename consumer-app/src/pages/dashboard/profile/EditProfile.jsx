import React, { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "../../../components/layouts/Card";
import PageTitle from "../shared/PageTitle";
import LittleHeading from "../shared/LittleHeading";

// icons
import BrowserIcon from "../../../components/icons/BrowserIcon";

import RoundedInput from "../../../components/forms/RoundedInput";
import Button from "../../../components/common/Button";
import Textarea from "../../../components/forms/Textarea";
import Profile from "./Profile";
import PasswordModal from "./PasswordModal";
import MyModal from "../../dashboard/profile/MsgDisplayModel";
import { addUser } from "../../.././actions/index";
import { useSelector, useDispatch } from "react-redux";
function EditScreen() {
  let dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [avatar, setAvatar] = useState(null);
  const [avatarObjectURL, setAvatarObjectURL] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [modelOpen, setModelOpen] = useState(true);

  const [update, setUpdate] = useState({
    displayName: "",
    about: "",
  });
  const [requestPassword, setRequestPassword] = useState(false);
  const [pendingAction, setPendingAction] = useState("");

  const handleFileSelect = async (files) => {
    if (!files.length) {
    } else {
      setAvatar(files[0]);
      setAvatarObjectURL(window.URL.createObjectURL(files[0]));
    }
  };

  const handleInputValueChange = (evt) => {
    evt.preventDefault();
    const { name, value } = evt.target;
    setUpdate({ ...update, [name]: value });
  };

  const initiateSaveSequence = (action) => {
    if (action === "displayName" && !update.displayName) return;

    setRequestPassword(true);
    setPendingAction(action);
  };

  const attemptSave = (password, cancelled) => {
    setRequestPassword(false);
    if (cancelled) return;

    callUpdateAction(pendingAction, password);
  };
  const callUpdateAction = (action, password) => {
    switch (action) {
      case "displayName":
        updateDisplayName(password);
        break;
      case "about":
        updateAbout(password);
        break;
      case "profileImage":
        updateProfileImage(password);
        break;
      default:
        break;
    }
  };
  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;

        dispatch(addUser(user));
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  const updateProfileImage = (password) => {
    if (avatar) {
      let formData = new FormData();
      formData.append("image", avatar);
      formData.append("currentPassword", password);
      axios({
        method: "put",
        url: "/users/editprofile",
        data: formData,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then(({ data }) => {
          // console.log("data", data);
          if (!data.success) {
            setModelOpen(true);
            setErrorMsg(data.msg);
          } else {
            console.log("data.msg", data.msg);
            setAvatar(null);
            setModelOpen(true);
            getUser();
            setErrorMsg(data.msg);
          }
        })
        .catch(function (error) {
          // handle error
          setErrorMsg("something went wrong");
          setModelOpen(true);
        });
    } else {
      setModelOpen(true);
      setErrorMsg("please Upload the profile picture");
    }
  };
  const updateDisplayName = (password) => {
    axios
      .put(
        "/users/editprofile",
        {
          name: update.displayName,
          currentPassword: password,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(({ data }) => {
        console.log("data", data);
        if (!data.success) {
          setModelOpen(true);
          setErrorMsg(data.msg);
        } else {
          setUpdate({
            ...update,
            displayName: "",
          });
          setModelOpen(true);
          getUser();
          setErrorMsg(data.msg);
        }
      })
      .catch(function (error) {
        // handle error
        setErrorMsg("User Name already exist");
        setModelOpen(true);
      });
  };

  const updateAbout = (password) => {
    axios
      .put(
        "/users/editprofile",
        {
          about: update.about,
          currentPassword: password,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(({ data }) => {
        if (!data.success) {
          setModelOpen(true);
          setErrorMsg(data.msg);
        } else {
          setUpdate({
            ...update,
            about: "",
          });
          setModelOpen(true);
          getUser();
          setErrorMsg(data.msg);
        }
      });
  };
  useEffect(() => {
    return () => {
      if (avatarObjectURL) {
        window.URL.revokeObjectURL(avatarObjectURL);
      }
    };
    // eslint-disable-next-line
  }, []);
  const closeModal = () => {
    setErrorMsg("");
    setModelOpen(false);
  };
  return (
    <>
      <PageTitle>Edit Personal Information</PageTitle>

      <div className="mt-6">
        <PasswordModal open={requestPassword} onClose={attemptSave} />
        {ErrorMsg && (
          <MyModal
            Title="Update profile"
            description={ErrorMsg}
            isOpen={modelOpen}
            closeModal={closeModal}
          />
        )}

        {/* <PasswordModal open={requestPassword} onClose={attemptSave} /> */}
        <Card className="bg-white">
          <CardContent>
            <h3 className="text-lg font-medium">Account Information</h3>

            <hr className="my-3" />

            <div className="flex flex-col space-y-2 justify-between lg:space-y-0 lg:flex-row lg:items-end">
              <div className="w-full lg:w-8/12">
                <LittleHeading>Current Display Name</LittleHeading>
                <p className="text-md lg:text-lg font-normal">
                  {user.displayName}
                </p>
                <div className="mt-2 w-full max-w-lg">
                  <RoundedInput
                    type="text"
                    name="displayName"
                    id="displayName"
                    value={update.displayName}
                    onChange={handleInputValueChange}
                  />
                </div>
              </div>
              <div>
                <Button onClick={() => initiateSaveSequence("displayName")}>
                  Save
                </Button>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex flex-col space-y-2 justify-between lg:space-y-0 lg:flex-row lg:items-end">
              <div className="w-full lg:w-8/12">
                <LittleHeading>Profile Photo</LittleHeading>
                <div className="flex">
                  <Card className="w-32 h-32 flex items-center justify-center">
                    <img
                      src={
                        avatarObjectURL
                          ? avatarObjectURL
                          : user.profileImage
                          ? process.env.REACT_APP_URL + user.profileImage
                          : ""
                      }
                      alt="Avatar"
                      className="block rounded-full w-28 h-28 object-cover"
                    />
                  </Card>
                  <label htmlFor="deviceMedia">
                    <input
                      id="deviceMedia"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      hidden
                    />
                    <Card className="mx-2 w-32 h-32">
                      <CardContent className="h-28 text-center flex flex-col items-center justify-center">
                        <div>
                          <BrowserIcon className="w-12 h-auto" />
                        </div>
                        <p className="mt-0 text-xs">Browse your device</p>
                      </CardContent>
                    </Card>
                  </label>
                </div>
              </div>
              <div>
                <Button onClick={() => initiateSaveSequence("profileImage")}>
                  Save
                </Button>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex flex-col space-y-2 justify-between lg:space-y-0 lg:flex-row lg:items-end">
              <div className="w-full lg:w-8/12">
                <LittleHeading>Current Description</LittleHeading>
                <p className="text-md lg:text-base font-normal">
                  {user.about || ""}
                </p>
                <div className="mt-2 w-full max-w-lg">
                  <Textarea
                    name="about"
                    rows="5"
                    value={update.about}
                    onChange={handleInputValueChange}
                  />
                </div>
              </div>
              <div>
                <Button onClick={() => initiateSaveSequence("about")}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function EditProfile() {
  return <Profile Screen={EditScreen} />;
}
