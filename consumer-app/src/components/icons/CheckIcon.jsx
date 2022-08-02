import * as React from "react";

function CheckIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 23 23" {...props}>
      <g data-name="Group 786">
        <g data-name="Group 542">
          <circle
            data-name="Ellipse 12"
            cx={11.5}
            cy={11.5}
            r={11.5}
            fill="#fff"
          />
        </g>
        <path
          data-name="Icon awesome-check-circle"
          d="M23.001 11.501a11.5 11.5 0 11-11.5-11.5 11.5 11.5 0 0111.5 11.5zm-12.83 6.089l8.532-8.532a.742.742 0 000-1.049l-1.05-1.05a.742.742 0 00-1.049 0l-6.958 6.958-3.249-3.248a.742.742 0 00-1.049 0l-1.05 1.049a.742.742 0 000 1.049l4.823 4.823a.742.742 0 001.049 0z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

const MemoCheckIcon = React.memo(CheckIcon);
export default MemoCheckIcon;
