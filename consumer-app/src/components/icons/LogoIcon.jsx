import * as React from "react";

function LogoIcon(props) {
  return (
    <svg width={51.776} height={55.449} {...props}>
      <g data-name="Component 69 \u2013 2" fill="#7bc0de">
        <g data-name="Group 19">
          <path
            data-name="Path 9"
            d="M50.374 6.274l1.4-5.236a30.431 30.431 0 00-37.226 21.5l5.238 1.4A25 25 0 0150.374 6.274z"
          />
          <path
            data-name="Path 10"
            d="M47.895 15.529l1.4-5.238a20.841 20.841 0 00-25.493 14.724l5.238 1.4a15.41 15.41 0 0118.855-10.886z"
          />
          <path
            data-name="Path 11"
            d="M45.413 24.784l1.4-5.238a11.248 11.248 0 00-13.759 7.947l5.238 1.4a5.82 5.82 0 017.121-4.109z"
          />
        </g>
        <g data-name="Group 20">
          <path
            data-name="Path 12"
            d="M1.402 49.173l-1.4 5.238a30.433 30.433 0 0037.226-21.5l-5.237-1.4A25 25 0 011.402 49.173z"
          />
          <path
            data-name="Path 13"
            d="M3.881 39.919l-1.4 5.238a20.84 20.84 0 0025.493-14.725l-5.238-1.4A15.413 15.413 0 013.881 39.919z"
          />
          <path
            data-name="Path 14"
            d="M6.359 30.664l-1.4 5.238a11.249 11.249 0 0013.759-7.947l-5.237-1.4a5.821 5.821 0 01-7.122 4.109z"
          />
        </g>
      </g>
    </svg>
  );
}

const MemoLogoIcon = React.memo(LogoIcon);
export default MemoLogoIcon;
