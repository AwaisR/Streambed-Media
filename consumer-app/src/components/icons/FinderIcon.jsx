import * as React from "react";

function FinderIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 64.072 64.072" {...props}>
      <g data-name="Group 540">
        <g data-name="Group 539">
          <path
            data-name="Path 157"
            d="M49.534 47.999a2.054 2.054 0 01.354.242c1.734 1.755 8.3 8.346 10.023 10.112a2.367 2.367 0 01.534 2.695 2.444 2.444 0 01-2.308 1.506 2.5 2.5 0 01-1.72-.81c-1.714-1.718-8.265-8.265-9.98-9.984a4.269 4.269 0 01-.276-.336A15.433 15.433 0 1149.534 48zm-1.918-9.027a10.449 10.449 0 10-10.407 10.451 10.475 10.475 0 0010.407-10.451z"
            fill="currentColor"
          />
        </g>
        <path
          data-name="Path 158"
          d="M15.116 57.99a9.045 9.045 0 01-9.034-9.035V15.116a9.044 9.044 0 019.034-9.034h33.84a9.044 9.044 0 019.034 9.034v29.68l5.965 5.965a15.255 15.255 0 00.118-1.807V15.116A15.133 15.133 0 0048.957 0h-33.84A15.135 15.135 0 00.001 15.116v33.838a15.134 15.134 0 0015.116 15.118h30.217l-6.083-6.083z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

const MemoFinderIcon = React.memo(FinderIcon);
export default MemoFinderIcon;
