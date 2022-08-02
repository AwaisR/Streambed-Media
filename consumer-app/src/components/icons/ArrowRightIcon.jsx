import * as React from "react";

function ArrowRightIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 10.971 15.812" {...props}>
      <defs>
        <clipPath id="prefix__a">
          <path
            data-name="Rectangle 460"
            fill="currentColor"
            d="M0 0h10.971v15.812H0z"
          />
        </clipPath>
      </defs>
      <g data-name="Group 768">
        <g data-name="Group 767" clipPath="url(#prefix__a)">
          <path
            data-name="Path 224"
            d="M.372.889a2.041 2.041 0 00.318 2.7c1.367 1.38 2.744 2.75 4.117 4.123l.359.359-.34.339-3.812 3.813a2.054 2.054 0 102.909 2.888q1.908-1.9 3.813-3.812l.329-.329 2.905-2.9-2.9-2.9-.37-.378Q5.708 2.8 3.719.815a5.243 5.243 0 00-.413-.381A2.031 2.031 0 00.372.889"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}

const MemoArrowRightIcon = React.memo(ArrowRightIcon);
export default MemoArrowRightIcon;
