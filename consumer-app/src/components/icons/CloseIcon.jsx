import * as React from "react";

function CloseIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 23 23" {...props}>
      <g data-name="Group 785">
        <g data-name="Group 542">
          <circle
            data-name="Ellipse 12"
            cx={11.5}
            cy={11.5}
            r={11.5}
            fill="#fff"
          />
        </g>
        <g data-name="Group 784" transform="translate(-.152 -.07)">
          <circle
            data-name="Ellipse 12"
            cx={11.5}
            cy={11.5}
            r={11.5}
            transform="translate(.153 .07)"
            fill="#fff"
          />
          <path
            data-name="Path 176"
            d="M11.653.07a11.5 11.5 0 1011.5 11.5 11.5 11.5 0 00-11.5-11.5zm6.533 16.468l-1.565 1.564a.947.947 0 01-1.341 0l-3.627-3.626-3.627 3.626a.947.947 0 01-1.341 0l-1.564-1.564a.947.947 0 010-1.341l3.627-3.627-3.627-3.627a.947.947 0 010-1.341l1.564-1.565a.949.949 0 011.341 0l3.627 3.627 3.627-3.627a.949.949 0 011.341 0l1.565 1.565a.949.949 0 010 1.341l-3.627 3.627 3.627 3.627a.949.949 0 01-.001 1.341z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}

const MemoCloseIcon = React.memo(CloseIcon);
export default MemoCloseIcon;
