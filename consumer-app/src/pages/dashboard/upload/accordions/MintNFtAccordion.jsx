import React, { useState } from "react";

// components

import { NextButton } from "./shared";

// icons

import RoundedInput from "../../../../components/forms/RoundedInput";

import FlowImage from "../../../../assets/images/flow.svg";
// utils

import PaymentModel from "./PaymentModel";
import NFTOOLTIP from "./NFTOOLTIP";

import QuestionMark from "../../../../assets/images/questionMark.png";
const MintNFtAccordion = ({ index, platform, onNext }) => {
  const [payModel, setPayModel] = useState(false);
  const [selector, showSelector] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const handleSelector = () => {
    showSelector(!selector);
  };
  const select = [
    {
      name: "With Attribution",
    },
    {
      name: "Limited License",
    },
  ];

  const crossModel = () => {
    setPayModel(false);
  };
  const handleSelectChange = (name) => {
    setSelectValue(name);
    showSelector(false);
  };
  return (
    <>
      <div className="grid gap-4 grid-cols-1">
        <div className="mt-4">
          <div className="flex justify-between  space-x-9 ">
            <div className="w-3/12 mb-4 toolTipOuter">
              <div className="mb-4 flex w-full justify-between align-center">
                <LittleHeading className="mb-4">Set Usage Terms</LittleHeading>
                <div className="hover-icon cursor-pointer">
                  <img
                    src={QuestionMark}
                    style={{ width: "16px" }}
                    alt="questionMark"
                  />
                </div>
                <NFTOOLTIP heading="Set Usage Terms" />
              </div>
              <div
                className={
                  !selector && selectValue
                    ? "selecter select-value"
                    : "selecter"
                }
                onClick={handleSelector}
              >
                <div
                  className={
                    selector ? "select-text show w-full" : "text w-full"
                  }
                >
                  <div className="flex justify-between w-full pr-1">
                    <span> {selectValue ? selectValue : "Select"}</span>
                    <svg
                      class="h-5 w-5 caret"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path
                        d="M18 15l-6-6l-6 6h12"
                        transform="rotate(180 12 12)"
                      />
                    </svg>
                  </div>
                  {selector ? (
                    <ul className="dropdown-inner">
                      {select.map((item, i) => (
                        <li
                          key={i}
                          onClick={() => handleSelectChange(item.name)}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
              <p className="text-sm mt-2">Learn more....</p>
            </div>
            <div className="w-3/12 toolTipOuter">
              <div className="mb-4 flex w-full justify-between align-center">
                <LittleHeading className="mb-4">
                  Structure Payouts
                </LittleHeading>
                <div className="hover-icon cursor-pointer">
                  <img
                    src={QuestionMark}
                    style={{ width: "16px" }}
                    alt="Question"
                  />
                </div>
                <NFTOOLTIP heading="Structure Payouts" />
              </div>
              <div className="flex place-content-between items-center mb-4 mt-2">
                <p className="w-3/6 text-lg mr-1">You</p>
                <div className="flex items-center">
                  <RoundedInput className="outlineInputs mr-1" />
                  <p className="text-primary m-0 font-bold">%</p>
                </div>
              </div>
              <div className="flex place-content-between items-center mb-4">
                <p className="w-3/6 text-lg mr-3">Contributors</p>
                <div className="flex items-center">
                  <RoundedInput className="outlineInputs mr-1" />
                  <p className="text-primary m-0 font-bold">%</p>
                </div>
              </div>
            </div>
            <div className="w-3/12 ">
              <LittleHeading className="mb-4">Options</LittleHeading>
              <div>
                <p className="flex mt-2">
                  <label class="custom_checkbox">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                  </label>
                  <p className="ml-9">Mint NFT</p>
                </p>
              </div>
              <div>
                <p className="flex mt-2 ">
                  <label class="custom_checkbox">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                  </label>
                  <p className="ml-9">
                    Make my video free for non commercial use?
                  </p>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-6"></div>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1">
        g
        <div>
          <div className="flex justify-between space-x-9">
            <div className="w-3/12 flex">
              <div className="w-full flex flex-wrap justify-between toolTipOuter">
                <div className="w-full flex justify-between mb-4">
                  <div className="flex w-full justify-between align-center">
                    <LittleHeading>Select Chain</LittleHeading>
                    <div className="hover-icon cursor-pointer">
                      <img
                        src={QuestionMark}
                        style={{ width: "16px" }}
                        alt="QuestionImg"
                      />
                    </div>
                    <NFTOOLTIP heading="Select Chain" />
                  </div>
                </div>
                <div className="h-16 w-3/12 flex rounded-sm border border-indigo-ccc p-2 justify-center items-center chain_img_active">
                  <img
                    className="object-scale-down h-16 w-full"
                    src={FlowImage}
                    alt="FlowImage"
                  />
                </div>
                <div className="h-16 w-3/12 flex rounded-sm border border-indigo-ccc p-2 justify-center items-center"></div>
                <div className="h-16 w-3/12 flex rounded-sm border border-indigo-ccc p-2 justify-center items-center"></div>
              </div>
            </div>
            <div className="w-3/12 flex flex-wrap toolTipOuter">
              <div className="w-full flex justify-between mb-4 ">
                <LittleHeading>Set License Fee</LittleHeading>
                <div className="hover-icon cursor-pointer">
                  <img
                    src={QuestionMark}
                    style={{ width: "16px" }}
                    alt="Question"
                  />
                </div>
                <NFTOOLTIP heading="Set License Fee" />
              </div>
              <div className="flex place-content-between items-center mb-4 w-full">
                <p className="w-3/6">USD</p>
                <div className="flex items-center">
                  <p className="text-primary m-0 font-bold">$</p>
                  <RoundedInput className="outlineInputs ml-1" />
                </div>
                <p className="ml-3"></p>
              </div>
            </div>
            <div className="w-3/12 flex"></div>
          </div>
        </div>
      </div>
      {payModel && (
        <PaymentModel onNext={onNext} index={index} CloseModel={crossModel} />
      )}
      <div className="py-2">
        <div className="mt-6">
          <NextButton
            className="ml-auto"
            disabled={!platform}
            onClick={() => setPayModel(true)}
          >
            Proceed
          </NextButton>
        </div>
      </div>
    </>
  );
};

export default MintNFtAccordion;

const LittleHeading = ({ children }) => (
  <h6 className="text-xs text-primary font-semibold">{children}</h6>
);

// const YouTubeDetails = ({
//   media,
//   platformInputs,
//   contributors,
//   youtubeFeilds,
// }) => {
//   return (
//     <div className="grid gap-4 grid-cols-2">
//       <div>
//         <div className="flex space-x-3">
//           <Card className="w-1/3">
//             <CardContent className="text-center flex flex-col justify-center items-center">
//               <p className="text-xs mt-1">Mint NFT</p>
//             </CardContent>
//           </Card>
//           <div>
//             <LittleHeading>Title</LittleHeading>
//             <p className="text-sm">{youtubeFeilds.title}</p>
//           </div>
//         </div>
//         <div className="mt-4 flex space-x-6">
//           <div>
//             <LittleHeading>Length</LittleHeading>
//             <p className="text-sm">{formatAbsoluteTime(media.file.duration)}</p>
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
//       <div>
//         <LittleHeading>Contributors</LittleHeading>
//         <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">yes</div>
//       </div>
//     </div>
//   );
// };
