import React, { useEffect, useState } from "react";
import MainContent from "../shared/MainContent";
import PageTitle from "../shared/PageTitle";
import axios from "axios";
//components//
import SettingsSideBar from "../shared/SettingsSideBar";
import AssociatedEmail from "./AssociatedEmail";
import Password from "./Password";
import BackupAccount from "./BackupAccount";
import Deactivate from "./Deactivate";
import { useDispatch, useSelector } from "react-redux";
import { AdditionalEmails } from "../../../actions/index.js";

export default function Settings({ className, selected }) {
  const state = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { AddEmails } = state;
  const [user, setUser] = useState([]);
  // const [addEmail, setAddEmail] = useState(false);
  const [userEmails, setUserEmails] = useState([]);
  const [showContent, setShowContent] = useState("");
  const [memberSince, setmemberSince] = useState("");
  const addEmail = false;
  // const memberSince = useMemo(
  //   () => (user ? new Date(user.memberSince) : null),
  //   []
  // );
  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;
        setmemberSince(user.memberSince);
        setUser(user);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  const getUserEmails = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/other-emails", { headers: { Authorization: token } })
      .then(function (response) {
        dispatch(AdditionalEmails(response.data));
        setUserEmails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const ActiveButton = (active) => {
    setShowContent(active);
    // setActiveButton(!activeButton);
  };
  useEffect(() => {
    getUser();
    getUserEmails();
    // eslint-disable-next-line
  }, [AddEmails]);
  return (
    <div className="flex w-full">
      <MainContent>
        <PageTitle>Settings</PageTitle>
        <AssociatedEmail
          className={className}
          selected={selected}
          LittleHeading={LittleHeading}
          userEmails={userEmails}
          ActiveButton={ActiveButton}
          showContent={showContent}
        />
        <Password
          className={className}
          selected={selected}
          LittleHeading={LittleHeading}
          showContent={showContent}
          ActiveButton={ActiveButton}
        />
        <BackupAccount
          className={className}
          selected={selected}
          LittleHeading={LittleHeading}
          ActiveButton={ActiveButton}
          showContent={showContent}
        />
        <Deactivate
          className={className}
          selected={selected}
          LittleHeading={LittleHeading}
          ActiveButton={ActiveButton}
          showContent={showContent}
        />
      </MainContent>
      <div className="hidden md:block md:w-2/5 lg:w-4/12 ">
        <SettingsSideBar
          user={user || {}}
          addEmail={addEmail}
          showContent={showContent}
          memberSince={memberSince || new Date()}
        />
      </div>
    </div>
  );
}
const LittleHeading = ({ children }) => (
  <h6 className="text-xs text-primary font-semibold">{children}</h6>
);
