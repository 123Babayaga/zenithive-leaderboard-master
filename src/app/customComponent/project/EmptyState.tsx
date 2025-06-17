// components/project/EmptyState.tsx
import React from 'react';
import { Folder } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
      <p className="text-gray-600">There are no JIRA projects available at the moment.</p>
    </div>
  );
};