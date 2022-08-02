import React from "react";
import { Card, CardContent } from "../../../components/layouts/Card";
import clsx from "clsx";
import PageTitle from "../shared/PageTitle";
export default function BackupAccount({
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
              <PageTitle>Backup Account</PageTitle>
            </div>
          </div>
          <hr className="my-4" />
          <div className="associated-emails-section">
            <div className="backup-account">
              <p>
                Backing up your account will generate your mnemonic, which can
                be used to recover your account and video data at a later date
                if you deactivate your account.
              </p>
            </div>

            <div
              className={
                showContent === "BackupAccount"
                  ? "actions-btn select"
                  : "actions-btn"
              }
            >
              <button onClick={() => ActiveButton("BackupAccount")}>
                Backup account
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
