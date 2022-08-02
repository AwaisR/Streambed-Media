import React from "react";
import { Card, CardContent } from "../../../components/layouts/Card";
import clsx from "clsx";
import PageTitle from "../shared/PageTitle";

export default function Password({
  LittleHeading,
  className,
  selected,
  ActiveButton,
  showContent,
}) {
  return (
    <div>
      <Card
        className={clsx(className, {
          "bg-primary text-white": selected,
          "bg-white settings": !selected,
        })}
      >
        <CardContent className="py-4 px-4">
          <div className="flex justify-between items-start">
            <div className="text-sm text-current font-medium h-8">
              <PageTitle>Password</PageTitle>
            </div>
          </div>
          <hr className="my-4" />
          <div className="associated-emails-section">
            <div className="primary-emails">
              <LittleHeading>Password</LittleHeading>
              <p>••••••••••</p>
            </div>

            <div
              className={
                showContent === "ChangePassword"
                  ? "actions-btn select"
                  : "actions-btn"
              }
            >
              <button onClick={() => ActiveButton("ChangePassword")}>
                Change password
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
