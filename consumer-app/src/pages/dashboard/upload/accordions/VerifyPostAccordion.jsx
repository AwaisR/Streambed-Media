import React, { useState, useMemo } from "react";
import format from "date-fns/format";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// components
import { Card, CardContent } from "../../../../components/layouts/Card";
import { NextButton } from "./shared";

// icons
import LabelIcon from "../../../../components/icons/LabelIcon";
import SliderPic from "../../../../assets/images/sliderImage.png";
import paymentsBlack from "../../../../assets/images/icons/paymentsBlack.svg";
import articleBlack from "../../../../assets/images/icons/articleBlack.svg";
// utils
import { formatAbsoluteTime } from "../../../../helpers/helper";
import moment from "moment";
const VerifyPostAccordion = ({
  index,
  platform,
  media,
  platformInputs,
  contributors,
  youtubeFeilds,
  processing, // meant to toggle processing state
  postResult,
  onNext,
}) => {
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "none" }}
        onClick={onClick}
      >
        {/* <img src={LeftArow} alt="arrow_left" /> */}
      </div>
    );
  }
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          right: "0px !important",
          opacity: "1",
        }}
        onClick={onClick}
      >
        <img src={SliderPic} alt="arrow_left" />
      </div>
    );
  }
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const settingsFacebook = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <div className="py-2">
      <p className="text-sm font-light mb-3">
        Please review the details of your content before posting.
      </p>

      {platform === "YouTube" ? (
        <YouTubeDetails
          media={media}
          platformInputs={platformInputs}
          contributors={contributors}
          youtubeFeilds={youtubeFeilds}
          settings={settings}
        />
      ) : platform === "Twitter" ? (
        <TwitterDetails
          media={media}
          platformInputs={platformInputs}
          contributors={contributors}
        />
      ) : platform === "Instagram" ? (
        <InstagramDetails
          media={media}
          platformInputs={platformInputs}
          contributors={contributors}
        />
      ) : platform === "Linkedin" ? (
        <FacebookDetails
          media={media}
          platformInputs={platformInputs}
          contributors={contributors}
          settingsFacebook={settingsFacebook}
        />
      ) : platform === "Facebook" ? (
        <FacebookDetails
          media={media}
          platformInputs={platformInputs}
          contributors={contributors}
          settingsFacebook={settingsFacebook}
        />
      ) : null}

      <div className="mt-6">
        {postResult.error ? (
          <p className="text-sm text-red-50 mb-2">
            An error occured while making the post. Try again
          </p>
        ) : null}
        <NextButton
          className="ml-auto"
          disabled={!platform || processing}
          onClick={() => onNext(index + 1)}
        >
          {!processing ? "Post" : "Sending..."}
        </NextButton>
      </div>
    </div>
  );
};

export default VerifyPostAccordion;

const LittleHeading = ({ children }) => (
  <h6 className="text-xs text-primary font-semibold mb-3">{children}</h6>
);

