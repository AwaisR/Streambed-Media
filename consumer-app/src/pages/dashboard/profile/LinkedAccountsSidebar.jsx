import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { styled } from "twin.macro";
import axios from "axios";
import queryString from "query-string";

import { Card, CardContent } from "../../../components/layouts/Card";
import UserHeader from "../../../components/dashboard/UserHeader";

import {
  Platforms,
  PLATFORM_ICON_MAP,
} from "../../../components/helpers/platforms";
import Button from "../../../components/common/Button";
import ConfirmModal from "./ConfirmModal";
import twitterApi from "../../../helpers/TwitterApi";
const Container = styled.div`
  box-shadow: 0 3px 10px rgba(0, 55, 74, 0.1);
`;

// platform = "YouTube" | "Twitter" | ...
export default function LinkedAccountsSidebar({
  user,
  memberSince,
  platform,
  action,
  onReset,
  unlinkedAccount,
}) {
  const [processing, setProcessing] = useState(false);
  const [hasRT, setHasRT] = useState(null);
  const [zoomData, setZoom] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [linkedin, setLinkedin] = useState(null);

  const [confirm, setConfirm] = useState(false);

  const token = localStorage.getItem("token");

  const handleConfirm = (yes) => {
    if (yes) {
      if (action === "Unlink") {
        unlinkAccount();
      } else {
        linkAccount();
      }
    }

    setConfirm(false);
  };

  const getTokens = async () => {
    let { data } = await axios.get("/users/getrT", {
      headers: {
        authorization: `${token}`,
      },
    });
    const { rT, zoom, zoom_rT, instagram, facebook, linkedin } = data;
    setHasRT(rT);
    setZoom({ ...zoom, zoom_rT });
    setInstagram(instagram);
    setFacebook(facebook);
    setLinkedin(linkedin);
  };

  // YouTube
  const linkYouTube = async () => {
    const { data } = await axios.post("/api/youtube-auth", null, {
      headers: {
        authorization: token,
      },
    });
    window.location.assign(data.url);
  };
  const unlinkYouTube = async () => {
    if (!hasRT) return;

    await axios.get(
      `https://accounts.google.com/o/oauth2/revoke?token=${hasRT}`
    );

    await axios.post(
      "/users/deleterT",
      { rt: hasRT },
      {
        headers: {
          authorization: token,
        },
      }
    );

    setHasRT(null);
    unlinkedAccount();
  };

  // Linkedin
  const linkLinkedin = () => {
    const stringifiedParams = queryString.stringify({
      client_id: "7836qo1bk7bsv6",
      response_type: "code",
      redirect_uri: `${process.env.REACT_APP_URL}auth/linkedin/callback`,
      scope: [
        "r_liteprofile",
        "r_emailaddress",
        "w_organization_social",
        "r_organization_social",
        "w_member_social",
        "rw_organization_admin",
      ].join(","),
      state: `${token}`,
    });

    const loginURL = `https://www.linkedin.com/oauth/v2/authorization?${stringifiedParams}`;
    if (!linkedin?.access_token.length) {
      window.location = loginURL;
    }
  };
  const unlinkLinkedin = async () => {
    if (!linkedin?.access_token?.length) return;

    await axios.get("/api/linkedin/linkdin-revoke-account", {
      headers: {
        authorization: `${token}`,
      },
    });

    setLinkedin(null);
    unlinkedAccount();
    // window.location.reload();
  };

  // Instagram
  const linkInstagram = () => {
    const stringifiedParams = queryString.stringify({
      client_id: "593542318196587",
      redirect_uri: `${process.env.REACT_APP_URL}/instagram-auth2callback`,
      scope: ["instagram_basic", "pages_show_list"].join(","),
      response_type: "code",
      auth_type: "rerequest",
      display: "popup",
    });

    const facebookLoginUrl = `https://www.facebook.com/v9.0/dialog/oauth?${stringifiedParams}`;
    if (!instagram?.access_token.length) {
      window.location = facebookLoginUrl;
    }
  };
  const unlinkInstagram = async () => {
    if (!instagram?.access_token?.length) return;

    await axios.get("/api/instagram/instagram-revoke", {
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    });
    setInstagram(null);
    unlinkedAccount();
  };

  // Facebook
  const linkFacebook = () => {
    const stringifiedParams = queryString.stringify({
      client_id: "593542318196587",
      redirect_uri: `${process.env.REACT_APP_URL}/facebook-auth2callback`,
      scope: [
        "pages_show_list",
        "user_posts",
        "pages_read_engagement",
        "pages_manage_posts",
        "publish_to_groups",
      ].join(","),
      response_type: "code",
      auth_type: "rerequest",
      display: "popup",
    });

    const facebookLoginUrl = `https://www.facebook.com/v9.0/dialog/oauth?${stringifiedParams}`;
    if (!facebook?.access_token.length) {
      window.location = facebookLoginUrl;
    }
  };
  const unlinkFacebook = async () => {
    if (!facebook?.access_token?.length) return;

    await axios.get("/api/facebook/facebook-revoke", {
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    });
    unlinkedAccount();
    setFacebook(null);
    // window.location.reload();
  };
  //Twitter
  const linkTwitter = () => {
    twitterApi.autheticate().then((jsonResponse) => {
      const { redirectUrl } = jsonResponse;

      window.location.assign(redirectUrl);
    });
  };
  const unlinkTwitter = () => {
    twitterApi.unauthenticate().then((data) => {});
    unlinkedAccount();
  };
  const linkZoom = () => {
    try {
      if (zoomData?.zoom_rT?.length) {
        const _t = JSON.parse(sessionStorage.getItem("zoom"));

        axios
          .get(`/api/zoom/zoom-revoke-access?access_token=${_t?.token}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((data) => {
            if (data.data.status === "success") {
              setZoom({});
              sessionStorage.setItem("zoom", {});
            }
          })
          .catch((error) => {
            console.log("something went wrong", error);
          });

        return;
      }

      // window.location = `https://zoom.us/oauth/authorize?response_type=code&client_id=1v_tqI1dRhGUO11hvlZOOA&redirect_uri=https://26dbf2508e8a.ngrok.io/api/zoom/zoom-auth&state=${token}`;

      window.location = `https://zoom.us/oauth/authorize?response_type=code&client_id=1v_tqI1dRhGUO11hvlZOOA&redirect_uri=${process.env.REACT_APP_redirectURL}/api/zoom/zoom-auth&state=${token}`;
    } catch (error) {
      console.log("something went wrong", error);
    }
  };
  const linkers = {};
  const unlinkers = {};

  linkers[Platforms.YouTube] = linkYouTube;
  unlinkers[Platforms.YouTube] = unlinkYouTube;

  linkers[Platforms.Linkedin] = linkLinkedin;
  unlinkers[Platforms.Linkedin] = unlinkLinkedin;

  linkers[Platforms.Instagram] = linkInstagram;
  unlinkers[Platforms.Instagram] = unlinkInstagram;

  linkers[Platforms.Facebook] = linkFacebook;
  unlinkers[Platforms.Facebook] = unlinkFacebook;

  linkers[Platforms.Twitter] = linkTwitter;
  unlinkers[Platforms.Twitter] = unlinkTwitter;

  linkers[Platforms.Zoom] = linkZoom;
  // unlinkers[Platforms.Zoom] = unlinkZoom;
  const linkAccount = async () => {
    const linker = linkers[platform];

    if (!linker) return;

    console.log("Linking " + platform);

    setProcessing(true);
    try {
      await linker();
    } catch (error) {
      console.error("Link error: " + error);
    } finally {
      setProcessing(false);
    }
  };

  const unlinkAccount = async () => {
    const unlinker = unlinkers[platform];
    if (!unlinker) return;

    console.log("Unlinking " + platform);

    setProcessing(true);
    try {
      await unlinker();
    } catch (error) {
      console.error("Unlink error: " + error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    getTokens();
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="w-full flex flex-col py-6 min-h-screen bg-white px-6 text-copy">
      <div className="pt-8 mb-4">
        {/* Header */}
        <UserHeader user={user} memberSince={memberSince} />

        <hr className="mt-4" />
      </div>

      <ConfirmModal
        open={confirm}
        action={action.toLowerCase()}
        platform={platform}
        onClose={handleConfirm}
      />

      <Card className="flex-1 flex flex-col justify-between">
        {platform ? (
          <>
            <div className="relative h-full">
              <CardContent>
                {PLATFORM_ICON_MAP[platform]({
                  className: "w-20 h-8 p-0 -ml-4 block",
                })}
                <p className="mt-2 text-sm">Link {platform} account</p>
              </CardContent>
              <hr />
              <CardContent>
                <p className="text-xs">
                  By accepting Streambedmedia's Policies and Terms of Service, I
                  give Streambedmedia permission to post to {platform} on my
                  behalf.
                </p>
              </CardContent>
            </div>
            <CardContent>
              <div className="flex flex-col justify-end space-y-2">
                <Button
                  theme="none"
                  className="font-bold bg-white text-copy border border-copy hover:bg-copy hover:text-white"
                  onClick={onReset}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  theme="none"
                  onClick={() => setConfirm(true)}
                  className={clsx("font-bold", {
                    "text-white bg-secondary-dark hover:bg-white hover:text-secondary-dark hover:border-secondary-dark":
                      action === "Link",
                    "text-red-500 bg-white border border-red-500 hover:bg-red-500 hover:text-white":
                      action === "Unlink",
                  })}
                  disabled={processing}
                >
                  {action} {platform} Account
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent>
            <p>Selected options will appear here.</p>
          </CardContent>
        )}
      </Card>
    </Container>
  );
}

LinkedAccountsSidebar.propTypes = {
  user: PropTypes.object.isRequired,
  memberSince: PropTypes.object.isRequired,
};
