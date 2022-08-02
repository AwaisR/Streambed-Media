import * as React from "react";

function TooltipIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <g data-name="Component 15">
        <g data-name="Component 35 \u2013 1">
          <text
            data-name="?"
            transform="translate(3 1)"
            fill="currentColor"
            fontSize={10}
            fontFamily="Nunito-Bold, Nunito"
            fontWeight={700}
          >
            <tspan x={2.705} y={10}>
              {"?"}
            </tspan>
          </text>
          <g data-name="Ellipse 2" fill="none" stroke="currentColor">
            <circle cx={7.5} cy={7.5} r={7.5} stroke="none" />
            <circle cx={7.5} cy={7.5} r={7} />
          </g>
        </g>
      </g>
    </svg>
  );
}

const MemoTooltipIcon = React.memo(TooltipIcon);
export default MemoTooltipIcon;
