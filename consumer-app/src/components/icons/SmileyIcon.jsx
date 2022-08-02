import * as React from "react";

function SmileyIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 28 28" {...props}>
      <g
        data-name="Icon feather-smile"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path data-name="Path 99" d="M27 14A13 13 0 1114 1a13 13 0 0113 13z" />
        <path
          data-name="Path 100"
          d="M8 16.333a8.1 8.1 0 006 3 8.1 8.1 0 006-3"
        />
        <path data-name="Path 101" d="M10.099 10.1h.015" />
        <path data-name="Path 102" d="M17.899 10.1h.015" />
      </g>
    </svg>
  );
}

const MemoSmileyIcon = React.memo(SmileyIcon);
export default MemoSmileyIcon;
