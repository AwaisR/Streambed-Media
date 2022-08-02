import * as React from "react";

function BrowserIcon(props) {
  return (
    <svg
      data-name="Group 732"
      width="1em"
      height="1em"
      viewBox="0 0 54.511 44.997"
      {...props}
    >
      <path
        data-name="Path 104"
        d="M47.306 0h-40.1A7.213 7.213 0 00.001 7.205v30.587a7.213 7.213 0 007.205 7.2h40.1a7.213 7.213 0 007.205-7.2V7.205A7.213 7.213 0 0047.306 0zm3.872 37.792a3.877 3.877 0 01-3.872 3.872h-40.1a3.876 3.876 0 01-3.872-3.872V14.151h47.845zm0-26.974H3.333V7.206a3.877 3.877 0 013.872-3.872h40.1a3.877 3.877 0 013.872 3.872z"
        fill="#7bc0de"
      />
    </svg>
  );
}

const MemoBrowserIcon = React.memo(BrowserIcon);
export default MemoBrowserIcon;
