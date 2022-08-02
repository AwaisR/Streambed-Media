import * as React from "react";

function CalendarWithTimeIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 27.764 30.204" {...props}>
      <g data-name="Group 522">
        <g
          data-name="Icon feather-calendar"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path
            data-name="Path 105"
            d="M3.412 4.37h16.883a2.392 2.392 0 012.412 2.371v16.6a2.392 2.392 0 01-2.412 2.371H3.412A2.392 2.392 0 011 23.34V6.741A2.392 2.392 0 013.412 4.37z"
          />
          <path data-name="Path 106" d="M16.677 1v6.739" />
          <path data-name="Path 107" d="M7.03 1v6.739" />
          <path data-name="Path 108" d="M1 10.885h21.707" />
        </g>
        <g data-name="Group 521" transform="translate(10.425 13.356)">
          <ellipse
            data-name="Ellipse 20"
            cx={8.67}
            cy={8.424}
            rx={8.67}
            ry={8.424}
            fill="#fff"
          />
          <g
            data-name="Icon feather-clock"
            fill="none"
            stroke="#7bc0de"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <path
              data-name="Path 103"
              d="M14.834 8.343a6.256 6.256 0 11-6.255-6.269 6.262 6.262 0 016.256 6.269z"
            />
            <path data-name="Path 104" d="M8.488 4.582v3.761l2.508 1.254" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const MemoCalendarWithTimeIcon = React.memo(CalendarWithTimeIcon);
export default MemoCalendarWithTimeIcon;
