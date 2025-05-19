import { useState } from 'react';
import { formatDate } from '../services/api';

const StudyPlannerForm = ({ onSubmit, isLoading }) => {
  // User profile
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  
  // Dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Subjects
  const [subjects, setSubjects] = useState([
    { 
      name: '', 
      importance: 'Medium', 
      exam_date: '',
      difficulty: 3,
      topics: [{ name: '', estimated_hours: 1, difficulty: 3 }]
    }
  ]);
  
  // Study preferences
  const [preferences, setPreferences] = useState({
    weekday_hours: 3,
    weekend_hours: 5,
    session_duration: 1.5,
    break_duration: 0.25,
    study_style: 'flexible',
    session_length: 'long',
    revision_days_before: 2,
    weekly_revision: false,
    break_days: []
  });
  
  // Form validation
  const [error, setError] = useState('');
  
  // Helper to add a subject
  const handleAddSubject = () => {
    setSubjects([
      { 
        name: '', 
        importance: 'Medium', 
        exam_date: '',
        difficulty: 3,
        topics: [{ name: '', estimated_hours: 1, difficulty: 3 }]
      },
      ...subjects
    ]);
  };
  
  // Helper to update a subject
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    setSubjects(updatedSubjects);
  };
  
  // Helper to remove a subject
  const handleRemoveSubject = (index) => {
    if (subjects.length > 1) {
      const updatedSubjects = [...subjects];
      updatedSubjects.splice(index, 1);
      setSubjects(updatedSubjects);
    }
  };
  
  // Helper to add a topic to a subject
  const handleAddTopic = (subjectIndex) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex].topics.push({ name: '', estimated_hours: 1, difficulty: 3 });
    setSubjects(updatedSubjects);
  };
  
  // Helper to update a topic
  const handleTopicChange = (subjectIndex, topicIndex, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex].topics[topicIndex] = { 
      ...updatedSubjects[subjectIndex].topics[topicIndex], 
      [field]: value 
    };
    setSubjects(updatedSubjects);
  };
  
  // Helper to remove a topic
  const handleRemoveTopic = (subjectIndex, topicIndex) => {
    if (subjects[subjectIndex].topics.length > 1) {
      const updatedSubjects = [...subjects];
      updatedSubjects[subjectIndex].topics.splice(topicIndex, 1);
      setSubjects(updatedSubjects);
    }
  };
  
  // Helper to update preferences
  const handlePreferenceChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: parseFloat(value) || 0
    });
  };
  
  // Helper to add a break day
  const handleAddBreakDay = (date) => {
    if (date && !preferences.break_days.includes(date)) {
      setPreferences({
        ...preferences,
        break_days: [...preferences.break_days, date].sort()
      });
    }
  };
  
  // Helper to remove a break day
  const handleRemoveBreakDay = (date) => {
    setPreferences({
      ...preferences,
      break_days: preferences.break_days.filter(d => d !== date)
    });
  };
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!startDate) {
      setError('Please select a start date');
      return;
    }
    
    if (!endDate) {
      setError('Please select an end date');
      return;
    }
    
    // Validate subjects
    for (const subject of subjects) {
      if (!subject.name.trim()) {
        setError('All subjects must have a name');
        return;
      }
      
      for (const topic of subject.topics) {
        if (!topic.name.trim() || topic.estimated_hours <= 0) {
          setError(`All topics in "${subject.name}" must have a name and positive study hours`);
          return;
        }
      }
    }
    
    // Create request data
    const planData = {
      user_profile: {
        name: name || undefined,
        level: level || undefined
      },
      subjects: subjects.map(subject => ({
        name: subject.name,
        importance: subject.importance,
        exam_date: subject.exam_date ? formatDate(subject.exam_date) : undefined,
        difficulty: parseInt(subject.difficulty),
        topics: subject.topics.map(topic => ({
          name: topic.name,
          estimated_hours: parseFloat(topic.estimated_hours),
          difficulty: parseInt(topic.difficulty)
        }))
      })),
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      preferences: {
        ...preferences,
        weekday_hours: parseFloat(preferences.weekday_hours),
        weekend_hours: parseFloat(preferences.weekend_hours),
        session_duration: parseFloat(preferences.session_duration),
        break_duration: parseFloat(preferences.break_duration),
        revision_days_before: parseInt(preferences.revision_days_before),
        break_days: preferences.break_days.map(d => formatDate(d))
      }
    };
    
    // Submit to parent
    onSubmit(planData);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Study Planner</h2>
      
      {/* Instructions Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Set Up Your Study Plan</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Fill in your basic profile information (optional)</li>
          <li>Set your study period by selecting start and end dates</li>
          <li>Add subjects you need to study:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>Enter subject name and importance level</li>
              <li>Add exam date if applicable</li>
              <li>Set subject difficulty level</li>
              <li>Add topics to cover with estimated study hours</li>
            </ul>
          </li>
          <li>Configure your study preferences:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>Set daily study hours for weekdays and weekends</li>
              <li>Choose session and break durations</li>
              <li>Select study style and session type</li>
              <li>Add any break days</li>
            </ul>
          </li>
        </ol>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Profile Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Name (optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Level/Grade (optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. 12th Grade, College"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Study Period Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Study Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Start Date*</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">End Date*</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subjects Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Subjects</h3>
            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all hover:scale-105"
              onClick={handleAddSubject}
            >
              + Add Subject
            </button>
          </div>
          
          {subjects.map((subject, subjectIndex) => (
            <div key={subjectIndex} className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Subject {subjects.length - subjectIndex}</h4>
                {subjects.length > 1 && (
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800 transition-colors"
                    onClick={() => handleRemoveSubject(subjectIndex)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Subject Name*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(subjectIndex, 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Importance</label>
                  <select
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={subject.importance}
                    onChange={(e) => handleSubjectChange(subjectIndex, 'importance', e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Exam Date (optional)</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={subject.exam_date}
                      onChange={(e) => handleSubjectChange(subjectIndex, 'exam_date', e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Difficulty (1-5)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={subject.difficulty}
                  onChange={(e) => handleSubjectChange(subjectIndex, 'difficulty', e.target.value)}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                </div>
              </div>
              
              {/* Topics */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-base font-medium text-gray-800">Topics to Cover</h5>
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
                    onClick={() => handleAddTopic(subjectIndex)}
                  >
                    + Add Topic
                  </button>
                </div>
                
                {subject.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="grid grid-cols-12 gap-3 mb-3 items-center">
                    <div className="col-span-7 md:col-span-8">
                      <input
                        type="text"
                        placeholder="Topic name"
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={topic.name}
                        onChange={(e) => handleTopicChange(subjectIndex, topicIndex, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <input
                        type="number"
                        placeholder="Study hours required"
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={topic.estimated_hours}
                        onChange={(e) => handleTopicChange(subjectIndex, topicIndex, 'estimated_hours', e.target.value)}
                        min="0.5"
                        step="0.5"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      {subject.topics.length > 1 && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleRemoveTopic(subjectIndex, topicIndex)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Study Preferences Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Study Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Weekday Study Hours</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={preferences.weekday_hours}
                onChange={(e) => handlePreferenceChange('weekday_hours', e.target.value)}
                min="0.5"
                step="0.5"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Weekend Study Hours</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={preferences.weekend_hours}
                onChange={(e) => handlePreferenceChange('weekend_hours', e.target.value)}
                min="0.5"
                step="0.5"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Session Duration (hours)</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={preferences.session_duration}
                onChange={(e) => handlePreferenceChange('session_duration', e.target.value)}
                min="0.25"
                step="0.25"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Break Duration (hours)</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={preferences.break_duration}
                onChange={(e) => handlePreferenceChange('break_duration', e.target.value)}
                min="0.1"
                max="1"
                step="0.05"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 0.25 to 0.5 hours (15-30 minutes)</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Study Style</label>
              <select
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={preferences.study_style}
                onChange={(e) => handlePreferenceChange('study_style', e.target.value)}
              >
                <option value="fixed">Fixed Schedule</option>
                <option value="flexible">Flexible Schedule</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Session Type</label>
              <select
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={preferences.session_length}
                onChange={(e) => handlePreferenceChange('session_length', e.target.value)}
              >
                <option value="long">Long Sessions</option>
                <option value="pomodoro">Pomodoro (25/5)</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Revision Days Before Exam</label>
            <input
              type="number"
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={preferences.revision_days_before}
              onChange={(e) => handlePreferenceChange('revision_days_before', e.target.value)}
              min="1"
              max="7"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="weekly_revision"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={preferences.weekly_revision}
                onChange={(e) => handlePreferenceChange('weekly_revision', e.target.checked)}
              />
              <label htmlFor="weekly_revision" className="ml-2 block text-sm text-gray-700">
                Include weekly revision sessions
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Break Days</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="date"
                className="px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={(e) => handleAddBreakDay(e.target.value)}
              />
            </div>
            {preferences.break_days.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.break_days.map((date, index) => (
                  <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-700">{date}</span>
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-red-600"
                      onClick={() => handleRemoveBreakDay(date)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-md shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Plan...' : 'Generate Study Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyPlannerForm; 