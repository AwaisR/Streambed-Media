import * as React from "react";

function PageIcons(props) {
  return (
    <svg
      class="h-8 w-8 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
      />
    </svg>
  );
}

const MemoPageIcons = React.memo(PageIcons);
export default MemoPageIcons;
