import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function LineChartComp({ cardDisplay, data, type }) {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      {!cardDisplay && <XAxis dataKey="name" />}
      {!cardDisplay && <YAxis />}
      {!cardDisplay && <Tooltip />}
      {/* {!cardDisplay && <Legend />} */}
      <Line
        type="monotone"
        dataKey={`${type}`}
        stroke="#0099CD"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}
export default LineChartComp;
