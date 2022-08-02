import React from "react";

import YouTubeIcon from "../icons/YouTubeIcon";
import TwitterIcon from "../icons/TwitterIcon";
import ZoomIcon from "../icons/ZoomIcon";
import InstagramIcon from "../icons/InstagramIcon";
import FacebookIcon from "../icons/FacebookIcon";
import TikTokIcon from "../icons/TikTokIcon";
import LinkedInIcon from "../icons/LinkedInIcon.jsx";

export const PLATFORM_ICON_MAP = {
  YouTube: (args) => <YouTubeIcon {...args} />,
  Twitter: (args) => <TwitterIcon {...args} />,
  Zoom: (args) => <ZoomIcon {...args} />,
  Instagram: (args) => <InstagramIcon {...args} />,
  Facebook: (args) => <FacebookIcon {...args} />,
  TikTok: (args) => <TikTokIcon {...args} />,
  Linkedin: (args) => <LinkedInIcon {...args} />,
};

export const Platforms = {
  YouTube: "YouTube",
  Twitter: "Twitter",
  Zoom: "Zoom",
  Instagram: "Instagram",
  Facebook: "Facebook",
  TikTok: "TikTok",
  Linkedin: "Linkedin",
};

export const PLATFORM_TITLE_MAP = {
  youtube: Platforms.YouTube,
  twitter: Platforms.Twitter,
  zoom: Platforms.Zoom,
  instagram: Platforms.Instagram,
  facebook: Platforms.Facebook,
  tiktok: Platforms.TikTok,
  linkedin: Platforms.Linkedin,
};

export const generatePostURLFromTweet = ({ id_str, user }) =>
  `https://twitter.com/${user.screen_name}/status/${id_str}`;
