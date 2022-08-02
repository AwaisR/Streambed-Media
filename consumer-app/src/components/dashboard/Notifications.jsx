import React, { useMemo } from "react";
import clsx from "clsx";
import { styled } from "twin.macro";
import moment from "moment";
import { Card } from "../layouts/Card";

const Arrow = styled.div`
  position: relative;
  width: 15px;
  height: 15px;
  background: #fff;
  border-left: 1px solid transparent;
  border-bottom: 1px solid #fff;
  border-right: 1px solid transparent;
  margin-left: auto;
  margin-right: 1.2rem;
  margin-bottom: -1px;
  z-index: 5;

  &::before {
    display: block;
    box-sizing: border-box;
    border-right: 1px solid transparent;
  }

  &::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    border-left: 1px solid;
    border-top: 1px solid;
    border-bottom: 1px solid transparent;
    transform: rotate(45deg) skew(10deg, 10deg);
    left: -1px;
    bottom: -8px;
  }
`;

const formatMessage = (msg) => {
  const match = /(@[a-z0-9_]+)/gi.exec(msg);
  if (match) {
    console.log("match", match);
    const username = match[0];
    const sep = "-----";
    const [left, right] = msg.replace(username, sep).split(sep);
    console.log("username", username);
    return (
      <span>
        {left}
        <span className="text-primary">{username}</span>
        {right}
      </span>
    );
  } else {
    return <span>{msg}</span>;
  }
};

const Notifications = ({ notifications }) => {
  const notifs = useMemo(() => {
    return notifications.map(({ activity, user }) => ({
      activity: formatMessage(
        `${user.displayName} ${activity.activity} ${activity.platform} `
      ),
      createdAt: activity.dateCreated,
    }));
  }, [notifications]);

  return (
    <div className="relative w-full">
      <Arrow className="text-primary" />
      <Card
        className="border border-primary absolute left-0 bg-white overflow-y-auto pb-6 "
        style={{ width: "100%", zIndex: "9999" }}
      >
        <h3 className="text-base text-copy mb-1 px-3 py-3">Notifications</h3>

        {notifs.map((notif, i) => (
          <div
            key={i}
            className={clsx("flex justify-between text-xs px-3 py-2", {
              "bg-gray-100": i % 2 === 0,
            })}
          >
            <span className="text-copy w-9/12">{notif.activity}</span>
            <div className="text-gray-400 text-right">
              <span className="block">
                {moment(notif.createdAt).format("ll")}
              </span>
              <span>{moment(notif.createdAt).format("HH:mm ")}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Notifications;
