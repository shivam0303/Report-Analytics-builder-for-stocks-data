import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './CalendarPage.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([
    { title: 'Create report for January month', date: '2024-01-15' },
    { title: 'Update December 2023 report', date: '2024-01-20' },
  ]);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  const calendarRef = useRef(null);

  const handleAddEventClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleAddEvent = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().addEvent({ title: newEventTitle, date: newEventDate });
    }

    setPopoverAnchorEl(null);
    setNewEventTitle('');
    setNewEventDate('');
  };

  return (
    <div className='calendar-page'>
      <Button onClick={handleAddEventClick} variant="contained" color="primary">
        Add Event
      </Button>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]} 
        initialView="dayGridMonth"
        events={events}
        editable={true}
        onClick={handleAddEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek', 
        }}
      />

      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="popover-content">
          <TextField
            label="Event Title"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
          <TextField
            label="Event Date (YYYY-MM-DD)"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
          />
          <Button onClick={handleAddEvent} variant="contained" color="primary">
            Add
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default CalendarPage;
