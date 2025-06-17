// components/project/ProjectCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, Settings } from 'lucide-react';
import { getProjectInitials, getProjectTypeColor, getCategoryColor } from '../../utils/project-utils';
import { Project } from '@/app/interface/projectInterface';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectKey: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {

  const [cost, setCost] = useState('');
  const [open, setOpen] = useState(false);

const handleAddCost = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/project-cost/project-cost`, {
      projectKey: project.key,
      cost: parseFloat(cost),
    });
    toast.success(`₹${cost} added successfully.`);
    setOpen(false);
    setCost('');
  } catch {
    toast.error('Failed to add cost.');
  }
};

  return (
    <Card className="relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
      {/* Add Cost Button */}
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
              Add Cost
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Project Cost</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="cost">Cost (₹)</Label>
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Enter project cost"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddCost}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-gray-100">
              <AvatarImage 
                src={project.avatarUrls['48x48']} 
                alt={project.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getProjectInitials(project.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-blue-600">
                {project.key}
              </CardDescription>
            </div>
          </div>
          {project.isPrivate && (
            <Badge variant="secondary" className="text-xs">
              Private
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Project Details */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className={`text-xs font-medium ${getProjectTypeColor(project.projectTypeKey)}`}
            >
              {project.projectTypeKey === 'software' ? 'Software' : 'Business'}
            </Badge>
            
            {project.projectCategory && (
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium ${getCategoryColor(project.projectCategory.name)}`}
              >
                {project.projectCategory.name}
              </Badge>
            )}
            
            <Badge variant="outline" className="text-xs">
              {project.style === 'next-gen' ? 'Next-Gen' : 'Classic'}
            </Badge>
          </div>

          {/* Category Description */}
          {project.projectCategory?.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.projectCategory.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => onViewDetails(project.key)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://zenithive-team.atlassian.net/jira/software/projects/${project.key}`, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="px-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};