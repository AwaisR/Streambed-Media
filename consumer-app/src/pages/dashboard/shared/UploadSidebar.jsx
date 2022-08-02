import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import { Card, CardContent } from "../../../components/layouts/Card";

const UploadSidebar = ({ step }) => {
  return (
    <div className="w-full flex flex-col py-6 min-h-screen bg-white px-6 text-copy">
      <h2 className="text-lg mt-2 mb-3">Upload Progress</h2>

      <Card className="flex-1 flex flex-col justify-between">
        <CardContent className="relative h-full">
          <div className="py-4">
            <StepBlock label="Select Platform" index={1} step={step} />
            <StepBlock label="Select Media" index={2} step={step} />
            <StepBlock label="Platform Inputs" index={3} step={step} />
            <StepBlock label="Identify Contributors" index={4} step={step} />
            <StepBlock label="Set Terms & Mint NFT" index={5} step={step} />
            <StepBlock label="Verify & Post" index={6} step={step} />
            <StepBlock label="View" index={7} step={step} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

UploadSidebar.propTypes = {
  step: PropTypes.number.isRequired,
};

const StepBlock = ({ label, index, step }) => (
  <div
    className={clsx("flex-1 ml-6 h-24 border-dotted border-copy", {
      "border-l": index !== 7,
    })}
  >
    <div className="flex items-center justify-start text-base">
      <h2
        className={clsx(
          "mr-3 font-semibold w-12 h-12 flex items-center justify-center rounded-full -ml-6",
          {
            "bg-gray-300 text-gray-100": step !== index && step < index,
            "bg-white text-copy border-4 border-primary": step === index,
            "bg-primary": step > index,
          }
        )}
      >
        {step > index ? (
          <CheckIcon className="w-4 h-auto" />
        ) : (
          index
        )}
      </h2>
      <p
        className={clsx("flex-1", {
          "text-gray-300": step !== index && step < index,
          "text-copy": step >= index,
        })}
      >
        {label}
      </p>
    </div>
  </div>
);

const CheckIcon = (args) => (
  <svg
    width="26.503"
    height="19.383"
    viewBox="0 0 26.503 19.383"
    {...args}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectangle_461"
          data-name="Rectangle 461"
          width="26.503"
          height="19.383"
          fill="#fff"
        />
      </clipPath>
    </defs>
    <g id="Group_770" data-name="Group 770" transform="translate(0 0)">
      <g
        id="Group_769"
        data-name="Group 769"
        transform="translate(0 0)"
        clipPath="url(#clip-path)"
      >
        <path
          id="Path_225"
          data-name="Path 225"
          d="M22.221.735,9.628,13.327,4.282,7.981A2.508,2.508,0,0,0,.735,11.529l7.12,7.12a2.507,2.507,0,0,0,3.547,0L25.768,4.282A2.508,2.508,0,0,0,22.221.735"
          transform="translate(0 0)"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
);

export default UploadSidebar;
