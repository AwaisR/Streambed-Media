import React, { useEffect, useMemo, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import format from "date-fns/format";
import axios from "axios";

import { Card, CardContent } from "../../components/layouts/Card";
import ContentLoading from "./content/ContentLoading";

import PlusCircleIcon from "../../components/icons/PlusCircleIcon";
import MinusCircleIcon from "../../components/icons/MinusCircleIcon";
import DirectoryIcon from "../../components/icons/DirectoryIcon";
import RefreshIcon from "../../components/icons/RefreshIcon";
import EditIcon from "../../components/icons/EditIcon";
import AvatarIcon from "../../components/icons/AvatarIcon";
import LabelIcon from "../../components/icons/LabelIcon";
import CheckIcon from "../../components/icons/CheckIcon";
import CloseIcon from "../../components/icons/CloseIcon";
import ExclamationIcon from "../../components/icons/ExclamationIcon";

import MainContent from "./shared/MainContent";
import PageTitle from "./shared/PageTitle";
import ContentStreamSidebar from "./shared/ContentStreamSidebar";
import ActionButton from "./shared/ActionButton";

import {
  PLATFORM_ICON_MAP,
  PLATFORM_TITLE_MAP,
} from "../../components/helpers/platforms";
import {
  formatAbsoluteTime,
  formatNumberWithCommas,
} from "../../helpers/helper";

import AnalyticsGraph from "./content/AnalyticsGraph";
import { instagramAnalytics } from "../seed/analytics";

const Content = () => {
  const routeMatch = useRouteMatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [platform, setPlatform] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [author, setAuthor] = useState(null);
  const [viewURL, setViewURL] = useState(null);

  const contributorsGrid = useMemo(
    () =>
      contributors.map((contributor) => (
        <Card key={contributor._id}>
          <CardContent className="flex space-x-2">
            <div className="rounded-full relative p-0 w-14 h-14 flex justify-center items-center">
              <AvatarIcon className="w-14 h-14 text-primary" />
              <div className="absolute bottom-0 right-0">
                {contributor.isVerified ? (
                  <CheckIcon className="text-secondary-dark w-4 h-4" />
                ) : (
                  <CloseIcon className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className="w-full">
              <h5 className="text-primary text-sm">{contributor.name}</h5>
              <p className="text-xxs text-gray-400">@{contributor.user}</p>
              <hr className="my-1" />
              <p className="text-xs flex items-center">
                <LabelIcon className="mr-1" /> {contributor.role}
              </p>
              {contributor.isVerified ? (
                <p className="text-secondary-dark text-xxs">Verified</p>
              ) : (
                <p className="text-secondary text-xxs">Not Verified</p>
              )}
            </div>
          </CardContent>
        </Card>
      )),
    [contributors]
  );

  // fetches the content whose id matches the content id in the
  // route param. redirects to 404 if not found
  useEffect(() => {
    const id = routeMatch.params.contentId;
    const platform = routeMatch.path.match(/\S+\/(\w+)\//i)[1];
    const token = localStorage.getItem("token");

    setPlatform(platform);
    setLoading(loading);

    (async () => {
      try {
        let _id, createdAt, title, description, collaborators, data;
        switch (platform) {
          case "twitter":
            let resp = await axios.post(
              "/api/twitter/get-tweetsById",
              { tweet_id: id },
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            const error = resp.data.error;
            console.log(resp.data)
            data = resp.data.tweets;
            // let resp = await axios.get("/api/twitter/get-user-post", {
            //   headers: {
            //     Authorization: token,
            //   },
            // });
            // console.log(resp);
            // data = resp.data._posts?.find((post) => post.id_str === id);
            if (error && error.length) {
              throw new Error(error[0].message);
            }

            _id = data.id_str;
            title = null;
            description = data.text.includes("https")
              ? data.text.split("https")[0]
              : data.text.length
              ? data.text
              : "-";
            createdAt = new Date(data.created_at).getTime();

            setAuthor({
              username: data.user.screen_name,
              name: data.user.name,
            });

            // fetch collaborators
            resp = await axios.get(
              "http://localhost:4000/api/twitter/get-collaborators",
              {
                headers: {
                  Authorization: token,
                },
              }
            );

            collaborators = (data.collaborators || [])
              .filter((o) => String(o.post_id) === String(_id))
              .map((o) => ({
                ...o,
                repostAvailable: "",
                isVerified: false,
              }));

            setViewURL(
              `https://twitter.com/${data.user.screen_name}/status/${_id}`
            );
            break;
          default:
            break;
        }

        setContentData({ _id, createdAt, title, description, data });
        setContributors(collaborators);
      } catch (e) {
        // not found
        console.error(e);
        setErrorMsg(e.message || "Could not load tweet, sorry.");
        // history.replace("/404");
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line
    })();

    // const contrib = (user, email, role, isVerified) => ({
    //   _id: ++contrib._id,
    //   user,
    //   email,
    //   role,
    //   isVerified,
    // });
    // contrib._id = 0;
    // setContributors([
    //   contrib("Sean_Cullen", "Sean Cullen", "Original Publisher", true),
    //   contrib("monnyrand", "Monica Rand", "Talent", true),
    //   contrib("MDAWG", "Milo Cullen", "Crew", true),
    //   contrib("roestm", "Michelle Roest", "Crew", true),
    //   contrib("carrollj", "Jen Carroll", "Crew", false),
    // ]);
    // eslint-disable-next-line
  }, [routeMatch.params["contentId"], history]);

  let createdAt, title, description, data, media;

  if (contentData) {
    createdAt = contentData.createdAt;
    title = contentData.title;
    description = contentData.description;
    data = contentData.data;

    media = null;
    if (platform === "twitter" && data.entities.media?.length) {
      if (data.mimeType.startsWith("image/")) {
        media = (props) => (
          <img
            {...props}
            src={data.entities.media[0].media_url}
            alt="Twitter media"
          />
        );
      } else if (data.mimeType.startsWith("video/")) {
        media = (props) => (
          <video
            {...props}
            src={data.entities.media[0].media_url}
            alt="Twitter media"
          ></video>
        );
      }
    }
  }

  return (
    <div className="flex w-full relative">
      <MainContent className="w-full lg:w-8/12 xl:w-9/12">
        <div className="flex justify-between items-end">
          <PageTitle>Content</PageTitle>
          <Link to="/content" className="text-primary text-sm">
            Back to content stream
          </Link>
        </div>

        {loading ? (
          <ContentLoading />
        ) : !errorMsg ? (
          <>
            <Card className="mt-6 bg-white">
              <CardContent>
                <div className="grid gap-6 grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2">
                  <div>
                    {title ? (
                      <>
                        <h3 className="text-primary text-xl">{title}</h3>
                        <p className="mt-1 mb-6 text-sm text-copy">
                          {description}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 mb-6 text-base text-copy">
                        {description}
                      </p>
                    )}
                    <div className="text-gray-400 text-xs flex justify-between">
                      <p>Views: {formatNumberWithCommas(data.viewCount)}</p>

                      {platform === "twitter" ? (
                        <p>Characters: {description.length}/280</p>
                      ) : platform === "youtube" ? (
                        <p>Watch time: {formatAbsoluteTime(data.watchTime)}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full">
                    {media ? (
                      media({
                        className:
                          "object-cover w-full h-full rounded-xl shadow",
                      })
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-xl shadow"></div>
                    )}
                  </div>
                </div>

                <hr className="my-3" />

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <div>
                    {PLATFORM_ICON_MAP[PLATFORM_TITLE_MAP[platform]]({
                      className: "w-auto h-10 mt-2 mb-4 hidden sm:block",
                    })}

                    <div className="text-sm md:text-xs space-y-2 sm:space-y-2">
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <p>You posted to {PLATFORM_TITLE_MAP[platform]}:</p>
                        <p className="ml-2 md:ml-0">
                          {format(createdAt, "MMM dd, yyyy - hh:mm aa")}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row md:justify-between">
                        <p>
                          Original post by{" "}
                          <span className="text-primary">
                            @{author.username}
                          </span>
                        </p>
                        <p className="ml-2 md:ml-0">
                          {format(createdAt, "MMM dd, yyyy - hh:mm aa")}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row md:justify-between">
                        <p>OIP Transaction ID:</p>
                        <p className="ml-2 sm:ml-0 text-primary">
                          {contentData.oipTransactionId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <ActionButton
                      className="w-24 mx-1 my-1"
                      label="View"
                      icon={PLATFORM_ICON_MAP[PLATFORM_TITLE_MAP[platform]]({
                        className: "w-auto h-10",
                      })}
                      onClick={() => window.open(viewURL, "_blank")}
                    />
                    <ActionButton
                      className="w-24 mx-1 my-1"
                      label="Index Page"
                      icon={
                        <DirectoryIcon className="w-auto h-10 text-primary" />
                      }
                    />
                    <ActionButton
                      className="w-24 mx-1 my-1"
                      label="Repost"
                      icon={
                        <RefreshIcon className="w-auto h-10 text-primary" />
                      }
                    />
                    <ActionButton
                      className="w-24 mx-1 my-1"
                      label={`${
                        contentData.inContentStream ? "Remove from" : "Add to"
                      } content stream`}
                      icon={
                        contentData.inContentStream ? (
                          <MinusCircleIcon className="w-auto h-8" />
                        ) : (
                          <PlusCircleIcon className="w-auto h-8" />
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contributors and Analytics */}
            <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-2">
              {/* Contributors */}
              <Card className="bg-white">
                <CardContent>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl text-copy">Contributors</h3>
                    <EditIcon />
                  </div>
                  <div className="mt-3 grid gap-4 grid-cols-2">
                    {contributorsGrid}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <AnalyticsGraph data={instagramAnalytics} platform={platform} />
            </div>
          </>
        ) : (
          <Card className="mt-6 bg-white">
            <CardContent>
              <ErrorDisplay error={errorMsg} />
            </CardContent>
          </Card>
        )}
      </MainContent>
      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <ContentStreamSidebar
          footer={
            <p className="text-xs">
              Select specific posts to show statistics regarding that group of
              data.
            </p>
          }
        />
      </div>
    </div>
  );
};

export default Content;

function ErrorDisplay({ error }) {
  return <div className="text-md lg:text-lg text-copy flex items-center">
    <ExclamationIcon /> <span className="ml-2">{error}</span>
  </div>;
}
