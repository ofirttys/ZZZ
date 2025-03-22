import React, { useState } from 'react';
import { addHours, format, parse, isAfter } from 'date-fns';
import './App.css';
import './index.css';

function App() {
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [periods, setPeriods] = useState(3);
  const [timePeriods, setTimePeriods] = useState([]);
  const [error, setError] = useState('');

  const calculatePeriods = () => {
    try {
      const baseDate = new Date();
      let start = parse(startTime, 'HH:mm', baseDate);
      let end = parse(endTime, 'HH:mm', baseDate);

      // Handle cases where end time is earlier than start time (next day)
      if (isAfter(start, end)) {
        end = addHours(end, 24);
      }

      const timeDiff = end.getTime() - start.getTime();
      const periodSize = timeDiff / periods;

      const newPeriods = [];
      for (let i = 0; i < periods; i++) {
        const periodStart = new Date(start.getTime() + (periodSize * i));
        const periodEnd = i === periods - 1
		  ? end // Make sure the last chunk ends exactly at the end time
		  : new Date(start.getTime() + (periodSize * (i + 1)));

        newPeriods.push({
		  start: format(periodStart, 'HH:mm'),
		  end: format(periodEnd, 'HH:mm')
		});
      }

      setTimePeriods(newPeriods);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Please enter valid times in HH:mm format');
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
		backgroundImage: "url('/bg.jpg')", 
		backgroundSize: "cover",
		backgroundPosition: "center"
	}}>
      <div className="max-w-md mx-auto bg-white bg-opacity-90 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Time Period Splitter</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time (HH:mm)
            </label>
            <input
              type="time"
              id="startTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              End Time (HH:mm)
            </label>
            <input
              type="time"
              id="endTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="periods" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Periods
            </label>
            <input
              type="number"
              id="periods"
              inputMode="numeric"
              pattern="[0-9]*"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={periods}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string for clearing the input
                if (value === '') {
                  setPeriods('');
                } else {
                  const parsedValue = parseInt(value);
                  // Only set if it's a valid number
                  if (!isNaN(parsedValue)) {
                    setPeriods(parsedValue);
                  }
                }
              }}
              onBlur={() => {
                // When the field loses focus, ensure the value is at least 2
                if (periods === '' || periods < 2) {
                  setPeriods(2);
                }
              }}
            />
          </div>

          <button
            onClick={calculatePeriods}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Calculate Periods
          </button>

          {error && <p className="text-red-600">{error}</p>}

          {timePeriods.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Results:</h2>
              <div className="space-y-2">
                {timePeriods.map((period, index) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Period {index + 1}:</span>
                    <span>{period.start} - {period.end}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
