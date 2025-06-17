import React from 'react';
import { Folder } from 'lucide-react';

interface ProjectHeaderProps {
  projectCount: number;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectCount }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Folder className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">JIRA Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your team&apos;s projects ({projectCount} projects)
          </p>
        </div>
      </div>
    </div>
  );
};