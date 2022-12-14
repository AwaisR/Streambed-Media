import * as React from "react";

function ExclamationIcon(props) {
  return (
    <svg
      className="prefix__h-6 prefix__w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

const MemoExclamationIcon = React.memo(ExclamationIcon);
export default MemoExclamationIcon;
