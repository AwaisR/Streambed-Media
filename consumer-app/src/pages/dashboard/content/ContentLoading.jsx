import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

/**
 * Loading component for content
 * @returns JSX.Element
 */
export default function ContentLoading() {
  return (
    <SkeletonTheme color="#ddd">
      <div className="mt-2 space-y-2 flex flex-col">
        <Skeleton width="100%" height={150} />
        <Skeleton width="100%" height={45} />
        <Skeleton width="100%" height={150} />
      </div>
    </SkeletonTheme>
  );
}
