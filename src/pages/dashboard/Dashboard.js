import React from "react";
import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { type } from "@testing-library/user-event/dist/type";

const Dashboard = () => {
  const cardData = useSelector((state) => state.cardData);
  // convert cardData to a map Object
  // console.log(cardData.keys());
  // console.log(cardData);
  // Filter out data based on date
  const filteredData = cardData.filter(
    (dataPoint) => dataPoint.date >= "2023-01-12 19:50:00"
  );
  // Group data based on years and get summed volume
  const groupedData = filteredData.reduce((acc, curr) => {
    const year = curr.date.split("-")[0];
    if (!acc[year]) {
      acc[year] = 0;
    }
    acc[year] += parseInt(curr["5. volume"]);
    return acc;
  });
  // remove keys that are not years
  for (const key in groupedData) {
    console.log(key.length);
    if (key.length !== 4) {
      delete groupedData[key];
    }
  }
  return (
    <>
      <div>
        <Plot
          data={[
            {
              x: filteredData.map((filteredData) => filteredData.date),
              y: filteredData.map((filteredData) => filteredData["1. open"]),
              type: "bar",
              mode: "lines+markers",
              marker: { color: "red" },
            },
          ]}
          layout={{ width: 720, height: 440, title: "A Fancy Plot" }}
        />
        {/* Line Plot of Highs and Lows */}
        <Plot
          data={[
            {
              x: filteredData.map((filteredData) => filteredData.date),
              y: filteredData.map((filteredData) => filteredData["2. high"]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
            },
            {
              x: filteredData.map((filteredData) => filteredData.date),
              y: filteredData.map((filteredData) => filteredData["3. low"]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            },
          ]}
          layout={{ width: 720, height: 440, title: "A Fancy Plot" }}
        />
      </div>
      {/* YoY Increase in Volume traded line chart*/}
      <div>
        <Plot
          data={[
            {
              x: Object.keys(groupedData),
              y: Object.values(groupedData),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
            },
          ]}
          layout={{ width: 720, height: 440, title: "A Fancy Plot" }}
        />
      </div>
    </>
  );
};

export default Dashboard;
