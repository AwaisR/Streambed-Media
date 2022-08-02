import React from "react";

export default function Loader({ width, height, color, borderRightColor }) {
  return (
    <div class="text-center custom-loader">
      <div
        class="spinner-border"
        style={{
          width: width,
          height: height,
          borderColor: color,
          borderRightColor: borderRightColor,
        }}
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}
