// hooks/useProjects.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IssuesResponse, Issue, Project, ApiResponse } from '../interface/projectInterface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/projects`);
      
      const data: ApiResponse = response.data;
      
      if (data.success) {
        setProjects(data.data);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
};

export const useProjectDetails = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async (projectKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/projects/${projectKey}`);
      
      const data = response.data;
      
      if (data.success) {
        setSelectedProject(data.data);
      } else {
        throw new Error('Failed to fetch project details');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedProject,
    loading,
    error,
    fetchProjectDetails,
  };
};

export const useProjectIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProjectIssues = async (projectKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/projects/${projectKey}/issues`);
      
      const data: IssuesResponse = response.data;
      
      if (data.success) {
        setIssues(data.data);
        setTotal(data.total);
      } else {
        throw new Error('Failed to fetch project issues');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    issues,
    loading,
    error,
    total,
    fetchProjectIssues,
  };
};