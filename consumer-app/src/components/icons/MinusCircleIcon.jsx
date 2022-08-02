import * as React from "react";

function MinusCircleIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 34 34" {...props}>
      <g data-name="Group 806" fill="none" stroke="currentColor" strokeWidth={2}>
        <g data-name="Ellipse 56">
          <circle cx={17} cy={17} r={17} stroke="none" />
          <circle cx={17} cy={17} r={16} />
        </g>
        <path data-name="Line 106" strokeLinecap="round" d="M7.676 17.703h18" />
      </g>
    </svg>
  );
}

const MemoMinusCircleIcon = React.memo(MinusCircleIcon);
export default MemoMinusCircleIcon;
