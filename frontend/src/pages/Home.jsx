import { useState } from 'react';
import StudyPlannerForm from '../components/StudyPlannerForm';
import StudyPlanDisplay from '../components/StudyPlanDisplay';
import { fetchStudyPlan } from '../services/api';

const Home = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'plan'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleGenerateStudyPlan = async (planData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const generatedPlan = await fetchStudyPlan(planData);
      setStudyPlan(generatedPlan);
      setActiveTab('plan');
    } catch (err) {
      setError(`Failed to generate study plan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = () => {
    setStudyPlan(null);
    setActiveTab('form');
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Smart Study Planner</h1>
        <p className="text-gray-600 mt-2">
          Organize your study time effectively with a personalized rule-based timetable
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'form'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('form')}
          >
            Plan Setup
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'plan'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('plan')}
          >
            Study Plan
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {activeTab === 'form' && (
        <StudyPlannerForm 
          onSubmit={handleGenerateStudyPlan}
          isLoading={isLoading}
        />
      )}
      
      {activeTab === 'plan' && (
        <div>
          <StudyPlanDisplay 
            studyPlan={studyPlan} 
            onDeletePlan={handleDeletePlan}
            onNavigateToSetup={() => setActiveTab('form')}
          />
        </div>
      )}
    </div>
  );
};

export default Home; 