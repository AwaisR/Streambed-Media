import * as React from "react";

function ArrowIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 12" {...props}>
      <path data-name="Polygon 31" d="M12 12L0 0h24z" />
    </svg>
  );
}

const MemoArrowIcon = React.memo(ArrowIcon);
export default MemoArrowIcon;
