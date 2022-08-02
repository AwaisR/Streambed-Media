import React from "react";

export default function NFTOOLTIP({ heading }) {
  return (
    <div className="nfTooltip h-full absolute">
      <div className="flex w-full justify-between">
        <h4 className="text-xs text-primary font-semibold mb-2">{heading}</h4>
        <svg
          class="h-4 w-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p>info</p>
    </div>
  );
}
