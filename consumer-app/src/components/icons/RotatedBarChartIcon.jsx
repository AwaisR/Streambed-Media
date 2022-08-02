import * as React from "react";

function RotatedBarChartIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 26.437 26" {...props}>
      <g data-name="Group 524" opacity={0.4} stroke="currentColor">
        <g data-name="Rectangle 239" fill="#fff">
          <path stroke="none" d="M1 2.5h21v8H1z" />
          <path fill="none" d="M1.5 3h20v7h-20z" />
        </g>
        <g data-name="Rectangle 240" fill="#fff">
          <path stroke="none" d="M1.437 9h25v8h-25z" />
          <path fill="none" d="M1.937 9.5h24v7h-24z" />
        </g>
        <g data-name="Rectangle 241" fill="#fff">
          <path stroke="none" d="M1 16.5h20v7H1z" />
          <path fill="none" d="M1.5 17h19v6h-19z" />
        </g>
        <g data-name="Rectangle 242" fill="#0099cd">
          <path stroke="none" d="M0 0h2v26H0z" />
          <path fill="none" d="M.5.5h1v25h-1z" />
        </g>
      </g>
    </svg>
  );
}

const MemoRotatedBarChartIcon = React.memo(RotatedBarChartIcon);
export default MemoRotatedBarChartIcon;
