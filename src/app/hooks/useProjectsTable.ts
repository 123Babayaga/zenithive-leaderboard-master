// Updated hooks/useProjects.ts (Add additional hooks for table data)
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ... (keep existing hooks)

// New hook for project hours data
export const useProjectHours = () => {
  const [projectHours, setProjectHours] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectHours = async (projectKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_URL}/projects/${projectKey}/hours`);
      
      const data = response.data;
      
      if (data.success) {
        setProjectHours(prev => ({
          ...prev,
          [projectKey]: data.data.totalHours
        }));
      }
    } catch (err) {
      console.error('Error fetching project hours:', err);
      setError('Failed to fetch project hours');
    } finally {
      setLoading(false);
    }
  };

  return {
    projectHours,
    loading,
    error,
    fetchProjectHours,
  };
};

// New hook for project costs
export const useProjectCosts = () => {
  const [projectCosts, setProjectCosts] = useState<{[key: string]: {
    totalCost: number;
    profit: number;
    hourlyRate: number;
  }}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectCosts = async (projectKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_URL}/projects/${projectKey}/costs`);
      
      const data = response.data;
      
      if (data.success) {
        setProjectCosts(prev => ({
          ...prev,
          [projectKey]: {
            totalCost: data.data.totalCost,
            profit: data.data.profit,
            hourlyRate: data.data.hourlyRate
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching project costs:', err);
      setError('Failed to fetch project costs');
    } finally {
      setLoading(false);
    }
  };

  return {
    projectCosts,
    loading,
    error,
    fetchProjectCosts,
  };
};