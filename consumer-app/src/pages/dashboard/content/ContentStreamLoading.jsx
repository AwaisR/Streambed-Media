import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Card, CardContent } from "../../../components/layouts/Card";

/**
 * Loading component for content stream
 * @returns JSX.Element
 */
export default function ContentStreamLoading() {
  const rects = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <div>
      {/* {rects.map((rect) => (
        <div key={rect} className="flex lg:space-x-2">
          <div className="w-4/5">
            <Skeleton width="100%" height={100} />
          </div>
          <div className="w-1/5 hidden lg:flex lg:flex-col lg:space-y-1">
            <Skeleton width="100%" height={45} />
            <Skeleton width="100%" height={45} />
          </div>
        </div>
      ))} */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {rects.map((react, i) => (
          <div className="w-full space-y-3 plate-form-content" key={i}>
            <Card className="w-full relative h-full">
              <CardContent className="flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <SkeletonTheme color="#fff" highlightColor="#f3f4f6">
                    <p className={"overflow-hidden rounded-3xl"}>
                      <Skeleton width="100%" height={150} />
                    </p>
                  </SkeletonTheme>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
