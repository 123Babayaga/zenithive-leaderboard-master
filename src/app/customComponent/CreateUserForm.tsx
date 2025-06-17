// components/CreateUserForm.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FormErrors, UserFormData } from '@/types/user';

interface CreateUserFormProps {
  form: UserFormData;
  errors: FormErrors;
  isLoading: boolean;
  onFormChange: (field: keyof UserFormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  form,
  errors,
  isLoading,
  onFormChange,
  onSubmit,
  onCancel,
}) => {
  const formFields = [
    { id: 'name', label: 'Name', required: true, type: 'text', placeholder: 'Enter full name' },
    { id: 'email', label: 'Email', required: true, type: 'email', placeholder: 'Enter email address' },
    { id: 'department', label: 'Department', required: false, type: 'text', placeholder: 'Enter department' },
    { id: 'role', label: 'Role', required: false, type: 'text', placeholder: 'Enter role' },
    { id: 'salary', label: 'Annual Salary (₹)', required: false, type: 'number', placeholder: 'Enter annual salary' },
    { id: 'overhead', label: 'Overhead (%)', required: false, type: 'number', placeholder: 'Enter overhead percentage' },
    { id: 'monthlyHours', label: 'Monthly Hours', required: false, type: 'number', placeholder: 'Enter monthly hours' },
  ];

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl text-center text-gray-800">Add New Resource</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.id as keyof UserFormData]}
                onChange={(e) => onFormChange(field.id as keyof UserFormData, e.target.value)}
                className={errors[field.id as keyof FormErrors] ? 'border-red-500' : ''}
              />
              {errors[field.id as keyof FormErrors] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id as keyof FormErrors]}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button onClick={onSubmit} disabled={isLoading} className="flex-1">
            {isLoading ? 'Adding...' : 'Add Resource'}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateUserForm;