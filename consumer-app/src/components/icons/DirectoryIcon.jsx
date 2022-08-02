import * as React from "react";

function DirectoryIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 38.999 38.998" {...props}>
      <g data-name="Group 567" fill="currentColor">
        <circle
          data-name="Ellipse 40"
          cx={2.284}
          cy={2.284}
          transform="rotate(-13.282 35.792 -23.55)"
          r={2.284}
        />
        <path
          data-name="Path 153"
          d="M9.116 13.813a2.284 2.284 0 00-2.284 2.284 2.284 2.284 0 002.284 2.283 2.284 2.284 0 002.284-2.283 2.284 2.284 0 00-2.284-2.284z"
        />
        <circle
          data-name="Ellipse 41"
          cx={2.284}
          cy={2.284}
          r={2.284}
          transform="rotate(-45 30.588 4.346)"
        />
        <circle
          data-name="Ellipse 42"
          cx={2.284}
          cy={2.284}
          transform="rotate(-13.282 123.472 -13.342)"
          r={2.284}
        />
        <path
          data-name="Path 154"
          d="M29.884 7.007H16.311a2.284 2.284 0 00-2.284 2.284 2.283 2.283 0 002.284 2.284h13.572a2.284 2.284 0 002.284-2.284 2.284 2.284 0 00-2.283-2.284z"
        />
        <rect
          data-name="Rectangle 307"
          width={18.139}
          height={4.567}
          rx={2.284}
          transform="translate(14.028 13.813)"
        />
        <path
          data-name="Path 155"
          d="M29.884 20.618H16.311a2.283 2.283 0 00-2.284 2.283 2.283 2.283 0 002.284 2.283h13.572a2.283 2.283 0 002.284-2.283 2.283 2.283 0 00-2.283-2.283z"
        />
        <path
          data-name="Path 156"
          d="M29.884 27.424H16.311a2.283 2.283 0 00-2.284 2.284 2.283 2.283 0 002.284 2.284h13.572a2.284 2.284 0 002.284-2.284 2.283 2.283 0 00-2.283-2.284z"
        />
        <path
          data-name="Path 157"
          d="M32.754 0H6.244A6.252 6.252 0 00-.001 6.244v26.509a6.252 6.252 0 006.245 6.244h26.51a6.251 6.251 0 006.244-6.244V6.244A6.251 6.251 0 0032.754 0zm3.356 32.754a3.36 3.36 0 01-3.356 3.356H6.244a3.36 3.36 0 01-3.356-3.356V6.245a3.359 3.359 0 013.356-3.356h26.51a3.359 3.359 0 013.356 3.356z"
        />
      </g>
    </svg>
  );
}

const MemoDirectoryIcon = React.memo(DirectoryIcon);
export default MemoDirectoryIcon;
