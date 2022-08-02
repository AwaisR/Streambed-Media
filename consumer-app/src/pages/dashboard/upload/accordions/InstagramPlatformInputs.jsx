import React from "react";

import { NextButton } from "./shared";

const InstagramPlatformInputs = ({ index, onNext }) => (
  <div className="py-2">
    <div className="text-copy text-sm font-light space-y-2">
      <p>Your post is already created! So we don’t need to input anything.</p>
      <p>Please proceed to the next step to identify your contributors.</p>
    </div>
    <div className="mt-4">
      <NextButton className="ml-auto" disabled={false} onClick={() => onNext(index + 1)}>
        Next
      </NextButton>
    </div>
  </div>
);

export default InstagramPlatformInputs;
