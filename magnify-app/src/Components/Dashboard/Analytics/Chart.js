import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
export const Chart = ({ totalView, duration, tabClick, ChangeGraphName }) => {
  const state = useSelector((state) => state.Analytics);
  const [dataKey, setDataKey] = useState("");
  const { CompanyAnylatics } = state;
  switch (tabClick) {
    case "REACH":
      var data =
        duration.length &&
        duration.map((reach) => {
          return {
            Reach: reach.views,
            date: reach.title,
          };
        });

      break;
    case "POST-ENGAGEMENT":
      var data =
        duration.length &&
        duration.map((reach) => {
          return {
            POSTENGAGEMENT: reach.comments,
            date: reach.title,
          };
        });
      break;
    case "SHARES":
      var data =
        duration.length &&
        duration.map((reach) => {
          return {
            Shares: reach.shares,
            date: reach.title,
          };
        });
      break;
    case "ContributionReach":
      var data =
        duration.length &&
        duration.map((reach) => {
          return {
            ContributionReach: reach.views,
            date: reach.title,
          };
        });
      break;
    case "ContributionEngagement":
      var data =
        duration.length &&
        duration.map((reach) => {
          return {
            ContributionEngagement: reach.comments,
            date: reach.title,
          };
        });
      break;
    case "ContributionShares":
      var data =
        duration.length &&
        duration.map((reach) => {
          return {
            ContributionShares: reach.shares,
            date: reach.title,
          };
        });
      break;
    default:
      break;
  }
  useEffect(() => {
    switch (tabClick) {
      case "REACH":
        setDataKey("Reach");
        ChangeGraphName("Reach");
        break;
      case "POST-ENGAGEMENT":
        setDataKey("POSTENGAGEMENT");
        ChangeGraphName("POST-ENGAGEMENT");
        break;
      case "POST-ENGAGEMENT":
        setDataKey("Comments");
        break;
      case "SHARES":
        setDataKey("Shares");
        ChangeGraphName("Shares");
        break;
      case "ContributionReach":
        setDataKey("ContributionReach");
        ChangeGraphName("Contribution-Reach");
        break;
      case "ContributionEngagement":
        setDataKey("ContributionEngagement");
        ChangeGraphName("Contribution-Engagement");
        break;
      case "ContributionShares":
        setDataKey("ContributionShares");
        ChangeGraphName("Contribution-Shares");
        break;
      default:
        break;
    }
  }, [tabClick]);
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#56123D"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
