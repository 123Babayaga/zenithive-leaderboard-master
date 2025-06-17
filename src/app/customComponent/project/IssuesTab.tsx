// components/project/IssuesTab.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bug } from 'lucide-react';
import { IssueCard } from './IssueCard';
import { IssueListSkeleton } from '../ui/LoadingSpinner';
import { Issue } from '@/app/interface/projectInterface';

interface IssuesTabProps {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const IssuesTab: React.FC<IssuesTabProps> = ({ 
  issues, 
  loading, 
  error, 
  total 
}) => {
  if (loading) {
    return <IssueListSkeleton />;
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Error loading issues: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-8">
        <Bug className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">No issues found</h4>
        <p className="text-gray-500">This project doesn&apos;t have any issues yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
      
      {total > issues.length && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Showing {issues.length} of {total} issues
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Load More Issues
          </Button>
        </div>
      )}
    </div>
  );
};