const YouTubeDetails = ({
  media,
  platformInputs,
  contributors,
  youtubeFeilds,
  settings,
}) => {
  const [created] = useState(new Date());
  // const thumbnailObjectURL = useMemo(
  //   () =>
  //     youtubeFeilds?.thumbnail
  //       ? window.URL.createObjectURL(youtubeFeilds.thumbnail)
  //       : null,
  //   [youtubeFeilds.thumbnail]
  // );

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 mb-5 mt-6	">
        <div>
          <LittleHeading>Title</LittleHeading>
          <p>{youtubeFeilds.title}</p>
        </div>
        <div className="flex space-x-4">
          <div>
            <LittleHeading>Length</LittleHeading>
            <p className="text-sm">{formatAbsoluteTime(media.file.duration)}</p>
          </div>
          <div>
            <LittleHeading>Date</LittleHeading>
            <p className="text-sm">{format(created, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <LittleHeading>Time</LittleHeading>
            <p className="text-sm">{format(created, "hh:mm aa")}</p>
          </div>
        </div>
      </div>

      <LittleHeading className="mb-0.5">Contributors</LittleHeading>
      {contributors.length > 4 ? (
        <Slider {...settings}>
          {contributors.map((contributor, idx) => (
            <div className="grid flex gap-4 grid-cols-1 lg:grid-cols-2 mb-5 w-64">
              <ContributorCard
                key={idx}
                contributor={contributor}
                className="sliderCard"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <>
          <div className="flex">
            {contributors.map((contributor, idx) => (
              <div className="grid flex gap-4 grid-cols-1 lg:grid-cols-2 mb-5 w-64">
                <ContributorCard
                  key={idx}
                  contributor={contributor}
                  className="sliderCard"
                />
              </div>
            ))}
          </div>
        </>
      )}
      <LittleHeading className="mb-0.5">Terms</LittleHeading>
      <div className="flex justify-between  terms">
        <Card className="w-1/3 termsCard">
          <CardContent className="py-2 px-3 text-copy text-base sm:text-sm sm:px-5 sm:py-3 flex justify-between items-flex-start sliderCard">
            <div>
              <p>License</p>
              <p className="mt-2.5">Attribution</p>
            </div>
            <div>
              <img src={articleBlack} alt="articalBlack" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/3 termsCard">
          <CardContent className="py-2 px-3 text-copy text-base sm:text-sm sm:px-5 sm:py-3 flex justify-between items-flex-start sliderCard">
            <div>
              <p>License Price</p>
              <p className="mt-2.5">$150</p>
            </div>
            <div>
              <img src={paymentsBlack} alt="articalBlack" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/3 termsCard">
          <CardContent className="py-2 px-3 text-copy text-base sm:text-sm sm:px-5 sm:py-3 flex justify-between items-flex-start sliderCard">
            <div>
              <p>Payouts</p>
              <p className="mt-2.5">
                70% - you <br />
                30% - contributors
              </p>
            </div>
            <div>
              <img src={paymentsBlack} alt="articalBlack" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TwitterDetails = ({ media, platformInputs, contributors }) => {
  const [created] = useState(new Date());

  return (
    <div>
      <div className="grid gap-4 grid-cols-2">
        <div>
          <LittleHeading>Tweet</LittleHeading>
          <p>{platformInputs.statusText}</p>
        </div>
        <div className="flex space-x-4">
          <div>
            <LittleHeading>Length</LittleHeading>
            <p className="text-sm">{platformInputs.statusText.length}/280</p>
          </div>
          <div>
            <LittleHeading>Date</LittleHeading>
            <p className="text-sm">{format(created, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <LittleHeading>Time</LittleHeading>
            <p className="text-sm">{format(created, "hh:mm aa")}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <LittleHeading>Contributors</LittleHeading>
        {contributors.length ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contributors.map((contributor, idx) => (
              <ContributorCard key={idx} contributor={contributor} />
            ))}
          </div>
        ) : (
          <p className="text-sm">None</p>
        )}
      </div>
    </div>
  );
};
const FacebookDetails = ({
  media,
  platformInputs,
  contributors,
  settingsFacebook,
}) => {
  const mediaURL = useMemo(() => {
    const { file } = media;

    if (!file) return;
    return window.URL.createObjectURL(file.data);
    // eslint-disable-next-line
  }, [media.file]);
  const [created] = useState(new Date());

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="w-full max-w-full">
          <Card className="w-full max-w-full	">
            <CardContent style={{ minHeight: "124px" }}>
              {mediaURL && media.file.type === "image" ? (
                <img
                  className="block w-full h-52 object-cover"
                  src={mediaURL}
                  alt="mediaImage"
                  style={{ overflow: "hidden", maxHeight: "124px" }}
                />
              ) : mediaURL && media.file.type === "video" ? (
                <video
                  className="block w-full h-52 object-cover"
                  src={mediaURL}
                  style={{ height: "100%" }}
                  controls
                ></video>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className={"post-message"}>
          <LittleHeading>Post Message</LittleHeading>
          <p>{platformInputs.statusText}</p>
        </div>

        <div>
          <LittleHeading style={{ width: "100%", display: "flex" }}>
            Contributors
          </LittleHeading>
          {contributors.length > 4 ? (
            <div className="contributor-wrap">
              <Slider {...settingsFacebook}>
                {contributors.map((contributor, idx) => (
                  <ContributorCard
                    key={idx}
                    contributor={contributor}
                    className="facebook-contributor-card"
                  />
                ))}
              </Slider>
            </div>
          ) : (
            <div className="contributor-wrap">
              {contributors.map((contributor, idx) => (
                <ContributorCard
                  className="facebook-contributor-card"
                  key={idx}
                  contributor={contributor}
                />
              ))}
            </div>
            // <p className="text-sm">None</p>
          )}
        </div>
      </div>
      <div className="flex space-x-4 content-length">
        <div>
          <LittleHeading>Length</LittleHeading>
          <p className="text-sm">{platformInputs.statusText.length}/280</p>
        </div>
        <div>
          <LittleHeading>Date</LittleHeading>
          <p className="text-sm">{format(created, "MMM dd, yyyy")}</p>
        </div>
        <div>
          <LittleHeading>Time</LittleHeading>
          <p className="text-sm">{format(created, "hh:mm aa")}</p>
        </div>
      </div>
    </div>
  );
};
// const LinkedinDetails = ({ media, platformInputs, contributors }) => {
//   const [created] = useState(new Date());

//   return (
//     <div>
//       <div className="grid gap-4 grid-cols-2">
//         <div>
//           <LittleHeading>Title</LittleHeading>
//           <p>{platformInputs.statusText}</p>
//         </div>
//         <div className="flex space-x-4">
//           <div>
//             <LittleHeading>Length</LittleHeading>
//             <p className="text-sm">{platformInputs.statusText.length}/280</p>
//           </div>
//           <div>
//             <LittleHeading>Date</LittleHeading>
//             <p className="text-sm">{format(created, "MMM dd, yyyy")}</p>
//           </div>
//           <div>
//             <LittleHeading>Time</LittleHeading>
//             <p className="text-sm">{format(created, "hh:mm aa")}</p>
//           </div>
//         </div>
//       </div>
//       <div className="mt-4">
//         <LittleHeading>Contributors</LittleHeading>
//         {contributors.length ? (
//           <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {contributors.map((contributor, idx) => (
//               <ContributorCard key={idx} contributor={contributor} />
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm">None</p>
//         )}
//       </div>
//     </div>
//   );
// };
const InstagramDetails = ({ media, platformInputs, contributors }) => {
  // const [created] = useState(new Date());
  platformInputs = platformInputs || {};
  return (
    <div className="grid gap-4 grid-cols-2">
      <div className="flex space-x-3">
        <Card className="w-1/3">
          <CardContent className="flex flex-col justify-between">
            <div className="h-24 w-full">
              {media.file.data.media_type === "VIDEO" ? (
                <video
                  className="block w-full h-52 object-cover"
                  src={media?.file.data.media_url}
                  style={{ height: "100%" }}
                  controls
                ></video>
              ) : (
                <img
                  className="block w-full h-52 object-cover"
                  src={media?.file.data.media_url}
                  style={{ overflow: "hidden", maxHeight: "124px" }}
                  alt="imageMedia"
                />
              )}
            </div>
            {/* <p className="text-xs mt-1">{format(created, "MMM dd/yy")}</p> */}
            {/* <p className="text-xs mt-1">  {moment(media?.file.data.timestamp).format("ll")}</p> */}
          </CardContent>
        </Card>
        <div className="flex flex-col justify-between">
          <LittleHeading>Caption</LittleHeading>
          <p className="text-sm">{media?.file.data.caption}</p>

          <div className="mt-4 flex space-x-6">
            <div>
              <LittleHeading>Date</LittleHeading>
              <p className="text-sm">
                {" "}
                {moment(media?.file.data.timestamp).format("ll")}
              </p>
            </div>
            <div>
              <LittleHeading>Time</LittleHeading>
              <p className="text-sm">
                {moment(media?.file.data.timestamp).format("LT")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <LittleHeading>Contributors</LittleHeading>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {contributors.map((contributor, idx) => (
            <ContributorCard key={idx} contributor={contributor} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ContributorCard = ({ contributor, className }) => (
  <Card className={className}>
    <CardContent>
      <h6 className="text-primary-dark font-semibold text-sm">
        {contributor.user}
      </h6>
      <p className="text-gray-400 text-xxs">@{contributor.email}</p>
      <hr className="my-1" />
      <p className="text-xs flex items-center">
        <LabelIcon className="mr-1" /> {contributor.role}
      </p>
      {contributor.isVerified ? (
        <p className="text-secondary-dark text-xxs">Verified</p>
      ) : (
        <p className="text-secondary text-xxs">Not Verified</p>
      )}
    </CardContent>
  </Card>
);
