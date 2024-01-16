import React, { useState } from "react";
import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { Button } from "@mui/material";

const Dashboard = () => {
  const cardData = useSelector((state) => state.cardData);
  const metaData = useSelector((state) => state.metaData);
  console.log(metaData)

  const [filterValue, setFilterValue] = useState(50);

  let filteredData = [];
  let groupedData = {};

  let selectedDate;

  if (cardData.length > 0) {
    const index = Math.floor((filterValue / 100) * cardData.length);
    selectedDate = cardData[index].date;

    filteredData = cardData.filter(
      (dataPoint) => dataPoint.date >= selectedDate
    );

    groupedData = filteredData.reduce((acc, curr) => {
      const year = curr.date.split("-")[0];
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += parseInt(curr["5. volume"]);
      return acc;
    }, {});

    for (const key in groupedData) {
      if (key.length !== 4) {
        delete groupedData[key];
      }
    }
  }

  const handleClick = () => {
    //route to /data
    window.location.href = "/data";
  }

  return cardData.length > 0 ? (
    <div>

      {/* Slider */}
      <div style={{ width: '100%' }}>
        <label>Date&Time Filter:</label>
        <input
          type="range"
          min={0}
          max={100}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ width: '100%' }} 
        />
        <span style={{ display: 'block', textAlign: 'center', width: '100%' }}>{selectedDate}</span>
      </div>

      <Plot
        data={[
          {
            x: filteredData.map((data) => data.date),
            y: filteredData.map((data) => data["1. open"]),
            type: "bar",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]}
        layout={{ width: 720, height: 440, title: "Open VS Date" }}
      />

      {/* Line Plot of Highs and Lows */}
      <Plot
        data={[
          {
            x: filteredData.map((data) => data.date),
            y: filteredData.map((data) => data["2. high"]),
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" },
          },
          {
            x: filteredData.map((data) => data.date),
            y: filteredData.map((data) => data["3. low"]),
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]}
        layout={{ width: 720, height: 440, title: "Highs and Lows Vs Date" }}
      />

      {/* line chart of close */}
      <Plot
        data={[
          {
            x: filteredData.map((data) => data.date),
            y: filteredData.map((data) => data["4. close"]),
            type: "line",
            mode: "lines+markers",
            marker: { color: "blue" },
          },
        ]}
        layout={{ width: 720, height: 440, title: "Close Vs Date" }}
      />

      {/* line Chart of Volume */}
      <Plot
        data={[
          {
            x: filteredData.map((data) => data.date),
            y: filteredData.map((data) => data["5. volume"]),
            type: "line",
            mode: "lines+markers",
            marker: { color: "green" },
          },
        ]}
        layout={{ width: 720, height: 440, title: "Volume Vs Date" }}
      />

    </div>
  ) : (
    <div>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Add More Data
      </Button>
    </div>
  );
};

export default Dashboard;
