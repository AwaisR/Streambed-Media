import * as React from "react";

function SearchIcon(props) {
  return (
    <svg
      data-name="Group 531"
      width="1em"
      height="1em"
      viewBox="0 0 20 20.057"
      {...props}
    >
      <path
        data-name="Path 116"
        d="M16.298 14.334a1.208 1.208 0 01.208.142q1.531 1.551 3.056 3.107a1.4 1.4 0 01.314 1.587 1.439 1.439 0 01-1.358.887 1.476 1.476 0 01-1.013-.477q-1.513-1.518-3.03-3.032a2.381 2.381 0 01-.163-.2 9.087 9.087 0 111.986-2.016zm-1.13-5.314a6.152 6.152 0 10-6.127 6.153 6.167 6.167 0 006.128-6.153z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSearchIcon = React.memo(SearchIcon);
export default MemoSearchIcon;
