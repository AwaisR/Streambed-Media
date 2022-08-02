import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Card, CardContent } from "../../../components/layouts/Card";
/**
 * Loading component for content stream
 * @returns JSX.Element
 */
export default function AnalyticsLoading() {
  const rects = [1, 2, 3, 4];
  return (
    <div>
      <Card className="bg-white">
        <CardContent>
          <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
            <p>
              <Skeleton width="100%" height={230} />
            </p>
          </SkeletonTheme>
        </CardContent>
      </Card>
      <hr className="my-6" />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {rects.map((react, i) => (
          <div className="space-y-4" key={i}>
            <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
              <p className={"overflow-hidden rounded-3xl"}>
                <Skeleton width="100%" height={150} />
              </p>
            </SkeletonTheme>
          </div>
        ))}
      </div>
      <div className="mt-3" />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {rects.map((react, i) => (
          <div className="space-y-4" key={i}>
            <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
              <p className={"overflow-hidden rounded-3xl"}>
                <Skeleton width="100%" height={150} />
              </p>
            </SkeletonTheme>
          </div>
        ))}
      </div>
    </div>
  );
}
