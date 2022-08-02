import * as React from "react";

function ArrowDownIcon(props) {
  return (
    <svg
      data-name="Component 56 \u2013 8"
      width="1em"
      height="1em"
      viewBox="0 0 23.06 16"
      {...props}
    >
      <defs>
        <clipPath id="prefix__a">
          <path data-name="Rectangle 460" fill="#707070" d="M0 0h16v23.06H0z" />
        </clipPath>
      </defs>
      <g data-name="Group 768">
        <g
          data-name="Group 767"
          transform="rotate(90 11.53 11.53)"
          clipPath="url(#prefix__a)"
        >
          <path
            data-name="Path 224"
            d="M.543 1.3a2.976 2.976 0 00.463 3.94c1.994 2.01 4 4.008 6 6.01l.524.523-.5.495-5.559 5.561a3 3 0 104.243 4.212q2.783-2.777 5.56-5.56l.48-.48L16 11.763l-4.229-4.229-.545-.545-5.8-5.8a7.646 7.646 0 00-.6-.556A2.963 2.963 0 00.543 1.3"
            fill="#707070"
          />
        </g>
      </g>
    </svg>
  );
}

const MemoArrowDownIcon = React.memo(ArrowDownIcon);
export default MemoArrowDownIcon;
