import { useState } from 'react';
import { formatDate, formatTime, getDayName } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const StudyPlanDisplay = ({ studyPlan, onDeletePlan, onNavigateToSetup }) => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'subject'
  const navigate = useNavigate();
  
  if (!studyPlan || !studyPlan.days || studyPlan.days.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md text-center">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Study Plan Available</h2>
        <p className="text-gray-600 mb-6">To generate a study plan, please go to the Plan Setup page and fill in your study details.</p>
        <button
          onClick={onNavigateToSetup}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all hover:scale-105"
        >
          Go to Plan Setup
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    );
  }
  
  const { 
    days, 
    total_study_hours, 
    subjects_distribution, 
    insufficient_time, 
    total_hours_needed,
    available_hours,
    unallocated_topics
  } = studyPlan;
  
  // Group by date for calendar view
  const daysByDate = {};
  days.forEach(day => {
    daysByDate[day.date] = day.sessions;
  });
  
  // Group by subject for subject view
  const sessionsBySubject = {};
  days.forEach(day => {
    day.sessions.forEach(session => {
      if (!sessionsBySubject[session.subject]) {
        sessionsBySubject[session.subject] = [];
      }
      sessionsBySubject[session.subject].push({
        ...session,
        date: day.date
      });
    });
  });
  
  const subjectColors = {};
  const colors = [
    'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200', 
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-teal-200'
  ];
  
  Object.keys(subjects_distribution).forEach((subject, index) => {
    subjectColors[subject] = colors[index % colors.length];
  });
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
        <p className="font-bold">Rule-Based Study Plan</p>
        <ul className="list-disc list-inside text-sm mt-2">
          <li>Subjects with exams in &lt;5 days get at least 2 hours daily</li>
          <li>High importance subjects are studied daily</li>
          <li>Low importance subjects are studied after High and Medium</li>
          <li>Each subject gets a full revision 2 days before exam</li>
        </ul>
      </div>
      
      {insufficient_time && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Warning: Insufficient Study Time</p>
          <p>Your subjects require approximately {total_hours_needed?.toFixed(1)} study hours, but you only have {available_hours?.toFixed(1)} hours available in your schedule.</p>
          <p>This plan covers as much as possible within the given time frame, but you may need to adjust your schedule or priorities.</p>
        </div>
      )}
      
      {unallocated_topics && unallocated_topics.length > 0 && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6" role="alert">
          <p className="font-bold">Warning: Some topics could not be fully allocated</p>
          <p className="mb-2">The following topics were not fully covered in the study plan due to time constraints:</p>
          <ul className="list-disc list-inside text-sm">
            {unallocated_topics.map((topic, index) => (
              <li key={index}>
                {topic.subject}: {topic.topic} ({topic.hours_remaining} hours remaining)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Study Plan</h2>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('subject')}
              className={`px-3 py-1 rounded-md ${
                viewMode === 'subject'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              By Subject
            </button>
          </div>
          <button
            onClick={onDeletePlan}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Plan
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <p>Total Study Hours: <span className="font-bold">{total_study_hours.toFixed(1)}</span></p>
          <p>Days: <span className="font-bold">{days.length}</span></p>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Subject Distribution</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(subjects_distribution).map(([subject, hours], index) => (
            <div 
              key={index} 
              className={`px-3 py-1 rounded-md flex items-center ${subjectColors[subject]}`}
            >
              <span className="font-medium">{subject}</span>
              <span className="ml-2 text-sm text-gray-700">{hours.toFixed(1)}h</span>
            </div>
          ))}
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        <div>
          <h3 className="text-lg font-medium mb-2">Daily Schedule</h3>
          <div className="space-y-6">
            {Object.entries(daysByDate).map(([date, sessions]) => (
              <div key={date} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 font-medium">
                  {getDayName(date)}, {formatDate(date)}
                </div>
                <div className="divide-y">
                  {sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="p-4 flex justify-between items-center">
                      <div>
                        <div className={`text-sm px-2 py-0.5 rounded inline-block mb-1 ${subjectColors[session.subject]}`}>
                          {session.subject}
                          {session.session_type === 'revision' && (
                            <span className="ml-1 bg-yellow-200 text-yellow-800 px-1 rounded-sm text-xs">
                              Revision
                            </span>
                          )}
                        </div>
                        <div className="font-medium">{session.topic}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {formatTime(session.start_time)} - {formatTime(session.end_time)}
                        </div>
                        <div className="font-medium">{session.duration_hours}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-2">By Subject</h3>
          <div className="space-y-6">
            {Object.entries(sessionsBySubject).map(([subject, sessions]) => (
              <div key={subject} className="border rounded-lg overflow-hidden">
                <div className={`px-4 py-2 font-medium ${subjectColors[subject]}`}>
                  {subject} ({subjects_distribution[subject].toFixed(1)}h)
                </div>
                <div className="divide-y">
                  {sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {session.topic}
                          {session.session_type === 'revision' && (
                            <span className="ml-1 bg-yellow-200 text-yellow-800 px-1 rounded-sm text-xs">
                              Revision
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getDayName(session.date)}, {formatDate(session.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {formatTime(session.start_time)} - {formatTime(session.end_time)}
                        </div>
                        <div className="font-medium">{session.duration_hours}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanDisplay; 