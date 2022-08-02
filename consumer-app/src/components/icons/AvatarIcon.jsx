import * as React from "react";

function AvatarIcon(props) {
  return (
    <svg
      data-name="Component 69 \u2013 1"
      width="1em"
      height="1em"
      viewBox="0 0 70.984 70.984"
      {...props}
    >
      <g data-name="Group 541">
        <g data-name="Ellipse 5" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx={35.492} cy={35.492} r={35.492} stroke="none" />
          <circle cx={35.492} cy={35.492} r={34.492} />
        </g>
        <path
          data-name="Icon awesome-user-circle"
          d="M35.821 7.24a28.091 28.091 0 1028.091 28.091A28.086 28.086 0 0035.821 7.24zm0 10.874a9.968 9.968 0 11-9.968 9.964 9.968 9.968 0 019.968-9.964zm0 38.965a21.705 21.705 0 01-16.591-7.725 12.629 12.629 0 0111.154-6.776 2.772 2.772 0 01.8.125 15 15 0 004.633.782 14.94 14.94 0 004.633-.782 2.772 2.772 0 01.8-.125 12.629 12.629 0 0111.157 6.774 21.706 21.706 0 01-16.586 7.726z"
          fill="#9b9b9b"
        />
      </g>
    </svg>
  );
}

const MemoAvatarIcon = React.memo(AvatarIcon);
export default MemoAvatarIcon;
