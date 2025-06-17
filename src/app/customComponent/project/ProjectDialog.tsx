// components/project/ProjectDialog.tsx
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail, Clock } from 'lucide-react';
import { ProjectDetailsTab } from './ProjectDetailsTab';
import { IssuesTab } from './IssuesTab';
import { getProjectInitials } from '../../utils/project-utils';
import { Issue, Project, Worklog } from '@/app/interface/projectInterface';

interface TeamMember {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  roles: Set<string>; // 'assignee', 'reporter'
  issueCount: number;
  totalWorkHours: number; // Added work hours tracking
}

interface ProjectDialogProps {
  children: React.ReactNode;
  project: Project | null;
  projectDetailsLoading: boolean;
  projectDetailsError: string | null;
  issues: Issue[];
  issuesLoading: boolean;
  issuesError: string | null;
  issuesTotal: number;
}

// Helper function to format work hours
const formatWorkHours = (seconds: number): string => {
  if (seconds === 0) return '0h';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  children,
  project,
  projectDetailsLoading,
  projectDetailsError,
  issues,
  issuesLoading,
  issuesError,
  issuesTotal,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'issues' | 'team'>('details');

  // Extract team members from issues with work hours calculation
  const teamMembers = useMemo(() => {
    const membersMap = new Map<string, TeamMember>();

    issues.forEach((issue) => {
      // Calculate total work hours for this issue

      // Process assignee
      if (issue.fields.assignee) {
        const assignee = issue.fields.assignee;
        if (membersMap.has(assignee.accountId)) {
          const member = membersMap.get(assignee.accountId)!;
          member.roles.add('assignee');
          member.issueCount++;
          
          // Add work hours only if this person worked on the issue
          const memberWorkHours = issue.fields.worklog?.worklogs
            && Array.isArray(issue.fields.worklog.worklogs)
            ? issue.fields.worklog.worklogs
                .filter((worklog: { author: { accountId: string; }; }) => worklog.author.accountId === assignee.accountId)
                .reduce((total: number, worklog: { timeSpentSeconds: number; }) => total + (worklog.timeSpentSeconds || 0), 0)
            : 0;
          member.totalWorkHours += memberWorkHours;
        } else {
          const memberWorkHours = Array.isArray(issue.fields.worklog?.worklogs)
            ? issue.fields.worklog.worklogs
                .filter((worklog: { author: { accountId: string; }; }) => worklog.author.accountId === assignee.accountId)
                .reduce((total: number, worklog: { timeSpentSeconds: number; }) => total + (worklog.timeSpentSeconds || 0), 0)
            : 0;
            
          membersMap.set(assignee.accountId, {
            accountId: assignee.accountId,
            displayName: assignee.displayName,
            emailAddress: assignee.emailAddress,
            avatarUrls: assignee.avatarUrls,
            roles: new Set(['assignee']),
            issueCount: 1,
            totalWorkHours: memberWorkHours,
          });
        }
      }

      // Process reporter
      if (issue.fields.reporter) {
        const reporter = issue.fields.reporter;
        if (membersMap.has(reporter.accountId)) {
          const member = membersMap.get(reporter.accountId)!;
          member.roles.add('reporter');
          if (!member.roles.has('assignee')) {
            member.issueCount++;
          }
          
          // Add work hours only if this person worked on the issue and not already counted as assignee
          if (!member.roles.has('assignee')) {
            const memberWorkHours = Array.isArray(issue.fields.worklog?.worklogs)
              ? issue.fields.worklog.worklogs
                  .filter((worklog: { author: { accountId: string; }; }) => worklog.author.accountId === reporter.accountId)
                  .reduce((total: number, worklog: { timeSpentSeconds: number; }) => total + (worklog.timeSpentSeconds || 0), 0)
              : 0;
            member.totalWorkHours += memberWorkHours;
          }
        } else {
          const memberWorkHours = Array.isArray(issue.fields.worklog?.worklogs)
            ? issue.fields.worklog.worklogs
                .filter((worklog: { author: { accountId: string; }; }) => worklog.author.accountId === reporter.accountId)
                .reduce((total: number, worklog: { timeSpentSeconds: number; }) => total + (worklog.timeSpentSeconds || 0), 0)
            : 0;
            
          membersMap.set(reporter.accountId, {
            accountId: reporter.accountId,
            displayName: reporter.displayName,
            emailAddress: reporter.emailAddress,
            avatarUrls: reporter.avatarUrls,
            roles: new Set(['reporter']),
            issueCount: 1,
            totalWorkHours: memberWorkHours,
          });
        }
      }

      // Also process worklog authors who might not be assignees or reporters
      if (Array.isArray(issue.fields.worklog?.worklogs)) {
        issue.fields.worklog.worklogs.forEach((worklog: Worklog) => {
          const author = worklog.author;
          if (!membersMap.has(author.accountId)) {
            // This person worked on the issue but isn't assignee or reporter
            membersMap.set(author.accountId, {
              accountId: author.accountId,
              displayName: author.displayName,
              emailAddress: author.emailAddress,
              avatarUrls: typeof author.avatarUrls === 'string'
                ? { '48x48': author.avatarUrls, '24x24': author.avatarUrls, '16x16': author.avatarUrls, '32x32': author.avatarUrls }
                : author.avatarUrls,
              roles: new Set(['contributor']),
              issueCount: 0, // They didn't create or get assigned, just worked
              totalWorkHours: worklog.timeSpentSeconds || 0,
            });
          }
        });
      }
    });

    return Array.from(membersMap.values()).sort((a, b) => 
      b.totalWorkHours - a.totalWorkHours || b.issueCount - a.issueCount || a.displayName.localeCompare(b.displayName)
    );
  }, [issues]);

  const TeamMembersTab = () => {
    if (issuesLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading team members...</span>
        </div>
      );
    }

    if (issuesError) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Failed to load team members</div>
          <div className="text-sm text-gray-500">{issuesError}</div>
        </div>
      );
    }

    if (teamMembers.length === 0) {
      return (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">No team members found</div>
          <div className="text-sm text-gray-400 mt-1">Team members will appear when issues are assigned</div>
        </div>
      );
    }

    const totalProjectHours = teamMembers.reduce((sum, member) => sum + member.totalWorkHours, 0);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Team Members ({teamMembers.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Total: {formatWorkHours(totalProjectHours)}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.accountId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 border-2 border-gray-100">
                    <AvatarImage 
                      src={member.avatarUrls['48x48']} 
                      alt={member.displayName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {member.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {member.displayName}
                    </div>
                    
                    {member.emailAddress && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.emailAddress}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.from(member.roles).map((role) => (
                        <Badge 
                          key={role} 
                          variant="secondary" 
                          className={`text-xs ${
                            role === 'assignee' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : role === 'reporter'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {role === 'assignee' ? 'Assignee' : role === 'reporter' ? 'Reporter' : 'Contributor'}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>
                        {member.issueCount} issue{member.issueCount !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1 text-blue-600 font-medium">
                        <Clock className="h-3 w-3" />
                        <span>{formatWorkHours(member.totalWorkHours)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={project?.avatarUrls['48x48']} 
                alt={project?.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {project ? getProjectInitials(project.name) : 'PR'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">{project?.name}</div>
              <DialogDescription className="text-blue-600 font-medium">
                {project?.key}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Project Details
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'issues'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Issues ({issuesTotal})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Team Members ({teamMembers.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <ProjectDetailsTab
            project={project}
            loading={projectDetailsLoading}
            error={projectDetailsError}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesTab
            issues={issues}
            loading={issuesLoading}
            error={issuesError}
            total={issuesTotal}
          />
        )}

        {activeTab === 'team' && <TeamMembersTab />}
      </DialogContent>
    </Dialog>
  );
};