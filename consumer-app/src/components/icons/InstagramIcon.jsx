import * as React from "react";

function InstagramIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 30 30" {...props}>
      <g data-name="Group 734" transform="translate(-4.079 -4.079)">
        <path
          data-name="Path 175"
          d="M19.079 6.782c4.005 0 4.48.015 6.061.087a8.3 8.3 0 012.785.516 4.968 4.968 0 012.847 2.847 8.3 8.3 0 01.516 2.785c.072 1.582.087 2.056.087 6.061s-.015 4.48-.087 6.061a8.3 8.3 0 01-.516 2.785 4.968 4.968 0 01-2.847 2.847 8.3 8.3 0 01-2.785.516c-1.581.072-2.056.087-6.061.087s-4.48-.015-6.061-.087a8.3 8.3 0 01-2.785-.516 4.968 4.968 0 01-2.847-2.847 8.3 8.3 0 01-.516-2.785c-.072-1.582-.087-2.056-.087-6.061s.015-4.48.087-6.061a8.3 8.3 0 01.516-2.785 4.968 4.968 0 012.847-2.847 8.3 8.3 0 012.785-.516c1.582-.072 2.056-.087 6.061-.087m0-2.7c-4.074 0-4.585.017-6.184.09a11.01 11.01 0 00-3.641.7 7.67 7.67 0 00-4.387 4.381 11.01 11.01 0 00-.7 3.641c-.073 1.6-.09 2.111-.09 6.184s.017 4.585.09 6.184a11.01 11.01 0 00.7 3.641 7.67 7.67 0 004.387 4.387 11.01 11.01 0 003.641.7c1.6.073 2.111.09 6.184.09s4.585-.017 6.184-.09a11.01 11.01 0 003.641-.7 7.67 7.67 0 004.387-4.39 11.01 11.01 0 00.7-3.641c.073-1.6.09-2.111.09-6.184s-.017-4.585-.09-6.184a11.01 11.01 0 00-.7-3.641A7.67 7.67 0 0028.9 4.867a11.01 11.01 0 00-3.641-.7c-1.6-.073-2.111-.09-6.184-.09z"
        />
        <path
          data-name="Path 176"
          d="M19.079 11.376a7.7 7.7 0 107.7 7.7 7.7 7.7 0 00-7.7-7.7zm0 12.7a5 5 0 115-5 5 5 0 01-5 5.003z"
        />
        <circle
          data-name="Ellipse 43"
          cx={1.8}
          cy={1.8}
          r={1.8}
          transform="translate(25.286 9.272)"
        />
      </g>
    </svg>
  );
}

const MemoInstagramIcon = React.memo(InstagramIcon);
export default MemoInstagramIcon;