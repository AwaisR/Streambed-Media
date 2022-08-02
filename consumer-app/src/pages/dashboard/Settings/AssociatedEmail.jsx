import React from "react";
import { Card, CardContent } from "../../../components/layouts/Card";
import clsx from "clsx";
import PageTitle from "../shared/PageTitle";
export default function AssociatedEmail({
  LittleHeading,
  className,
  selected,
  userEmails,
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
              <PageTitle>Associated Emails</PageTitle>
            </div>
          </div>
          <hr className="my-4" />
          <div className="associated-emails-section">
            <div className="primary-emails">
              <LittleHeading>Primary Email</LittleHeading>
              <p>{userEmails.primary_email}</p>
            </div>
            <div className="additional-emails">
              <LittleHeading>Additional emails</LittleHeading>
              {userEmails &&
                userEmails.email &&
                userEmails.email.map((user, i) => <p key={i}>{user.email}</p>)}
            </div>
            <div className="actions-btn">
              <button
                className={showContent === "addEmails" ? "actions-select" : ""}
                onClick={() => ActiveButton("addEmails")}
              >
                Add Emails
              </button>
              <button
                className={showContent === "EditEmails" ? "actions-select" : ""}
                onClick={() => ActiveButton("EditEmails")}
              >
                Edit Emails
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
