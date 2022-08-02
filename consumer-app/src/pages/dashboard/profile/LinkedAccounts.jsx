import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Card, CardContent } from "../../../components/layouts/Card";
import MainContent from "../shared/MainContent";
import PageTitle from "../shared/PageTitle";

import { PLATFORM_ICON_MAP } from "../../../components/helpers/platforms";
import runTheContent from "../../../components/helpers/GetToken";
import twitterApi from "../../../helpers/TwitterApi.js";
import Button from "../../../components/common/Button";
import LinkedAccountsSidebar from "./LinkedAccountsSidebar";

export default function LinkedAccounts() {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user.user);
  const memberSince = useMemo(() => new Date(user.memberSince), [
    user.memberSince,
  ]);

  const [linkAction, setLinkAction] = useState({ platform: "", action: "" });
  const [loading, setLoading] = useState(true);

  const [channelName, setChannelName] = useState("");
  const [zoomData, setZoom] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [linkedin, setLinkedin] = useState(null);
  const [twitter, setTwitterTokens] = useState(null);
  const [hasRT, setHasRT] = useState(false);
  const accounts = [
    {
      platform: "YouTube",
      username: channelName && channelName ? channelName : "YouTube",
      linked: hasRT ? true : false,
    },
    {
      platform: "Twitter",
      username: twitter ? `@${twitter.screen_name}` : "Twitter",
      linked: twitter && twitter.isActive ? true : false,
    },
    {
      platform: "Zoom",
      username: zoomData?.zoom_rT
        ? zoomData.first_name + " " + zoomData.last_name
        : "zoom",
      linked: zoomData?.zoom_rT ? true : false,
    },
    {
      platform: "Instagram",
      username: instagram?.first_name
        ? `${instagram?.first_name}  ${instagram?.last_name}`
        : "Instagram",
      linked: instagram?.access_token?.length ? true : false,
    },
    {
      platform: "Facebook",
      username: facebook?.first_name
        ? `${facebook?.first_name}  ${facebook?.last_name}`
        : "Facebook",
      linked: facebook?.access_token?.length ? true : false,
    },
    {
      platform: "TikTok",
      username: "MereGrey20",
      linked: false,
    },
    {
      platform: "Linkedin",
      username: linkedin?.first_name
        ? `${linkedin?.first_name}  ${linkedin?.last_name}`
        : "LinkedIn",
      linked: linkedin?.access_token?.length ? true : false,
    },
  ];

  const linkedAccounts = accounts.filter((acc) => acc.linked);
  const linkableAccounts = accounts.filter((acc) => !acc.linked);

  const handleLinkAction = (event) => {
    event.preventDefault();
    const { platform, action } = event.target.dataset;
    setLinkAction({ platform, action });
  };

  const resetAction = () => {
    setLinkAction({ platform: "", action: "" });
  };

  const getChannelName = () => {
    runTheContent((accessToken) => {
      if (!accessToken || accessToken === "undefined") return;
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=
          ${process.env.REACT_APP_APIKEY}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log("Error", data.error.errors[0].message);
          } else {
            console.log(data);
            setChannelName(data && data.items && data.items[0].snippet.title);
          }
        });
    });
  };
  const getPlateFormsToken = () => {
    const getRT = () =>
      axios.get("/users/getrT", {
        headers: {
          authorization: `${token}`,
        },
      });

    const getTwitter = () => twitterApi.getTokens();

    setLoading(true);

    Promise.all([getRT(), getTwitter()])
      .then(([rtRes, twitterRes]) => {
        const {
          rT,
          channelName,
          facebook,
          zoom,
          zoomIsActive,
          instagram,
          linkedin,
        } = rtRes.data;
        setHasRT(rT);
        setChannelName(channelName);
        setFacebook(facebook);
        setZoom(zoomIsActive ? zoom : null);
        setInstagram(instagram);
        setLinkedin(linkedin);

        setTwitterTokens(twitterRes);

        if (!channelName || channelName.length < 1) {
          getChannelName();
        }
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getPlateFormsToken();
    // eslint-disable-next-line
  }, []);
  const unlinkedAccount = () => {
    getPlateFormsToken();
    resetAction();
  };
  if (loading) return null;

  return (
    <div className="flex w-full relative">
      <MainContent className="w-full lg:w-8/12 xl:w-9/12">
        <PageTitle>Edit Linked Accounts</PageTitle>

        <div className="mt-6">
          <Card className="bg-white">
            <CardContent>
              <h3 className="text-lg font-medium">Linked Accounts</h3>

              <hr className="my-3" />

              <div className="space-y-4 mb-8">
                {linkedAccounts.map(({ platform, username }) => (
                  <Card key={platform}>
                    <CardContent className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PLATFORM_ICON_MAP[platform]({
                          className: "w-20 h-8 -ml-4",
                        })}
                        <span className="ml-2 text-sm text-primary">
                          {username}
                        </span>
                      </div>
                      <Button
                        data-action="Unlink"
                        data-platform={platform}
                        theme="none"
                        className="text-sm text-red-500 font-bold bg-white border border-red-500 hover:bg-red-500 hover:text-white"
                        onClick={handleLinkAction}
                      >
                        Unlink
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h3 className="text-lg font-medium">Linkable Platforms</h3>

              <hr className="my-3" />

              <div className="space-y-4">
                {linkableAccounts.map(({ platform }) => (
                  <Card key={platform}>
                    <CardContent className="flex justify-between items-center">
                      <div className="flex items-center">
                        {PLATFORM_ICON_MAP[platform]({
                          className: "w-20 h-8 -ml-4",
                        })}
                        <span className="ml-2 text-sm text-copy">
                          {platform}
                        </span>
                      </div>
                      <Button
                        data-action="Link"
                        data-platform={platform}
                        theme="none"
                        className="text-white font-bold bg-secondary-dark hover:bg-white hover:text-secondary-dark hover:border-secondary-dark"
                        onClick={handleLinkAction}
                      >
                        Link
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <LinkedAccountsSidebar
          user={user}
          memberSince={memberSince}
          platform={linkAction.platform}
          action={linkAction.action}
          onReset={resetAction}
          unlinkedAccount={unlinkedAccount}
        />
      </div>
    </div>
  );
}
