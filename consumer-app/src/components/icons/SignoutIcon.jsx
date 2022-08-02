import * as React from "react";

function SignoutIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 28 27.999" {...props}>
      <path
        data-name="Path 210"
        d="M0 13.999a14 14 0 1014-14 14 14 0 00-14 14zm25.8-1.076H12.221l3.85-3.85a1.076 1.076 0 10-1.522-1.522l-5.687 5.687a1.046 1.046 0 00-.135.165c-.017.025-.029.053-.044.08s-.04.068-.055.106a1.075 1.075 0 00-.033.107c-.009.031-.021.061-.027.094a1.068 1.068 0 000 .421c.006.032.018.062.027.093a1.07 1.07 0 00.033.108c.016.037.037.07.055.106s.026.054.044.08a1.108 1.108 0 00.135.165l5.687 5.687a1.076 1.076 0 101.522-1.522l-3.85-3.85h13.574a11.847 11.847 0 110-2.153z"
      />
    </svg>
  );
}

const MemoSignoutIcon = React.memo(SignoutIcon);
export default MemoSignoutIcon;