import { useState } from 'react';

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const PreferencesForm = ({ onSubmit }) => {
  const [availableHours, setAvailableHours] = useState({
    monday: 2,
    tuesday: 2,
    wednesday: 2,
    thursday: 2,
    friday: 2,
    saturday: 4,
    sunday: 4,
  });
  
  const [preferredStudyTime, setPreferredStudyTime] = useState('morning');
  const [sessionDuration, setSessionDuration] = useState(2);
  const [breakDuration, setBreakDuration] = useState(0.25);
  
  const handleHoursChange = (day, value) => {
    setAvailableHours({
      ...availableHours,
      [day]: parseFloat(value)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const preferences = {
      available_hours_per_day: availableHours,
      preferred_study_time: preferredStudyTime,
      session_duration: parseFloat(sessionDuration),
      break_duration: parseFloat(breakDuration)
    };
    
    onSubmit(preferences);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Study Preferences</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Available Hours per Day</h3>
          <div className="grid grid-cols-2 gap-4">
            {WEEKDAYS.map(day => (
              <div key={day} className="flex items-center">
                <label className="block text-gray-700 font-medium w-24 capitalize" htmlFor={`hours-${day}`}>
                  {day}
                </label>
                <input
                  type="number"
                  id={`hours-${day}`}
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={availableHours[day]}
                  onChange={(e) => handleHoursChange(day, e.target.value)}
                  min="0"
                  max="24"
                  step="0.5"
                  required
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="preferredTime">
              Preferred Study Time
            </label>
            <select
              id="preferredTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={preferredStudyTime}
              onChange={(e) => setPreferredStudyTime(e.target.value)}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="sessionDuration">
              Session Duration (hours)
            </label>
            <input
              type="number"
              id="sessionDuration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              min="0.5"
              max="4"
              step="0.5"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="breakDuration">
              Break Duration (hours)
            </label>
            <input
              type="number"
              id="breakDuration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
              min="0"
              max="1"
              step="0.05"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesForm; 