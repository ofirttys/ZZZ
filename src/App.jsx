import React, { useState } from 'react';
import { addHours, format, parse, isAfter } from 'date-fns';
import './App.css';
import './index.css';

function App() {
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [chunks, setChunks] = useState(3);
  const [timeChunks, setTimeChunks] = useState([]);
  const [error, setError] = useState('');

  const calculateChunks = () => {
    try {
      const baseDate = new Date();
      let start = parse(startTime, 'HH:mm', baseDate);
      let end = parse(endTime, 'HH:mm', baseDate);

      if (isAfter(start, end)) {
        end = addHours(end, 24);
      }

      const timeDiff = end.getTime() - start.getTime();
      const chunkSize = timeDiff / chunks;

      const newChunks = [];
      for (let i = 0; i < chunks; i++) {
        const chunkTime = new Date(start.getTime() + (chunkSize * i));
        newChunks.push(format(chunkTime, 'HH:mm'));
      }

      setTimeChunks(newChunks);
      setError('');
    } catch (err) {
      setError('Please enter valid times in HH:mm format');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
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
            <label htmlFor="chunks" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Chunks
            </label>
            <input
              type="number"
              id="chunks"
              min="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={chunks}
              onChange={(e) => setChunks(Math.max(2, parseInt(e.target.value) || 2))}
            />
          </div>

          <button
            onClick={calculateChunks}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Calculate Chunks
          </button>

          {error && <p className="text-red-600">{error}</p>}

          {timeChunks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Results:</h2>
              <div className="space-y-2">
                {timeChunks.map((time, index) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Chunk {index + 1}:</span>
                    <span>{time}</span>
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