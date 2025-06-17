// utils/project-utils.ts
export const getProjectInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getProjectTypeColor = (type: string): string => {
  switch (type) {
    case 'software':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'business':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const getCategoryColor = (categoryName?: string): string => {
  if (!categoryName) return 'bg-gray-100 text-gray-800';
  
  switch (categoryName.toLowerCase()) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
    case 'unpaid':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const getStatusColor = (statusCategory: string): string => {
  switch (statusCategory.toLowerCase()) {
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'indeterminate':
      return 'bg-yellow-100 text-yellow-800';
    case 'new':
    case 'to do':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};