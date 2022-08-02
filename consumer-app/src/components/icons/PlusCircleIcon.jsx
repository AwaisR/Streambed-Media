import * as React from "react";

function PlusCircleIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 34 34" {...props}>
      <g data-name="Group 765" fill="none" stroke="currentColor" strokeWidth={2}>
        <g data-name="Ellipse 56">
          <circle cx={17} cy={17} r={17} stroke="none" />
          <circle cx={17} cy={17} r={16} />
        </g>
        <path
          data-name="Line 105"
          strokeLinecap="round"
          d="M17.694 7.973v19.443"
        />
        <path
          data-name="Line 106"
          strokeLinecap="round"
          d="M7.973 17.694h19.443"
        />
      </g>
    </svg>
  );
}

const MemoPlusCircleIcon = React.memo(PlusCircleIcon);
export default MemoPlusCircleIcon;
