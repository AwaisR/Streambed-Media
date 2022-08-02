import * as React from "react";

function AnalyticsIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 32 28" {...props}>
      <g data-name="Group">
        <path
          data-name="Path 192"
          d="M30.83 25.66H1.171a1.17 1.17 0 100 2.34H30.83a1.17 1.17 0 100-2.34z"
        />
        <path
          data-name="Path 193"
          d="M5.74 23.321a2 2 0 002.052-1.952V9.08a2.055 2.055 0 00-4.1 0v12.289a2 2 0 002.048 1.952z"
        />
        <path
          data-name="Path 194"
          d="M16 23.321a1.9 1.9 0 002.052-1.7V1.703a2.088 2.088 0 00-4.1 0v19.914A1.9 1.9 0 0016 23.321z"
        />
        <path
          data-name="Path 195"
          d="M26.26 23.32a2 2 0 002.052-1.952V4.788a2.054 2.054 0 00-4.1 0v16.58a2 2 0 002.048 1.952z"
        />
      </g>
    </svg>
  );
}

const MemoAnalyticsIcon = React.memo(AnalyticsIcon);
export default MemoAnalyticsIcon;
