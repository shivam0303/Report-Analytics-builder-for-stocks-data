// Data.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';

import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useDispatch } from 'react-redux';
import { setCardData } from '../../redux/actions';
import './Data.css';

const Data = () => {
  
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [intervalValue, setIntervalValue] = useState('5min');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [functionValue, setFunctionValue] = useState('TIME_SERIES_INTRADAY');
  const [loading, setLoading] = useState(false);

  const intervals = ['1min', '5min', '15min', '30min', '60min'];
  const formattedDate = selectedDate.toISOString().split('T')[0];
  const functions = ['TIME_SERIES_INTRADAY']; 

  const FetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=${functionValue}&symbol=IBM&interval=${intervalValue}&month=${formattedDate}&outputsize=full&apikey=9YIFX3UJ2STUY0J2`
      );
      const data = response.data[`Time Series (${intervalValue})`];
      // Convert data to an array of objects
      const dataArr = [];
      for (const [key, value] of Object.entries(data)) {
        dataArr.push({ date: key, ...value });
      }
      setData(dataArr);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    FetchItems();
  }

    dispatch(setCardData(data));
  return (
    <div className="table-container">
      <div className="input-container">
        <Select
          label="Interval"
          value={intervalValue}
          onChange={(e) => setIntervalValue(e.target.value)}
        >
          {intervals.map((interval) => (
            <MenuItem key={interval} value={interval}>
              {interval}
            </MenuItem>
          ))}
        </Select>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Month"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Select
          label="Function"
          value={functionValue}
          onChange={(e) => setFunctionValue(e.target.value)}
        >
          {functions.map((func) => (
            <MenuItem key={func} value={func}>
              {func}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <TableContainer component={Paper}>
          <Table className="table">
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-cell">Timestamp</TableCell>
                <TableCell className="table-cell">Open</TableCell>
                <TableCell className="table-cell">High</TableCell>
                <TableCell className="table-cell">Low</TableCell>
                <TableCell className="table-cell">Close</TableCell>
                <TableCell className="table-cell">Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                Object.entries(data).map(([timestamp, values]) => (
                  <TableRow key={timestamp}>
                    <TableCell className="table-cell">{timestamp}</TableCell>
                    <TableCell className="table-cell">{values['1. open']}</TableCell>
                    <TableCell className="table-cell">{values['2. high']}</TableCell>
                    <TableCell className="table-cell">{values['3. low']}</TableCell>
                    <TableCell className="table-cell">{values['4. close']}</TableCell>
                    <TableCell className="table-cell">{values['5. volume']}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Data;
