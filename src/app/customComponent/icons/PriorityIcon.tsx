// components/icons/PriorityIcon.tsx
import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Bug } from 'lucide-react';

interface PriorityIconProps {
  priorityName: string;
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({ priorityName }) => {
  switch (priorityName.toLowerCase()) {
    case 'highest':
    case 'high':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'low':
    case 'lowest':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default:
      return <Bug className="h-4 w-4 text-gray-500" />;
  }
};