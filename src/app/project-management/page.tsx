"use client"

import React, { useState, useEffect } from 'react';
import { ProjectTable } from '../customComponent/project/ProjectTable';
import { ProjectHeader } from '../customComponent/project/ProjectHeader';
import { EmptyState } from '../customComponent/project/EmptyState';
import { ErrorState } from '../customComponent/project/ErrorState';
import { ProjectTableSkeleton } from '../customComponent/ui/LoadingSpinner';
import { useProjects, useProjectDetails, useProjectIssues } from '../hooks/useProjects';
import { Issue } from '../interface/projectInterface';

const JiraProjectsTable = () => {
  const { projects, loading, error, refetch } = useProjects();
  const { 
    selectedProject, 
    loading: projectDetailsLoading, 
    error: projectDetailsError, 
    fetchProjectDetails 
  } = useProjectDetails();
  const { 
    issues, 
    loading: issuesLoading, 
    error: issuesError, 
    total: issuesTotal, 
    fetchProjectIssues 
  } = useProjectIssues();

  // Store issues for all projects to calculate work hours
  const [allProjectsIssues, setAllProjectsIssues] = useState<{ [projectKey: string]: Issue[] }>({});

  // Fetch issues for all projects when projects are loaded
  useEffect(() => {
    const fetchAllProjectsIssues = async () => {
      if (projects.length > 0) {
        const issuesPromises = projects.map(async (project) => {
          try {
            // You'll need to create a function to fetch issues for a specific project
            // For now, we'll use the existing fetchProjectIssues logic
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/projects/${project.key}/issues`);
            const data = await response.json();
            return { projectKey: project.key, issues: data.success ? data.data : [] };
          } catch (error) {
            console.error(`Error fetching issues for project ${project.key}:`, error);
            return { projectKey: project.key, issues: [] };
          }
        });

        const results = await Promise.all(issuesPromises);
        const issuesMap: { [projectKey: string]: Issue[] } = {};
        results.forEach(({ projectKey, issues }) => {
          issuesMap[projectKey] = issues;
        });
        setAllProjectsIssues(issuesMap);
      }
    };

    fetchAllProjectsIssues();
  }, [projects]);

  const handleViewDetails = (projectKey: string) => {
    fetchProjectDetails(projectKey);
    fetchProjectIssues(projectKey);
  };

  if (loading) {
    return <ProjectTableSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto p-6">
      <ProjectHeader projectCount={projects.length} />

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <ProjectTable 
          projects={projects} 
          onViewDetails={handleViewDetails}
          selectedProject={selectedProject}
          projectDetailsLoading={projectDetailsLoading}
          projectDetailsError={projectDetailsError}
          issues={issues}
          issuesLoading={issuesLoading}
          issuesError={issuesError}
          issuesTotal={issuesTotal}
          allProjectsIssues={allProjectsIssues}
        />
      )}
    </div>
  );
};

export default JiraProjectsTable;