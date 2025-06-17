// components/UsersTable.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UserTableRow from './UserTableRow';
import { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  editingRow: string | null;
  tempRowData: Partial<User>;
  isAdmin: boolean;
  isLoading: boolean;
  onEdit: (userId: string) => void;
  onSave: (userId: string) => void;
  onCancel: () => void;
  onDelete: (userId: string) => void;
  onTempDataChange: (field: keyof User, value: string | number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  editingRow,
  tempRowData,
  isAdmin,
  isLoading,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onTempDataChange,
}) => {
  const tableHeaders = [
    'Name',
    'Role',
    'Department',
    'Salary (₹)',
    'Overhead (%)',
    'Monthly Hours',
    'Effective Hourly Cost (₹)',
    'Actions',
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                {tableHeaders.map((header) => (
                  <th key={header} className="text-left p-4 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  isEditing={editingRow === user._id}
                  tempData={tempRowData}
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                  onEdit={() => onEdit(user._id)}
                  onSave={() => onSave(user._id)}
                  onCancel={onCancel}
                  onDelete={() => onDelete(user._id)}
                  onTempDataChange={onTempDataChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTable;