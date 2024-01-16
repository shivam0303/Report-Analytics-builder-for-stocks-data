// Data.js
import React, { useState } from 'react';
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

import Popover from '@mui/material/Popover';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

import { useDispatch } from 'react-redux';
import { setCardData, setMetaData } from '../../redux/actions';
import './Data.css';

const Data = () => {
  
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [metaData, setmetaData] = useState([]);
  const [intervalValue, setIntervalValue] = useState('5min');
  const [symbol, setSymbol] = useState('IBM');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [functionValue, setFunctionValue] = useState('TIME_SERIES_INTRADAY');
  const [loading, setLoading] = useState(false);

  const intervals = ['1min', '5min', '15min', '30min', '60min'];
  const formattedDate = selectedDate.toISOString().split('T')[0].slice(0, 7);
  const functions = ['TIME_SERIES_INTRADAY']; 

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenCalendar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCalendar = () => {
    setAnchorEl(null);
  };

  const FetchItems = async () => {
    setLoading(true);
    try {
      
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=${functionValue}&symbol=${symbol}&interval=${intervalValue}&month=${formattedDate}&outputsize=full&apikey=9YIFX3UJ2STUY0J2`
      );

      if(!response.data['Meta Data']) {
        alert('API call limit reached. Please try again later');
        return;
      }

      setmetaData(response.data['Meta Data']);
      const data = response.data[`Time Series (${intervalValue})`];
      // console.log(response)
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
    dispatch(setMetaData(metaData));
    // console.log(data)
  return (
    <div className="table-container">
      <div className="input-container">
      <TextField
          label="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          variant="outlined"
          style={{ marginRight: '10px' }}
        />

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

        <Button variant="outlined" onClick={handleOpenCalendar}>
          {formattedDate}
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseCalendar}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              referenceDate={dayjs(formattedDate)}
              views={["year", "month"]}
              onChange={(date) => {
                setSelectedDate(date);
              }}
              onClose={handleCloseCalendar}
            />
          </LocalizationProvider>
        </Popover>
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
                <TableCell className="table-cell">Date</TableCell>
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
                    <TableCell className="table-cell">{values["date"]}</TableCell>
                    <TableCell className="table-cell">
                      {values["1. open"]}
                    </TableCell>
                    <TableCell className="table-cell">
                      {values["2. high"]}
                    </TableCell>
                    <TableCell className="table-cell">
                      {values["3. low"]}
                    </TableCell>
                    <TableCell className="table-cell">
                      {values["4. close"]}
                    </TableCell>
                    <TableCell className="table-cell">
                      {values["5. volume"]}
                    </TableCell>
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

