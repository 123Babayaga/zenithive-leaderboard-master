// components/JiraProjectsCards.tsx (Main Component - Refactored)
"use client"

import React from 'react';
import { ProjectCard } from '../customComponent/project/ProjectCard';
import { ProjectDialog } from '../customComponent/project/ProjectDialog';
import { ProjectHeader } from '../customComponent/project/ProjectHeader';
import { EmptyState } from '../customComponent/project/EmptyState';
import { ErrorState } from '../customComponent/project/ErrorState';
import { ProjectCardSkeleton } from '../customComponent/ui/LoadingSpinner';
import { useProjects, useProjectDetails, useProjectIssues } from '../hooks/useProjects';

const JiraProjectsCards = () => {
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

  const handleViewDetails = (projectKey: string) => {
    fetchProjectDetails(projectKey);
    fetchProjectIssues(projectKey);
  };

  if (loading) {
    return <ProjectCardSkeleton />;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectDialog
              key={project.id}
              project={selectedProject}
              projectDetailsLoading={projectDetailsLoading}
              projectDetailsError={projectDetailsError}
              issues={issues}
              issuesLoading={issuesLoading}
              issuesError={issuesError}
              issuesTotal={issuesTotal}
            >
              <div className="cursor-pointer">
                <ProjectCard
                  project={project}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </ProjectDialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default JiraProjectsCards;