import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

/**
 * Loading component for content stream
 * @returns JSX.Element
 */
export default function OverviewLoading() {
  const rects = [1, 2, 3];
  return (
    <div>
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center">
        {rects.map((react, i) => (
          <div className="space-y-4" key={i}>
            <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
              <p>
                <Skeleton width="100%" height={230} />
              </p>
            </SkeletonTheme>
            <div className={"mb-3"} />
            <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
              <Skeleton width="100%" height={130} />
            </SkeletonTheme>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
          <p>
            <Skeleton width="100%" height={366} />
          </p>
        </SkeletonTheme>
      </div>
    </div>
  );
}
