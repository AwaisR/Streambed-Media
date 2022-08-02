import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import FinderIcon from "../../components/icons/FinderIcon";
import TagIcon from "../../components/icons/TagIcon";
import BigAnalyticsIcon from "../../components/icons/BigAnalyticsIcon";
import UploadIcon from "../../components/icons/UploadIcon";
import DashboardIcon from "../../components/icons/OverviewIcon";

import { Card, CardContent } from "../../components/layouts/Card";
import MainContent from "./shared/MainContent";

import { addUser } from "../../actions/index";

const Landing = () => {
  const dispatch = useDispatch();
  const _user = useSelector((state) => state.user.user);

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

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  return (
    <MainContent center className="min-h-screen flex flex-col justify-between">
      <div className="w-full lg:w-9/12 2 my-4 mx-auto h-full flex flex-col justify-center">
        <Card className="bg-white px-3 py-3">
          <CardContent>
            <div className="text-center">
              <p className="text-base">Hello {_user?.displayName},</p>
              <h2 className="text-2xl">Welcome to Streambed!</h2>
              <p className="text-sm">All you need to know to get started.</p>
            </div>

            <div className="mt-4 mb-2 grid gap-6 justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white">
                <CardContent className="text-center">
                  <div className="py-4">
                    <FinderIcon className="mx-auto w-10 h-10 text-primary" />
                    <h5 className="text-primary text-sm font-semibold mt-2">
                      The Stream Pages
                    </h5>
                    <p className="text-xs mt-3">
                      Timestamp it, own it, it’s yours! Every post you make gets
                      catalogued for all the public to see!
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="text-center">
                  <div className="py-4">
                    <TagIcon className="mx-auto w-10 h-10 text-primary" />
                    <h5 className="text-primary text-sm font-semibold mt-2">
                      Tagging Your Buds
                    </h5>
                    <p className="text-xs mt-3">
                      Publishing takes minions sometimes. We let you tag them so
                      they will forever get the credit of helping you out!
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="text-center">
                  <div className="py-4">
                    <BigAnalyticsIcon className="mx-auto w-10 h-10 text-primary" />
                    <h5 className="text-primary text-sm font-semibold mt-2">
                      We've got your analytics!
                    </h5>
                    <p className="text-xs mt-3">
                      Tracking data of all your posts is what we’re made for!
                      Get all those numbers to prove your social media
                      footprint.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-white px-3 py-3">
          <CardContent className="text-center">
            <p className="text-base">Ready to just jump in?</p>
            <div className="mt-4 mx-auto max-w-lg grid gap-6 grid-cols-2">
              <Link to="/video-upload">
                <Card className="bg-white cursor-pointer border border-primary">
                  <CardContent className="text-center py-4">
                    <UploadIcon className="mx-auto w-10 h-10 text-primary" />
                    <p className="text-sm mt-2">Upload</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/overview">
                <Card className="bg-white cursor-pointer border border-primary">
                  <CardContent className="text-center py-4">
                    <DashboardIcon className="mx-auto mt-1 w-7 h-7 text-primary" />
                    <p className="text-sm mt-3">Dashboard</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <p className="mt-3 text-xs">Haven't linked your accounts yet?</p>
            <p>
              <Link to="/settings/link" className="text-xs hover:text-primary">
                Link them here.
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-11/12 lg:mx-auto mt-6 mb-3 text-center flex flex-col space-y-2 lg:justify-start lg:items-end lg:space-y-0 lg:flex-row lg:justify-between text-copy text-xs lg:justify-self-end">
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
    </MainContent>
  );
};

export default Landing;
