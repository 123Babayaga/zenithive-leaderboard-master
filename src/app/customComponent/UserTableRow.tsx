// components/UserTableRow.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { User } from '@/types/user';

interface UserTableRowProps {
  user: User;
  isEditing: boolean;
  tempData: Partial<User>;
  isAdmin: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onTempDataChange: (field: keyof User, value: string | number) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isEditing,
  tempData,
  isAdmin,
  isLoading,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onTempDataChange,
}) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </td>
      <td className="p-4">
        {isEditing ? (
          <Input
            value={tempData.role || ''}
            onChange={(e) => onTempDataChange('role', e.target.value)}
            className="w-32"
          />
        ) : (
          user.role || '-'
        )}
      </td>
      <td className="p-4">{user.department}</td>
      <td className="p-4">
        {isEditing ? (
          <Input
            type="number"
            value={tempData.salary || ''}
            onChange={(e) => onTempDataChange('salary', parseFloat(e.target.value) || 0)}
            className="w-32"
          />
        ) : (
          user.salary ? `₹${user.salary.toLocaleString()}` : '-'
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <Input
            type="number"
            value={tempData.overhead || ''}
            onChange={(e) => onTempDataChange('overhead', parseFloat(e.target.value) || 0)}
            className="w-24"
          />
        ) : (
          user.overhead ? `${user.overhead}%` : '-'
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <Input
            type="number"
            value={tempData.monthlyHours || ''}
            onChange={(e) => onTempDataChange('monthlyHours', parseFloat(e.target.value) || 0)}
            className="w-24"
          />
        ) : (
          user.monthlyHours || '-'
        )}
      </td>
      <td className="p-4 font-semibold text-green-600">
        {user.effectiveHourlyCost ? `₹${user.effectiveHourlyCost}` : '-'}
      </td>
      <td className="p-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSave}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserTableRow;