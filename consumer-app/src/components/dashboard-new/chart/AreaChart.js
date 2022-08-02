import React, { useEffect } from "react";
import {
  AreaChart,
  linearGradient,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
function AreaChartComp({ cardDisplay, data, type }) {
  return (
    <div>
      {" "}
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0099CD" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0099CD" stopOpacity={0} />
          </linearGradient>
        </defs>
        {!cardDisplay && <XAxis dataKey="name" />}
        {!cardDisplay && <YAxis />}
        <CartesianGrid strokeDasharray="3 3" />
        {!cardDisplay && <Tooltip />}
        <Area
          type="monotone"
          dataKey={`${type}`}
          stroke="#0099CD"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </div>
  );
}

export default AreaChartComp;
