import * as React from "react";

function BigAnalyticsIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 67.729 73.175" {...props}>
      <g
        data-name="Group 677"
        transform="translate(-661.669 -269.854)"
        fill="currentColor"
      >
        <rect
          data-name="Rectangle 224"
          width={7.18}
          height={32.016}
          rx={3.158}
          transform="rotate(-180 364.699 171.514)"
        />
        <rect
          data-name="Rectangle 225"
          width={7.18}
          height={73.175}
          rx={3.158}
          transform="rotate(-180 357.13 171.514)"
        />
        <rect
          data-name="Rectangle 226"
          width={7.18}
          height={60.581}
          rx={3.158}
          transform="rotate(-180 349.562 171.514)"
        />
        <rect
          data-name="Rectangle 227"
          width={7.18}
          height={60.581}
          rx={3.158}
          transform="rotate(-180 341.993 171.514)"
        />
        <rect
          data-name="Rectangle 228"
          width={7.18}
          height={42.408}
          rx={3.158}
          transform="rotate(-180 334.425 171.514)"
        />
      </g>
    </svg>
  );
}

const MemoBigAnalyticsIcon = React.memo(BigAnalyticsIcon);
export default MemoBigAnalyticsIcon;
