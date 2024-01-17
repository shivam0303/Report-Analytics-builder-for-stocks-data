import React, { useState } from "react";
import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { Button } from "@mui/material";
import "./Dashboard.css";

const Dashboard = () => {
  const cardData = useSelector((state) => state.cardData);
  const metaData = useSelector((state) => state.metaData);
  // console.log(metaData);

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
  };

  const calculateSum = (data, key) => {
    return data.reduce((sum, dataPoint) => sum + parseFloat(dataPoint[key]), 0);
  };

  const calculateAverage = (data, key) => {
    const sum = calculateSum(data, key);
    return sum / data.length;
  };

  const calculateMedian = (data, key) => {
    const sortedData = data.map((dataPoint) => parseFloat(dataPoint[key])).sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    return sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
  };

  return cardData.length > 0 ? (
    <div className="container">
      {metaData && (
        <div>
          <h2>Dashboard</h2>

          <hr />
          <p>Stock Data of : {metaData["2. Symbol"]}</p>
          <p>{metaData["1. Information"]}</p>
          <p>Last Refreshed : {metaData["3. Last Refreshed"]}</p>
          <p>Timezone : {metaData["6. Time Zone"]}</p>
          <hr />
          <div className="summary-section">
            <h2>Summary</h2>
            <p>Total Open Value: {calculateSum(filteredData, "1. open")}</p>
            <p>
              Average High Value: {calculateAverage(filteredData, "2. high")}
            </p>
            <p>Median Low Value: {calculateMedian(filteredData, "3. low")}</p>
            <p>Total Close Value: {calculateSum(filteredData, "4. close")}</p>
            <p>Total Volume: {calculateSum(filteredData, "5. volume")}</p>
          </div>
        </div>
      )}

      <hr />

      {/* Slider */}
      <div style={{ width: "100%" }}>
        <label>Date&Time Filter:</label>
        <input
          type="range"
          min={0}
          max={100}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ width: "100%" }}
        />
        <span style={{ display: "block", textAlign: "center", width: "100%" }}>
          {selectedDate}
        </span>
      </div>

      <div className="plot-container">
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
    </div>
  ) : (
    <div className="add-data-button">
      <Button variant="contained" color="primary" onClick={handleClick}>
        Add More Data
      </Button>
    </div>
  );
};

export default Dashboard;
