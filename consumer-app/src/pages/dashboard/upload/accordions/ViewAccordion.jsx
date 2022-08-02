import React from "react";
import { Link } from "react-router-dom";

import OverviewIcon from "../../../../components/icons/OverviewIcon";
import ContentIcon from "../../../../components/icons/ContentIcon";
import DirectoryIcon from "../../../../components/icons/DirectoryIcon";
import MemoSearchIcon from "../../../../components/icons/SearchIcon";
import ActionButton from "../../shared/ActionButton";
import DownloadContract from "../../../../components/icons/DownloadContract";
const actions = [
  {
    icon: <OverviewIcon className="w-7 h-7 fill-current transform scale-90" />,
    label: "Overview",
    link: () => "/overview",
  },
  {
    icon: (
      <MemoSearchIcon className="w-7 h-7 fill-current transform scale-90" />
    ),
    label: "View on Magnify",
    link: () => "/magnify",
  },
  {
    icon: <ContentIcon className="w-7 h-7 fill-current transform scale-90" />,
    label: "Content Page",
    link: () => "/content",
  },
  {
    icon: <DirectoryIcon className="w-7 h-7 fill-current transform scale-90" />,
    label: "Index Page",
    link: () => "/",
  },
];

const ViewAccordion = ({
  platform,
  contributors,
  onSubmit,
  onNext,
  siaUrl,
  txid,
  postResult,
  videoId,
}) => {
  const platformLink = () => {
    if (platform === "YouTube") {
      window.open(`https://www.youtube.com/watch?v=${videoId ? videoId : ""}`);
    } else if (platform === "Twitter") {
      const {
        data: { id_str, user },
      } = postResult;
      window.open(`https://twitter.com/${user.screen_name}/status/${id_str}`);
    } else if (platform === "Linkedin") {
      const { data } = postResult;
      window.open(
        `https://www.linkedin.com/company/${data.organaization}/admin/`
      );
    } else if (platform === "Facebook") {
    } else if (platform === "Instagram") {
      const { data } = postResult;
      window.location.replace(data.dataInstagram.permalink);
    }
  };
  const goToSiaUrl = () => {
    if (platform === "YouTube") {
      window.open(`https://siasky.net/${siaUrl ? siaUrl : ""}`);
    } else if (platform === "Twitter") {
    } else if (platform === "Linkedin") {
      const { data } = postResult;
      window.open(`https://siasky.net/${data.sia_url ? data.sia_url : ""}`);
    } else if (platform === "Facebook") {
      const { data } = postResult;
      window.location.replace(
        `https://siasky.net/${data.sia_url ? data.sia_url : ""}`
      );
    } else if (platform === "Instagram") {
      const { data } = postResult;
      window.location.replace(
        `https://siasky.net/${
          data.dataInstagram.newRecord
            ? data.dataInstagram.newRecord.sia_url
            : ""
        }`
      );
    }
  };
  const siaUrls = () => {
    if (platform === "YouTube") {
      return `${siaUrl ? siaUrl : ""}`.substring(0, 20);
    } else if (platform === "Twitter") {
    } else if (platform === "Linkedin") {
      const { data } = postResult;
      return `${data.sia_url ? data.sia_url : ""}`.substring(0, 20);
    } else if (platform === "Facebook") {
      const { data } = postResult;
      return `${data.sia_url ? data.sia_url : ""}`.substring(0, 20);
    } else if (platform === "Instagram") {
      const { data } = postResult;
      return `${
        data.dataInstagram.newRecord ? data.dataInstagram.newRecord.sia_url : ""
      }`.substring(0, 20);
    }
  };
  return (
    <div className="py-2">
      <p className="text-sm text-copy font-light">
        Congratulations! You’re finished.
      </p>
      <div className="mt-4 flex flex-wrap justify-center sm:justify-start">
        {actions.map(({ icon, label, link }) => (
          <Link to={link()} key={label} className="pr-4 pb-2">
            <ActionButton
              className="px-4 py-3 w-28 h-28"
              icon={icon}
              label={label}
              onClick={() => void 0}
            />
          </Link>
        ))}
        {/* <Link to={platformLink}> */}
        <div className="pr-4 pb-2">
          <ActionButton
            className="px-4 py-3 w-28 h-28"
            label="View"
            platform={platform}
            onClick={() => platformLink()}
          />
        </div>
        <div className="pr-4 pb-2">
          <ActionButton
            className="px-4 py-3 w-28 h-28"
            label="Download Contract"
            // platform={platform}
            icon={<DownloadContract />}
            onClick={() => platformLink()}
          />
        </div>
        {/* </Link> */}
      </div>
      <div className="mt-5 flex justify-start flex-wrap">
        <div className="mr-4 mb-2">
          <h6 className="text-xs text-primary font-semibold mt-3">
            OIP Transaction ID
          </h6>
          <p className="text-sm">{txid ? txid : ""}</p>
        </div>
        <div className="mr-4 mb-2">
          <h6 className="text-xs text-primary font-semibold mt-3">FLOW ID</h6>
          <p className="text-sm">jghoweuhg84no4ue0fw08</p>
        </div>
        <div className="mr-4 mb-2">
          <h6
            className="text-xs text-primary font-semibold mt-3"
            onClick={goToSiaUrl}
          >
            Sia Url ID
          </h6>
          <p className="text-sm" onClick={goToSiaUrl}>
            {siaUrls()}
            {`${siaUrl ? siaUrl : ""}`.substring(0, 20)}
            ...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewAccordion;
