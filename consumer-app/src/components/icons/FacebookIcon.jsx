import * as React from "react";

function FacebookIcon(props) {
  return (
    <svg
      data-name="Group 805"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <defs>
        <clipPath id="prefix__a">
          <path data-name="Rectangle 489" fill="none" d="M0 0h30v30H0z" />
        </clipPath>
      </defs>
      <g data-name="Group 804" clipPath="url(#prefix__a)">
        <path
          data-name="Path 233"
          d="M30 15a15 15 0 10-17.344 14.818V19.336H8.848V15h3.809v-3.3c0-3.759 2.239-5.836 5.666-5.836a23.067 23.067 0 013.358.293v3.687h-1.893a2.168 2.168 0 00-2.444 2.342V15H21.5l-.665 4.336h-3.5v10.482A15 15 0 0030 15"
          fill="#1877f2"
        />
        <path
          data-name="Path 234"
          d="M20.839 19.336L21.504 15h-4.156v-2.814a2.168 2.168 0 012.444-2.342h1.891V6.153a23.067 23.067 0 00-3.358-.293c-3.426 0-5.666 2.077-5.666 5.836v3.3H8.848v4.336h3.809v10.482a15.156 15.156 0 004.688 0V19.336z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

const MemoFacebookIcon = React.memo(FacebookIcon);
export default MemoFacebookIcon;
