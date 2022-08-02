import * as React from "react";

function ProfileIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25.176 28" {...props}>
      <g data-name="Group 753">
        <g data-name="Group 751">
          <path
            data-name="Path 207"
            d="M12.588 11.885a5.944 5.944 0 115.944-5.943 5.95 5.95 0 01-5.944 5.943zm0-9.733a3.79 3.79 0 103.789 3.79 3.794 3.794 0 00-3.789-3.788z"
          />
        </g>
        <g data-name="Group 752">
          <path
            data-name="Path 208"
            d="M12.588 28A20.438 20.438 0 01.562 24.118l-.562-.4.136-.68a12.7 12.7 0 0124.9 0l.136.68-.562.4A20.438 20.438 0 0112.588 28zm-10.18-5.223a18.418 18.418 0 0020.361 0 10.548 10.548 0 00-20.361 0z"
          />
        </g>
      </g>
    </svg>
  );
}

const MemoProfileIcon = React.memo(ProfileIcon);
export default MemoProfileIcon;
