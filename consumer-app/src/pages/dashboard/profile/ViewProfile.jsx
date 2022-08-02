import React from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

import { Card, CardContent } from "../../../components/layouts/Card";
import PageTitle from "../shared/PageTitle";
import LittleHeading from "../shared/LittleHeading";

// icons
import EditIcon from "../../../components/icons/EditIcon";

import { PLATFORM_ICON_MAP } from "../../../components/helpers/platforms";
import Profile from "./Profile";

function ViewScreen({ user, memberSince, linkedAccounts, linkableAccounts }) {
  return (
    <>
      <PageTitle>Profile</PageTitle>

      <div className="mt-6">
        <Card className="bg-white">
          <CardContent>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Account Information</h3>
              <Link
                to="/profile/edit"
                className="flex items-center font-light cursor-pointer"
              >
                Edit Profile <EditIcon className="ml-1" />
              </Link>
            </div>

            <hr className="my-3" />

            <div className="flex lg:flex-row-reverse justify-between">
              <div className="w-3/12 lg:w-3/12">
                <LittleHeading>Profile Photo</LittleHeading>
                <Card className="w-32 h-32 flex items-center justify-center">
                  <img
                    src={user.profileImage ? user.profileImage : ""}
                    alt="Avatar"
                    className="block rounded-full w-28 h-28 object-cover"
                  />
                </Card>
              </div>

              <div className="w-8/12 lg:w-8/12 space-y-6">
                <div>
                  <LittleHeading>Display Name</LittleHeading>
                  <p className="text-md lg:text-lg font-medium">
                    {user.displayName}
                  </p>
                </div>

                <div>
                  <LittleHeading>Description</LittleHeading>
                  <p className="text-xs lg:text-sm">{user.about || ""}</p>
                </div>

                <div>
                  <LittleHeading>Account Created</LittleHeading>
                  <p className="text-xs lg:text-sm">
                    {format(memberSince, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white mt-4">
          <CardContent>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Linked Account</h3>
              <Link
                to="/profile/linked-accounts"
                className="flex items-center font-light"
              >
                Edit Linked Account <EditIcon className="ml-1" />
              </Link>
            </div>

            <hr className="my-3" />

            <div className="space-y-4">
              <div>
                <LittleHeading>Linked Accounts</LittleHeading>
                <div>
                  {linkedAccounts.length ? (
                    linkedAccounts.map(({ platform, username }) => (
                      <Card
                        key={platform}
                        className="inline-block mx-1 my-1 w-36"
                      >
                        <CardContent className="flex flex-col justify-center items-center space-y-2">
                          {PLATFORM_ICON_MAP[platform]({
                            className: "w-20 h-8",
                          })}
                          <span className="text-sm text-primary">
                            {username}
                          </span>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="my-1">
                      You have not linked any of your accounts yet.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <LittleHeading>Linkable Platforms</LittleHeading>
                <div>
                  {linkableAccounts.map(({ platform }) => (
                    <Card
                      key={platform}
                      className="inline-block mx-1 my-1 w-36"
                    >
                      <CardContent className="flex flex-col justify-center items-center space-y-2">
                        {PLATFORM_ICON_MAP[platform]({
                          className: "w-20 h-8",
                        })}
                        <span className="text-sm text-gray-300">
                          Not linked
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function ViewProfile() {
  return <Profile Screen={ViewScreen} />;
}
