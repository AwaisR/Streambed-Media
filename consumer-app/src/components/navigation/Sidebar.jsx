import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { styled } from "twin.macro";
import PropTypes from "prop-types";

import LogoIcon from "../icons/LogoIcon";
import OverviewIcon from "../icons/OverviewIcon";
import ContentIcon from "../icons/ContentIcon";
import UploadIcon from "../icons/UploadIcon";
import ProfileIcon from "../icons/ProfileIcon";
import AnalyticsIcon from "../icons/AnalyticsIcon";
import SettingsIcon from "../icons/SettingsIcon";
import SignoutIcon from "../icons/SignoutIcon";

const SidebarContainer = styled.div`
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 3px 10px rgba(0, 55, 74, 0.1);
`;

const SidebarItem = ({ icon: Icon, label, link, page, ...rest }) => (
  <li {...rest}>
    <Link to={link} className="flex flex-col items-center py-3 px-3 cursor-pointer">
      <Icon 
        className={clsx("w-7 h-7 fill-current transform scale-90", { 
        "text-copy": page !== label,
        "text-primary": page === label,
        })} 
      />
      <h3 
        className={clsx("text-xs text-center mt-2", {
          "text-copy": page !== label,
          "text-primary": page === label,
        })}
      >
        {label}
      </h3>
    </Link>
  </li>
);

SidebarItem.propTypes = {
  icon: PropTypes.shape({ render: PropTypes.func }).isRequired,
  label: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
};

const Sidebar = ({ className, page }) => {
  return (
    <SidebarContainer className={clsx("h-screen px-2 py-8 w-full bg-white", className)}>
      <div className="h-full flex flex-col justify-between">
        <div className="h-4/5 space-y-6">
          <div className="text-center">
            <Link to="/home">
              <LogoIcon className="block mx-auto" />
            </Link>
          </div>
          <div className="h-5/6 overflow-auto">
            <ul className="list-none">
              <SidebarItem label="Overview" icon={OverviewIcon} page={page} link="/overview" />
              <SidebarItem label="Analytics" icon={AnalyticsIcon} page={page} link="/analytics" />
              <SidebarItem label="Upload" icon={UploadIcon} page={page} link="/video-upload" />
              <SidebarItem label="Content" icon={ContentIcon} page={page} link="/content" />
              <SidebarItem label="Profile" icon={ProfileIcon} page={page} link="/profile" />
            </ul>
          </div>
        </div>
        <ul className="list-none flex flex-col justify-end">
          <SidebarItem label="Settings" icon={SettingsIcon} page={page} link="/settings" />
          <SidebarItem label="Sign Out" icon={SignoutIcon} page={page} link="/logout" />
        </ul>
      </div>
    </SidebarContainer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  page: PropTypes.string.isRequired,
};

export default Sidebar;