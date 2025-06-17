// components/project/ErrorState.tsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto p-6">
      <Alert className="max-w-2xl">
        <AlertDescription>
          Error loading projects: {error}
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm" 
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};