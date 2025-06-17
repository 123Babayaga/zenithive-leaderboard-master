"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Project, Issue, Worklog } from '../../interface/projectInterface';
import { ProjectDialog } from './ProjectDialog';

interface ProjectTableProps {
  projects: Project[];
  onViewDetails: (projectKey: string) => void;
  selectedProject: Project | null;
  projectDetailsLoading: boolean;
  projectDetailsError: string | null;
  issues: Issue[];
  issuesLoading: boolean;
  issuesError: string | null;
  issuesTotal: number;
  allProjectsIssues?: { [projectKey: string]: Issue[] }; // Add this to track issues per project
}

interface ProjectTableData {
  id: string;
  name: string;
  hoursWorked: number;
  totalCost: number;
  profit: number;
  profitPercentage: number;
  hourlyRate: number;
}

// Helper function to format work hours (same as in ProjectDialog)
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

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onViewDetails,
  projectDetailsLoading,
  projectDetailsError,
  issues,
  issuesLoading,
  issuesError,
  issuesTotal,
  allProjectsIssues = {}
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProjectForDialog, setSelectedProjectForDialog] = useState<Project | null>(null);
  const [projectCosts, setProjectCosts] = useState<{ [projectKey: string]: number }>({});
  const [costsLoading, setCostsLoading] = useState(false);

  // Fetch project costs from API
  useEffect(() => {
    const fetchProjectCosts = async () => {
      setCostsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/project-cost/project-costs');
        if (response.ok) {
          const result = await response.json();
          setProjectCosts(result.data || {});
        } else {
          console.error('Failed to fetch project costs');
        }
      } catch (error) {
        console.error('Error fetching project costs:', error);
      } finally {
        setCostsLoading(false);
      }
    };

    if (projects.length > 0) {
      fetchProjectCosts();
    }
  }, [projects]);

  // Calculate work hours for each project using the same logic as ProjectDialog
  const projectHoursMap = useMemo(() => {
    const hoursMap: { [projectKey: string]: number } = {};
    
    // If we have issues for all projects, calculate hours for each
    Object.keys(allProjectsIssues).forEach(projectKey => {
      const projectIssues = allProjectsIssues[projectKey] || [];
      let totalProjectHours = 0;
      
      projectIssues.forEach((issue: Issue) => {
        if (Array.isArray(issue.fields.worklog?.worklogs)) {
          const issueHours = issue.fields.worklog.worklogs.reduce(
            (total: number, worklog: Worklog) => total + (worklog.timeSpentSeconds || 0), 
            0
          );
          totalProjectHours += issueHours;
        }
      });
      
      hoursMap[projectKey] = totalProjectHours;
    });
    
    return hoursMap;
  }, [allProjectsIssues]);

  // Transform projects data for table display
  const tableData: ProjectTableData[] = projects.map(project => {
    // Get actual work hours from worklog data (in seconds)
    const hoursWorkedSeconds = projectHoursMap[project.key] || 0;
    const hoursWorkedHours = hoursWorkedSeconds / 3600; // Convert to hours for calculation
    
    const hourlyRate = 200; // Will come from project settings API
    
    // Get total cost from API (this replaces the calculated cost)
    const totalCost = projectCosts[project.key] || 0;
    
    // Calculate profit: total cost - (hours worked * hourly rate)
    const laborCost = hoursWorkedHours * hourlyRate;
    const profit = totalCost - laborCost;
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return {
      id: project.key,
      name: project.name,
      hoursWorked: hoursWorkedSeconds, // Store in seconds for formatting
      totalCost,
      profit,
      profitPercentage,
      hourlyRate
    };
  });

  const handleRowClick = (project: Project) => {
    setSelectedProjectForDialog(project);
    onViewDetails(project.key);
    setDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hourly Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading project costs...
                  </td>
                </tr>
              ) : (
                tableData.map((row, index) => {
                  const project = projects[index];
                  return (
                    <tr 
                      key={row.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(project)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {row.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {row.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {row.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.hoursWorked > 0 ? formatWorkHours(row.hoursWorked) : 
                          <span className="text-gray-400 italic">0h</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(row.hourlyRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.totalCost > 0 ? formatCurrency(row.totalCost) : 
                          <span className="text-gray-400 italic">₹0</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${
                          row.profit > 0 ? 'text-green-600' : 
                          row.profit < 0 ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          {row.profit !== 0 ? formatCurrency(row.profit) : 
                            <span className="italic">₹0</span>
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.profitPercentage > 0 ? 'bg-green-100 text-green-800' : 
                          row.profitPercentage < 0 ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {formatPercentage(row.profitPercentage)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(project);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Dialog */}
      <ProjectDialog
        project={selectedProjectForDialog}
        projectDetailsLoading={projectDetailsLoading}
        projectDetailsError={projectDetailsError}
        issues={issues}
        issuesLoading={issuesLoading}
        issuesError={issuesError}
        issuesTotal={issuesTotal}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};