import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useSelector, useDispatch } from "react-redux";

const COLORS = ["#3C629E", "#FFF"];
export default function RightSideChart({
  paidAmount,
  walletBalance,
  perAmount,
}) {
  const dispatch = useDispatch();
  const graphData = [
    { name: "Group A", value: walletBalance },
    { name: "Group B", value: perAmount },
  ];
  const state = useSelector((state) => state.Magnify);
  const { AllTransactions } = state;
  return (
    <PieChart width={160} height={160} cornerRadius={4}>
      <text
        x={78}
        y={60}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={"#707070"}
      >
        Budget
      </text>
      <text
        x={78}
        y={85}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={"#56123D"}
        style={{ fontWeight: 900 }}
      >
        ${walletBalance}
      </text>
      <text
        x={78}
        y={110}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={"#707070"}
      >
        /${paidAmount}
      </text>
      <Pie
        data={graphData}
        cx={75}
        cy={75}
        cornerRadius={10}
        innerRadius={70}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {graphData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Pie
        data={graphData}
        cx={420}
        cy={200}
        startAngle={180}
        paddingAngle={50}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {graphData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
