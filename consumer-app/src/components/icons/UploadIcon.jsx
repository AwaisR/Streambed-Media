import * as React from "react";

function UploadIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 27.999 28" {...props}>
      <path
        data-name="Path 200"
        fill="currentColor"
        d="M14 0a14 14 0 1014 14A14 14 0 0014 0zm1.076 25.8V12.221l3.85 3.85a1.076 1.076 0 101.522-1.522l-5.687-5.687a1.046 1.046 0 00-.165-.135c-.025-.017-.053-.029-.08-.044s-.068-.04-.106-.055a1.075 1.075 0 00-.107-.033c-.031-.009-.061-.021-.094-.027a1.068 1.068 0 00-.421 0c-.032.006-.062.018-.093.027a1.07 1.07 0 00-.108.033c-.037.016-.07.037-.106.055s-.054.026-.08.044a1.108 1.108 0 00-.165.135l-5.687 5.687a1.076 1.076 0 101.522 1.522l3.85-3.85v13.574a11.847 11.847 0 112.153 0z"
      />
    </svg>
  );
}

const MemoUploadIcon = React.memo(UploadIcon);
export default MemoUploadIcon;
