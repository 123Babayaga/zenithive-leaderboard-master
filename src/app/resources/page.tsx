// Main ResourcePage component (shortened)
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CreateUserForm from '../customComponent/CreateUserForm';
import UsersTable from '../customComponent/UsersTable';
import CostSummaryCards from '../customComponent/CostSummaryCards';
import { useResourceAPI } from '../hooks/useResource';
import { CostSummary, FormErrors, User, UserFormData } from '@/types/user';
import { Plus } from 'lucide-react';

const ResourcePage = () => {
  const [form, setForm] = useState<UserFormData>({ 
    name: '', email: '', department: '', role: '', 
    salary: '', overhead: '', monthlyHours: '160' 
  });
  const [users, setUsers] = useState<User[]>([]);
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({ 
    name: '', email: '', salary: '', overhead: '', monthlyHours: '' 
  });
  const [isAdmin] = useState(true);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [tempRowData, setTempRowData] = useState<Partial<User>>({});

  const { isLoading, fetchUsers, fetchCostSummary, createUser, updateUser, deleteUser } = useResourceAPI();

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      if (isAdmin) {
        const data = await fetchCostSummary();
        setUsers(data.users);
        setCostSummary(data.summary);
      } else {
        const userData = await fetchUsers();
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { name: '', email: '', salary: '', overhead: '', monthlyHours: '' };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    try {
      await createUser({
        name: form.name,
        email: form.email,
        department: form.department,
        role: form.role,
        salary: form.salary ? Number(form.salary) : undefined,
        overhead: form.overhead ? Number(form.overhead) : undefined,
        monthlyHours: form.monthlyHours ? Number(form.monthlyHours) : 160
      });
      
      await loadData();
      setForm({ name: '', email: '', department: '', role: '', salary: '', overhead: '', monthlyHours: '160' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setEditingRow(userId);
      setTempRowData({ ...user });
    }
  };

  const handleSave = async (userId: string) => {
    try {
      await updateUser(userId, tempRowData);
      await loadData();
      setEditingRow(null);
      setTempRowData({});
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(userId);
      await loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setTempRowData({});
    if (showCreateForm) {
      setForm({ name: '', email: '', department: '', role: '', salary: '', overhead: '', monthlyHours: '160' });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {isAdmin && costSummary && <CostSummaryCards costSummary={costSummary} />}

      {isAdmin && !showCreateForm && (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Resource Management</h1>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Resource
          </Button>
        </div>
      )}

      {isAdmin && showCreateForm && (
        <CreateUserForm
          form={form}
          errors={errors}
          isLoading={isLoading}
          onFormChange={(field, value) => setForm({ ...form, [field]: value })}
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      )}

      <UsersTable
        users={users}
        editingRow={editingRow}
        tempRowData={tempRowData}
        isAdmin={isAdmin}
        isLoading={isLoading}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onTempDataChange={(field, value) => setTempRowData({ ...tempRowData, [field]: value })}
      />

      {users.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No resources found. Add your first resource to get started.
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default ResourcePage;