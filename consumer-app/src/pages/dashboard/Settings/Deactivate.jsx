import React from "react";
import { Card, CardContent } from "../../../components/layouts/Card";
import clsx from "clsx";
import PageTitle from "../shared/PageTitle";
export default function Deactivate({
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
              <PageTitle>Deactivate Account</PageTitle>
            </div>
          </div>
          <hr className="my-4" />
          <div className="associated-emails-section">
            <div className="backup-account">
              <p>
                Deactivating your account will erase all your account details
                and close it. You can recover your account and access your data
                later using the mnemonic.
              </p>
            </div>

            <div
              className={
                showContent === "Deactivate-account"
                  ? "actions-btn deactive select"
                  : "actions-btn deactive"
              }
            >
              <button onClick={() => ActiveButton("Deactivate-account")}>
                Deactivate
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
