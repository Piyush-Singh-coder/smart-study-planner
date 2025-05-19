import { useState } from 'react';
import { formatDate } from '../services/api';

const SubjectForm = ({ onAddSubject }) => {
  const [subjectName, setSubjectName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [importance, setImportance] = useState(3);
  const [chapters, setChapters] = useState([{ name: '', estimatedHours: 1 }]);
  const [error, setError] = useState('');

  const handleAddChapter = () => {
    setChapters([...chapters, { name: '', estimatedHours: 1 }]);
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setChapters(updatedChapters);
  };

  const handleRemoveChapter = (index) => {
    if (chapters.length > 1) {
      const updatedChapters = [...chapters];
      updatedChapters.splice(index, 1);
      setChapters(updatedChapters);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!subjectName.trim()) {
      setError('Subject name is required');
      return;
    }
    
    if (!examDate) {
      setError('Exam date is required');
      return;
    }
    
    const invalidChapter = chapters.find(
      chapter => !chapter.name.trim() || chapter.estimatedHours <= 0
    );
    
    if (invalidChapter) {
      setError('All chapters must have a name and positive study hours');
      return;
    }
    
    // Create subject object
    const subject = {
      name: subjectName.trim(),
      exam_date: formatDate(examDate),
      importance: parseInt(importance),
      chapters: chapters.map(chapter => ({
        name: chapter.name.trim(),
        estimated_hours: parseFloat(chapter.estimatedHours)
      }))
    };
    
    // Pass to parent
    onAddSubject(subject);
    
    // Reset form
    setSubjectName('');
    setExamDate('');
    setImportance(3);
    setChapters([{ name: '', estimatedHours: 1 }]);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Subject</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="subjectName">
              Subject Name
            </label>
            <input
              type="text"
              id="subjectName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="examDate">
              Exam Date
            </label>
            <input
              type="date"
              id="examDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="importance">
              Importance (1-5)
            </label>
            <select
              id="importance"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
            >
              <option value="1">1 - Lowest</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - High</option>
              <option value="5">5 - Highest</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Chapters</h3>
          {chapters.map((chapter, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <div className="col-span-7">
                <input
                  type="text"
                  placeholder="Chapter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chapter.name}
                  onChange={(e) => handleChapterChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  placeholder="Hours"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chapter.estimatedHours}
                  onChange={(e) => handleChapterChange(index, 'estimatedHours', e.target.value)}
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleRemoveChapter(index)}
                  disabled={chapters.length === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleAddChapter}
          >
            + Add Chapter
          </button>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Subject
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm; 