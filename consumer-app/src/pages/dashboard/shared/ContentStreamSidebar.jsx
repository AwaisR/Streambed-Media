import React, { memo } from "react";
import Checkbox from "../../../components/forms/Checkbox";
import { Card, CardContent } from "../../../components/layouts/Card";
import { Link } from "react-router-dom";
import { styled } from "twin.macro";
import Button from "../../../components/common/Button";
import { PLATFORM_ICON_MAP } from "../../../components/helpers/platforms";
import moment from "moment";
const ContentStreamSidebar = ({
  checkedAll,
  youtubeVideoFilterd,
  singleCheck,
  checkAll,
}) => {
  // const renderCArd = (content) => {
  //   let title = "";
  //   let platform = "";
  //   let date = "";
  //   switch (content.platform) {
  //     case "YouTube":
  //       title = content.data.title;
  //       platform = "YouTube";
  //       date = moment(content.data.createdAt).format("LLL");
  //       break;
  //     case "facebook":
  //       title = content.message ? content.message : "";
  //       platform = "Facebook";
  //       break;
  //     case "linkedin":
  //       title = content.data.message;
  //       platform = "Linkedin";
  //       date = moment(content.data.createdAt).format("LLL");
  //       break;
  //     case "instagram":
  //       title = content.caption ? content.caption : "";
  //       platform = "Instagram";
  //       date = moment(content.timestamp).format("LLL");
  //       break;
  //     case "Twitter":
  //       title = content.data.text.includes("https")
  //         ? content.data.text.split("https")[0]
  //         : content.data.text.length
  //         ? content.data.text
  //         : "-";
  //       platform = "Twitter";
  //       date = moment(content.data.createdAt).format("LLL");
  //       break;
  //     default:
  //       break;
  //   }
  //   const handleChangeCheckbox = (id) => {
  //     let youtube = [...youtubeVideoIds];
  //     switch (content.platform) {
  //       case "YouTube":
  //         youtube.push(id);

  //         break;

  //       default:
  //         break;
  //     }
  //     setYoutubeVideoIds(youtube);
  //   };
  //   return (
  //     <Card>
  //       <CardContent className="flex justify-between items-center space-x-2 text-xs">
  //         <div className="flex items-start">
  //           <Checkbox
  //             className="w-3 h-3 mt-1"
  //             name="showAllContentData"
  //             label=""
  //             value={content.data.videoId}
  //             //  checked={checked}
  //             onChange={singleCheck}
  //           />
  //           <div className="py-0 ml-1">
  //             <span>{title}</span>
  //             <br />
  //             <span className="text-xs">{date}</span>
  //           </div>
  //         </div>
  //         {PLATFORM_ICON_MAP[platform]({ className: "w-6 h-6" })}
  //       </CardContent>
  //     </Card>
  //   );
  // };

  return (
    <div className="w-full flex flex-col py-6 min-h-screen bg-white px-6 text-copy">
      <div>
        <h2 className="text-lg mt-2">Content Stream</h2>
        <p className="text-xs mt-2 mb-4">
          Select content to isolate in the content stream for specific data
          outputs on the Analytics Page.
        </p>
      </div>
      <Card className="flex-1 flex flex-col justify-between">
        <CardContent className="relative h-full side-posts">
          <Checkbox
            label="All Content Data"
            labelClassName="text-sm"
            className="w-3 h-3"
            id="showAllContentData"
            name="showAllContentData"
            onChange={(e) => checkAll(e)}
          />
          <hr className="my-3" />
          <div className="space-y-2">
            {youtubeVideoFilterd &&
              youtubeVideoFilterd.map((item, i) => (
                <Card key={i}>
                  <CardContent className="flex justify-between items-center space-x-2 text-xs">
                    <div className="flex items-start">
                      <Checkbox
                        className="w-3 h-3 mt-1"
                        name="showAllContentData"
                        label=""
                        value={item.videoId}
                        checked={item.checked}
                        onChange={singleCheck}
                      />
                      <div className="py-0 ml-1">
                        <span>{item.title}</span>
                        <br />
                        <span className="text-xs">
                          {moment(item.publisherDate).format("LLL")}
                        </span>
                      </div>
                    </div>
                    {PLATFORM_ICON_MAP["YouTube"]({ className: "w-6 h-6" })}
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
        <div className="flex flex-col justify-end">
          <hr />
          <div className="py-2 px-5">
            <Link
              to={{
                pathname: "/analytics",
                analytics: true,
                data: youtubeVideoFilterd,
                allContent: checkedAll,
              }}
              className="flex justify-center"
            >
              <AnalyticsButton theme="primary">View Analytics</AnalyticsButton>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ContentStreamSidebar.propTypes = {
//   footer: PropTypes.element.isRequired,
// };
const AnalyticsButton = styled(Button)`
  border-radius: 23px;
`;
export default memo(ContentStreamSidebar);
