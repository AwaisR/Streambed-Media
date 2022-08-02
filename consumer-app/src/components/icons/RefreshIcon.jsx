import * as React from "react";

function RefreshIcon(props) {
  return (
    <svg
      data-name="Group 546"
      width="1em"
      height="1em"
      viewBox="0 0 37.524 39"
      {...props}
    >
      <path
        data-name="Path 142"
        d="M17.043 10.098c-1.388 0-2.619-.029-3.85.009a16.435 16.435 0 00-3.133.24 7.309 7.309 0 00-5.682 6.805 31.643 31.643 0 00.046 5.055 7.05 7.05 0 004.433 6.021 2.334 2.334 0 011.192 1.538 1.908 1.908 0 01-.32 1.8 2.132 2.132 0 01-2.579.746A11.546 11.546 0 01.008 21.786c-.014-1.57-.018-3.142 0-4.711A11.444 11.444 0 0110.443 5.868c1.993-.158 4.006-.068 6.01-.09h.525a3.977 3.977 0 00-.256-.341c-.61-.642-1.232-1.273-1.835-1.921a1.423 1.423 0 01.017-2.1c.323-.339.651-.673.995-.991a1.4 1.4 0 012.024.023q3.12 3.223 6.208 6.478a1.516 1.516 0 01-.025 2.094q-3.088 3.219-6.2 6.415a1.412 1.412 0 01-2.1.032c-.317-.3-.62-.609-.922-.921a1.435 1.435 0 01-.027-2.173c.686-.729 1.386-1.442 2.186-2.275z"
        fill="currentColor"
      />
      <path
        data-name="Path 143"
        d="M20.521 33.222c.742.765 1.39 1.43 2.035 2.1a1.494 1.494 0 01-.008 2.424c-.235.237-.471.474-.709.708a1.459 1.459 0 01-2.315-.043q-2.55-2.659-5.1-5.321c-.3-.314-.608-.621-.9-.94a1.544 1.544 0 01-.024-2.171q3.086-3.221 6.2-6.415a1.41 1.41 0 012.1-.017c.328.308.646.629.957.956a1.432 1.432 0 01.013 2.1c-.629.669-1.275 1.323-1.912 1.986-.076.079-.142.168-.279.332h.968c1.736-.026 3.483.059 5.205-.1a7.285 7.285 0 006.42-6.713 33.947 33.947 0 00-.075-5.6 7.026 7.026 0 00-4.219-5.7 2.289 2.289 0 01-1.423-2.494 2.13 2.13 0 012.848-1.653 10.775 10.775 0 015.114 4.03 11.042 11.042 0 012.1 6.518c0 1.987.064 3.984-.119 5.956a11.376 11.376 0 01-9.425 9.848 43.839 43.839 0 01-4.9.207c-.8.017-1.601.002-2.552.002z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoRefreshIcon = React.memo(RefreshIcon);
export default MemoRefreshIcon;