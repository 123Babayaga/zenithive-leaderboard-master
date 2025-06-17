// components/project/ProjectDetailsTab.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Globe, Lock, ExternalLink } from 'lucide-react';
import { getProjectTypeColor, getCategoryColor } from '../../utils/project-utils';
import { Project } from '@/app/interface/projectInterface';

interface ProjectDetailsTabProps {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

export const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ 
  project, 
  loading, 
  error 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Error loading project details: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No project details available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Description */}
      {project.description && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {project.description}
          </p>
        </div>
      )}
      
      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Project Lead</p>
              <p className="text-sm text-gray-900">
                {project.lead?.displayName || 'Not assigned'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Visibility</p>
              <div className="flex items-center gap-1">
                {project.isPrivate ? (
                  <Lock className="h-3 w-3 text-red-500" />
                ) : (
                  <Globe className="h-3 w-3 text-green-500" />
                )}
                <p className="text-sm text-gray-900">
                  {project.isPrivate ? 'Private' : 'Public'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Project Type</p>
            <Badge className={getProjectTypeColor(project.projectTypeKey)}>
              {project.projectTypeKey === 'software' ? 'Software' : 'Business'}
            </Badge>
          </div>
          
          {project.projectCategory && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
              <Badge className={getCategoryColor(project.projectCategory.name)}>
                {project.projectCategory.name}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Issue Types */}
      {project.issueTypes && project.issueTypes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Issue Types</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.issueTypes.map((issueType) => (
              <div 
                key={issueType.id} 
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
              >
                <img 
                  src={issueType.iconUrl} 
                  alt={issueType.name}
                  className="h-4 w-4"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {issueType.name}
                  </p>
                  {issueType.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {issueType.description}
                    </p>
                  )}
                </div>
                {issueType.subtask && (
                  <Badge variant="secondary" className="text-xs">
                    Subtask
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button 
          onClick={() => window.open(`https://zenithive-team.atlassian.net/jira/software/projects/${project.key}`, '_blank')}
          className="flex-1"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in JIRA
        </Button>
        {project.url && (
          <Button 
            variant="outline"
            onClick={() => window.open(project.url, '_blank')}
          >
            <Globe className="h-4 w-4 mr-2" />
            Project URL
          </Button>
        )}
      </div>
    </div>
  );
};