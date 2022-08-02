import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
function Overview() {
  const graphColor = "rgb(93, 184, 163)";
  const lastPoint = "rgb(153, 65, 134)";
  const [chartData, setChartData] = useState({
    labels: [
      "January 2020",
      "February 2020",
      "March 2020",
      "April 2020",
      "May 2020",
    ],
    datasets: [
      {
        label: "Statistics",
        pointLabelFontSize: 14,
        backgroundColor: [
          graphColor,
          graphColor,
          graphColor,
          graphColor,
          lastPoint,
        ],
        borderColor: graphColor,
        pointBackgroundColor: [
          graphColor,
          graphColor,
          graphColor,
          graphColor,
          lastPoint,
        ],
        pointBorderColor: [
          graphColor,
          graphColor,
          graphColor,
          graphColor,
          lastPoint,
        ],
        borderWidth: 2,
        data: [65, 59, 44, 65, 56],
        pointRadius: 8,
        pointHoverRadius: 8,
        fill: false,
      },
    ],
  });

  return (
    <div className="dashboard-content">
      <div className="charts-wrap">
        <div className="charts-container">
          <div className="row custom-gutters">
            <div className="col-xl-7">
              <div className="chart-box box-lg">
                <div className="chart-head">
                  <div className="chart-select">
                    <div className="form-group">
                      <label>Metrics 1</label>
                      <select className="form-control">
                        <option>Time period: All time</option>
                        <option>2</option>
                        <option>3</option>
                      </select>
                    </div>
                  </div>
                  <div className="chart-tag">Today’s total: 1000</div>
                </div>
                <Line data={chartData} />
              </div>
            </div>
            <div className="col-xl-5 mt-xl-0 mt-3">
              <div className="chart-box">
                <div className="chart-head">
                  <div className="chart-select">
                    <div className="form-group">
                      <label>Metrics 2</label>
                      <select className="form-control">
                        <option>Time period: All time</option>
                        <option>2</option>
                        <option>3</option>
                      </select>
                    </div>
                  </div>
                  <div className="chart-tag">Today’s total: 1000</div>
                </div>
                <Line data={chartData} />
              </div>
              <div className="chart-box">
                <div className="chart-head">
                  <div className="chart-select">
                    <div className="form-group">
                      <label>Metrics 3</label>
                      <select className="form-control">
                        <option>Time period: All time</option>
                        <option>2</option>
                        <option>3</option>
                      </select>
                    </div>
                  </div>
                  <div className="chart-tag">Today’s total: 1000</div>
                </div>
                <Bar
                  data={chartData}
                  options={{
                    title: {
                      display: false,
                      text: "Statistics",
                      fontSize: 20,
                    },
                    legend: {
                      display: false,
                      position: "right",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
