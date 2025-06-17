// components/project/IssueCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStatusColor, formatDate } from '../../utils/project-utils';
import { PriorityIcon } from '../icons/PriorityIcon';
import { Issue } from '@/app/interface/projectInterface';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <img 
          src={issue.fields.issuetype.iconUrl} 
          alt={issue.fields.issuetype.name}
          className="h-5 w-5 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h5 className="font-medium text-gray-900 mb-1 leading-tight">
              {issue.fields.summary}
            </h5>
            <Badge 
              variant="secondary" 
              className={`text-xs shrink-0 ${getStatusColor(issue.fields.status.statusCategory.name)}`}
            >
              {issue.fields.status.name}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span className="font-mono font-medium text-blue-600">
              {issue.key}
            </span>
            <span>Created {formatDate(issue.fields.created)}</span>
            {issue.fields.assignee && (
              <span>Assigned to {issue.fields.assignee.displayName}</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <PriorityIcon priorityName={issue.fields.priority.name} />
              <span className="text-xs text-gray-600">
                {issue.fields.priority.name}
              </span>
            </div>
            
            {issue.fields.labels.length > 0 && (
              <div className="flex gap-1">
                {issue.fields.labels.slice(0, 2).map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {issue.fields.labels.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{issue.fields.labels.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            {issue.fields.assignee && (
              <Avatar className="h-6 w-6 ml-auto">
                <AvatarImage 
                  src={issue.fields.assignee.avatarUrls['24x24']} 
                  alt={issue.fields.assignee.displayName}
                />
                <AvatarFallback className="text-xs">
                  {issue.fields.assignee.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};