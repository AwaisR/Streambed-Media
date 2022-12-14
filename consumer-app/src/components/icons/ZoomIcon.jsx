import * as React from "react";

function ZoomIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 74.351 16.708" {...props}>
      <g data-name="Group 521" fill="#438cf6" fillRule="evenodd">
        <path
          data-name="Path 99"
          d="M30.137 2.446a8.315 8.315 0 00-5.91-2.443 8.354 8.354 0 105.91 2.443zm-2.36 9.461a5.006 5.006 0 110-7.08 4.992 4.992 0 010 7.078z"
        />
        <path
          data-name="Path 100"
          d="M47.68 2.446a8.359 8.359 0 100 11.821 8.315 8.315 0 000-11.821zm-2.36 9.461a5.006 5.006 0 110-7.08 4.992 4.992 0 010 7.078z"
        />
        <path
          data-name="Path 101"
          d="M3.342 16.666l.835.042h12.531l-.042-.835a2.57 2.57 0 00-2.464-2.464l-.835-.042H5.848L15.873 3.342l-.042-.835A2.525 2.525 0 0013.367.043l-.835-.042H0l.042.835A2.6 2.6 0 002.506 3.3l.835.042h7.519L.835 13.367l.042.835a2.555 2.555 0 002.465 2.464z"
        />
        <path
          data-name="Path 102"
          d="M60.525 5.013a3.661 3.661 0 01.418 1.671l.042.835v5.848l.042.835a2.57 2.57 0 002.464 2.464l.835.042V7.519l.042-.835a3.749 3.749 0 01.418-1.692 3.308 3.308 0 012.882-1.65 3.36 3.36 0 012.9 1.671 3.46 3.46 0 01.4 1.671l.042.835v5.848l.042.835a2.555 2.555 0 002.464 2.464l.835.042V6.683A147.665 147.665 0 0157.643 0a6.594 6.594 0 00-3.738 1.149A4.584 4.584 0 0050.96 0v16.708l.835-.042a2.525 2.525 0 002.464-2.464l.042-.835V7.519l.042-.835a3.592 3.592 0 01.418-1.671 3.321 3.321 0 015.764 0z"
        />
      </g>
    </svg>
  );
}

const MemoZoomIcon = React.memo(ZoomIcon);
export default MemoZoomIcon;
