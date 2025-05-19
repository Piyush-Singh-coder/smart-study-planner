const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const checkBackendStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking backend status:', error);
        throw error;
    }
};

export const fetchStudyPlan = async (planData) => {
  try {
    const response = await fetch(`${API_URL}/api/study-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate study plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    // If date is already in ISO string format
    return date.split('T')[0];
  }
  
  // If date is a Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  
  // Handle both HH:MM:SS and HH:MM formats
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

export const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}; 